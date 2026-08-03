const fs = require('fs');
const XLSX = require('xlsx');

const excelPath = 'C:\\Users\\JUANA CASSANA\\OneDrive\\Documentos\\ERP QUIMICORP\\ERP-QUIMICORP\\FORMATO DE KÁRDEX.xlsx';

if (!fs.existsSync(excelPath)) {
  console.log('No existe FORMATO DE KÁRDEX.xlsx');
  process.exit(0);
}

const workbook = XLSX.readFile(excelPath);
console.log('HOJAS EN FORMATO DE KÁRDEX.xlsx:', workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- HOJA: "${sheetName}" (${jsonData.length} filas) ---`);
  jsonData.slice(0, 20).forEach((row, idx) => {
    if (row && row.some(c => c !== null && c !== undefined && c !== '')) {
      console.log(`  Row ${idx + 1}:`, row.filter(c => c !== null && c !== undefined && c !== ''));
    }
  });
});
