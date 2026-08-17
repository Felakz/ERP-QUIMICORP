import * as xlsx from 'xlsx';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const workbook = xlsx.readFile(filePath);

const sheetName = 'INSUMOS PRODUCCION';
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.error(`Hoja "${sheetName}" no encontrada. Hojas disponibles:`, workbook.SheetNames);
  process.exit(1);
}

const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

console.log(`=== HOJA: "${sheetName}" ===`);
console.log(`Total de filas detectadas en hoja: ${rawData.length}`);

// Inspeccionar las primeras 15 filas para entender cabeceras y estructura
console.log('\n--- Primeras 15 filas en crudo ---');
rawData.slice(0, 15).forEach((row, idx) => {
  console.log(`Fila ${idx + 1}:`, JSON.stringify(row));
});

// Convertir con cabeceras automáticas
const jsonData = xlsx.utils.sheet_to_json(sheet) as any[];
console.log(`\nTotal registros con cabecera: ${jsonData.length}`);
console.log('\n--- Primeros 10 registros procesados ---');
console.log(JSON.stringify(jsonData.slice(0, 10), null, 2));

// Obtener todas las columnas presentes
const keys = new Set<string>();
jsonData.forEach(item => {
  Object.keys(item).forEach(k => keys.add(k));
});
console.log('\n--- Columnas / Campos encontrados ---');
console.log(Array.from(keys));
