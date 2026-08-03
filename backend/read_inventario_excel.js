const fs = require('fs');
const XLSX = require('xlsx');

const excelPath = 'C:\\Users\\JUANA CASSANA\\OneDrive\\Documentos\\ERP QUIMICORP\\ERP-QUIMICORP\\INVENTARIO QUIMICORP FINAL 2026.xlsx';

const workbook = XLSX.readFile(excelPath);
console.log('HOJAS TOTALES:', workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- HOJA: "${sheetName}" (${jsonData.length} filas) ---`);
  // Print non-empty first 10 rows
  jsonData.slice(0, 15).forEach((row, idx) => {
    if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
      console.log(`  Row ${idx + 1}:`, row.filter(c => c !== null && c !== undefined && c !== ''));
    }
  });
});
