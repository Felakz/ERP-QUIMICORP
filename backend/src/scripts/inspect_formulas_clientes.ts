import * as xlsx from 'xlsx';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../../../FORMULACIONES CLIENTES- DARIO.xlsx');
const workbook = xlsx.readFile(filePath);

console.log('=== HOJAS EN "FORMULACIONES CLIENTES- DARIO.xlsx" ===');
console.log(workbook.SheetNames);

workbook.SheetNames.forEach((name, i) => {
  const sheet = workbook.Sheets[name];
  const rows = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  console.log(`\n📄 Hoja [${i + 1}]: "${name}" -> ${rows.length} filas.`);
  console.log('   Muestra primeras 5 filas:');
  rows.slice(0, 5).forEach((r, idx) => console.log(`     Fila ${idx + 1}:`, JSON.stringify(r)));
});
