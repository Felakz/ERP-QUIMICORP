import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const excelPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const workbook = xlsx.readFile(excelPath);
const worksheet = workbook.Sheets['INSUMOS PRODUCCION'];
const rawRows = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
const dataRows = rawRows.slice(2);

const insumosInventario = new Set<string>();
for (const row of dataRows) {
  const prod = row[1];
  if (prod && String(prod).trim() !== '') {
    insumosInventario.add(String(prod).trim().toUpperCase());
  }
}

// Extraer ingredientes de fórmulas
const formulasDataPath = path.resolve(__dirname, '../../../frontend/lib/formulasData.ts');
const fileContent = fs.readFileSync(formulasDataPath, 'utf8');
const jsonMatch = fileContent.match(/export const FORMULAS_MAESTRAS_REALES: FormulaProducto\[\] = (\[[\s\S]*?\]);/);
const formulasRaw: any[] = jsonMatch ? JSON.parse(jsonMatch[1]) : [];

const ingredientesMap = new Map<string, { veces: number; formulas: string[] }>();

for (const f of formulasRaw) {
  if (Array.isArray(f.ingredientes)) {
    for (const ing of f.ingredientes) {
      const nom = String(ing.componente).trim().toUpperCase();
      if (!ingredientesMap.has(nom)) {
        ingredientesMap.set(nom, { veces: 0, formulas: [] });
      }
      const entry = ingredientesMap.get(nom)!;
      entry.veces++;
      if (!entry.formulas.includes(`${f.codigoFM} (${f.nombreProducto})`)) {
        entry.formulas.push(`${f.codigoFM} (${f.nombreProducto})`);
      }
    }
  }
}

const noEncontrados: { nombre: string; veces: number; formulas: string[]; categoriaSugerida: string }[] = [];

for (const [nom, info] of ingredientesMap.entries()) {
  // Comprobar coincidencia exacta o directa
  if (!insumosInventario.has(nom)) {
    let cat = 'MATERIA_PRIMA_PENDIENTE';
    if (nom === 'FRAGANCIA' || nom.includes('ESENCIA') || nom.includes('AROMA')) {
      cat = 'PLACEHOLDER_GENERICO_AROMA';
    } else if (nom === 'COLORANTE' || nom.includes('ANILINA') || nom.includes('PIGMENTO')) {
      cat = 'PLACEHOLDER_GENERICO_COLOR';
    } else if (nom.startsWith('EXTRACTO') || nom.includes('EXTRACTO')) {
      cat = 'EXTRACTOS_NATURALES';
    } else if (nom.startsWith('ACEITE') || nom.includes('ACEITE')) {
      cat = 'ACEITES_Y_GRASAS';
    } else if (nom.includes('SILICONA') || nom.includes('BENCINA') || nom.includes('AUTOMOTRIZ')) {
      cat = 'LINEA_AUTOMOTRIZ_Y_SOLVENTES';
    } else if (nom.includes('JABON') || nom.includes('GLICERINA') || nom.includes('BASE')) {
      cat = 'LINEA_JABONERIA_Y_BASES';
    }

    noEncontrados.push({
      nombre: nom,
      veces: info.veces,
      formulas: info.formulas,
      categoriaSugerida: cat,
    });
  }
}

noEncontrados.sort((a, b) => b.veces - a.veces);

console.log(`Total No Encontrados en Hoja "INSUMOS PRODUCCION": ${noEncontrados.length}\n`);

// Agrupar por categoría
const grupos: Record<string, typeof noEncontrados> = {};
for (const item of noEncontrados) {
  if (!grupos[item.categoriaSugerida]) {
    grupos[item.categoriaSugerida] = [];
  }
  grupos[item.categoriaSugerida].push(item);
}

for (const [grupo, lista] of Object.entries(grupos)) {
  console.log(`\n===============================================================`);
  console.log(`🏷️  GRUPO: ${grupo} (${lista.length} ingredientes)`);
  console.log(`===============================================================`);
  lista.forEach((item, idx) => {
    console.log(`${String(idx + 1).padStart(2, '0')}. "${item.nombre.padEnd(35)}" | Usado en ${item.veces} fórmula(s)`);
    console.log(`    Ejemplos: ${item.formulas.slice(0, 2).join(' | ')}`);
  });
}
