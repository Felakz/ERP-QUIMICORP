import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function analyze() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔍 ANÁLISIS DE COINCIDENCIA: INVENTARIO REAL VS FÓRMULAS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Obtener los 231 insumos reales de la hoja "INSUMOS PRODUCCION"
  const excelPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
  const workbook = xlsx.readFile(excelPath);
  const worksheet = workbook.Sheets['INSUMOS PRODUCCION'];
  const rawRows = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  const dataRows = rawRows.slice(2);

  const insumosInventario = new Map<string, { nombre: string; peso: number; unidad: string; categoria: string }>();

  for (const row of dataRows) {
    const prod = row[1];
    if (prod && String(prod).trim() !== '') {
      const nombreNorm = String(prod).trim().toUpperCase();
      insumosInventario.set(nombreNorm, {
        nombre: nombreNorm,
        peso: typeof row[5] === 'number' ? row[5] : parseFloat(row[5]) || 0,
        unidad: String(row[6] || 'GR').trim().toUpperCase(),
        categoria: String(row[2] || 'INSUMOS').trim().toUpperCase(),
      });
    }
  }

  console.log(`📦 Insumos Oficiales en Hoja "INSUMOS PRODUCCION": ${insumosInventario.size}`);

  // 2. Extraer todos los ingredientes únicos que piden las fórmulas
  const formulasDataPath = path.resolve(__dirname, '../../../frontend/lib/formulasData.ts');
  const fileContent = fs.readFileSync(formulasDataPath, 'utf8');
  const jsonMatch = fileContent.match(/export const FORMULAS_MAESTRAS_REALES: FormulaProducto\[\] = (\[[\s\S]*?\]);/);
  const formulasRaw: any[] = jsonMatch ? JSON.parse(jsonMatch[1]) : [];

  const ingredientesFormulas = new Map<string, { vecesUsado: number; formulas: string[] }>();

  for (const f of formulasRaw) {
    if (Array.isArray(f.ingredientes)) {
      for (const ing of f.ingredientes) {
        const nom = String(ing.componente).trim().toUpperCase();
        if (!ingredientesFormulas.has(nom)) {
          ingredientesFormulas.set(nom, { vecesUsado: 0, formulas: [] });
        }
        const entry = ingredientesFormulas.get(nom)!;
        entry.vecesUsado++;
        if (!entry.formulas.includes(f.codigoFM)) {
          entry.formulas.push(f.codigoFM);
        }
      }
    }
  }

  console.log(`🧪 Ingredientes Únicos Requeridos por las ${formulasRaw.length} Fórmulas: ${ingredientesFormulas.size}\n`);

  // 3. Comparación y Mapeo
  const exactos: string[] = [];
  const similares: { ingrediente: string; matchInventario: string; similitud: string }[] = [];
  const noEncontrados: { ingrediente: string; vecesUsado: number; formulas: string[] }[] = [];

  for (const [ingNom, info] of ingredientesFormulas.entries()) {
    if (insumosInventario.has(ingNom)) {
      exactos.push(ingNom);
    } else {
      // Buscar coincidencia parcial o similar
      let encontradoSimilar: string | null = null;
      for (const [invNom] of insumosInventario.entries()) {
        if (
          invNom.includes(ingNom) ||
          ingNom.includes(invNom) ||
          (invNom.replace(/\s+/g, '') === ingNom.replace(/\s+/g, '')) ||
          (invNom.replace(/DE\s+|DEL\s+|A\.E\s+/g, '') === ingNom.replace(/DE\s+|DEL\s+|A\.E\s+/g, ''))
        ) {
          encontradoSimilar = invNom;
          break;
        }
      }

      if (encontradoSimilar) {
        similares.push({
          ingrediente: ingNom,
          matchInventario: encontradoSimilar,
          similitud: 'Variación de sintaxis o prefijo',
        });
      } else {
        noEncontrados.push({
          ingrediente: ingNom,
          vecesUsado: info.vecesUsado,
          formulas: info.formulas,
        });
      }
    }
  }

  console.log(`--- RESULTADOS DEL CRUCE ---`);
  console.log(`✅ Coincidencias Exactas (100% Match): ${exactos.length} ingredientes (${((exactos.length / ingredientesFormulas.size) * 100).toFixed(1)}%)`);
  console.log(`⚠️ Coincidencias con Diferencia de Nombre/Sintaxis: ${similares.length} ingredientes (${((similares.length / ingredientesFormulas.size) * 100).toFixed(1)}%)`);
  console.log(`❌ No Encontrados en la Hoja "INSUMOS PRODUCCION": ${noEncontrados.length} ingredientes (${((noEncontrados.length / ingredientesFormulas.size) * 100).toFixed(1)}%)\n`);

  console.log('--- MUESTRA DE DIFERENCIAS DE SINTAXIS (Ejemplos Reales) ---');
  similares.slice(0, 10).forEach((s) => {
    console.log(`  • Fórmula: "${s.ingrediente.padEnd(30)}" <-> Inventario: "${s.matchInventario}"`);
  });

  console.log('\n--- TOP INGREDIENTES NO ENCONTRADOS EN HOJA DE INSUMOS ---');
  noEncontrados
    .sort((a, b) => b.vecesUsado - a.vecesUsado)
    .slice(0, 15)
    .forEach((ne) => {
      console.log(`  • "${ne.ingrediente.padEnd(32)}" -> Usado en ${ne.vecesUsado} fórmulas (Ej: ${ne.formulas.slice(0, 3).join(', ')})`);
    });
}

analyze()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
