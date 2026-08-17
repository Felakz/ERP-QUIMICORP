import * as xlsx from 'xlsx';
import * as path from 'path';

const excelPath = path.resolve(__dirname, '../../../FRAGANCIAS, ACEITES ESENCIALES.xlsx');
const workbook = xlsx.readFile(excelPath);

console.log('--- HOJAS EN FRAGANCIAS, ACEITES ESENCIALES.xlsx ---');
console.log(workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  const ws = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<any[]>(ws, { header: 1 });
  console.log(`\n📄 Hoja: "${sheetName}" -> ${data.length} filas`);
  console.log('Primeras 6 filas:');
  data.slice(0, 6).forEach((row, i) => console.log(`  Fila ${i + 1}:`, row));
}
