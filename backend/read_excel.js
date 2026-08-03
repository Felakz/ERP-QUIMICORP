const fs = require('fs');
const XLSX = require('xlsx');

const excelPath = 'C:\\Users\\JUANA CASSANA\\OneDrive\\Documentos\\ERP QUIMICORP\\PROGRAMACION DIARIA ORDENES DE PRODUCCION JULIO.xlsx';

console.log('Reading Excel:', excelPath);

if (!fs.existsSync(excelPath)) {
  console.error('File does not exist:', excelPath);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
console.log('SHEETS FOUND:', workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
  console.log(`\n========================================`);
  console.log(`SHEET: ${sheetName}`);
  console.log(`========================================`);
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log(`Total rows: ${jsonData.length}`);
  console.log(`First 35 rows:`);
  jsonData.slice(0, 35).forEach((row, idx) => {
    if (row && row.length > 0) {
      console.log(`Row ${idx + 1}:`, row.filter(cell => cell !== null && cell !== undefined && cell !== ''));
    }
  });
});
