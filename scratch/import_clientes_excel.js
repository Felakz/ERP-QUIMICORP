const path = require('path');
const XLSX = require('xlsx');

const EXCEL_PATH = path.join(__dirname, '../CLIENTES QUIMICORP PERU SAC (1).xlsx');
const workbook = XLSX.readFile(EXCEL_PATH);

console.log('=== HOJAS EN EXCEL ===', workbook.SheetNames);

for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name];
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- HOJA: ${name} (Filas: ${json.length}) ---`);
  for (let i = 0; i < Math.min(10, json.length); i++) {
    console.log(`Fila ${i}:`, json[i]);
  }
}
