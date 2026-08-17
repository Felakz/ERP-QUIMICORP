import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const excelPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const workbook = xlsx.readFile(excelPath);
const worksheet = workbook.Sheets['INSUMOS PRODUCCION'];
const rawRows = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
const dataRows = rawRows.slice(2);

const insumosInventario = new Map<string, string>();
for (const row of dataRows) {
  const prod = row[1];
  if (prod && String(prod).trim() !== '') {
    insumosInventario.set(String(prod).trim().toUpperCase(), String(row[0] || ''));
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
      if (!entry.formulas.includes(f.codigoFM)) {
        entry.formulas.push(f.codigoFM);
      }
    }
  }
}

// Lista detallada de todos los no encontrados
const listaDetalle: any[] = [];
for (const [nom, info] of ingredientesMap.entries()) {
  if (!insumosInventario.has(nom)) {
    listaDetalle.push({
      ingrediente: nom,
      veces: info.veces,
      formulas: info.formulas.join(', '),
    });
  }
}

listaDetalle.sort((a, b) => b.veces - a.veces);

fs.writeFileSync(
  path.resolve(__dirname, 'unmatched_full.json'),
  JSON.stringify(listaDetalle, null, 2),
  'utf8'
);

console.log(`Exportados ${listaDetalle.length} items a unmatched_full.json`);
