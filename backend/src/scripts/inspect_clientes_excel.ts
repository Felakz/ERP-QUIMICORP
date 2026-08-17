import * as xlsx from 'xlsx';
import * as path from 'path';

const excelPath = path.resolve(__dirname, '../../../FORMULACIONES CLIENTES- DARIO.xlsx');
const workbook = xlsx.readFile(excelPath);

console.log('--- HOJAS / CLIENTES EN FORMULACIONES CLIENTES- DARIO.xlsx ---');
console.log(`Total Hojas: ${workbook.SheetNames.length}`);
console.log(workbook.SheetNames);

for (const sheetName of workbook.SheetNames.slice(0, 5)) {
  const ws = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<any[]>(ws, { header: 1 });
  console.log(`\n📄 Hoja / Cliente: "${sheetName}" (${data.length} filas)`);
  // Mostrar filas que contienen nombres de productos (usualmente encabezados o filas con texto en col 0 o 1)
  data.slice(0, 20).forEach((row, i) => {
    const rowStr = row.filter(Boolean).join(' | ');
    if (rowStr) console.log(`  Fila ${i + 1}: ${rowStr}`);
  });
}
