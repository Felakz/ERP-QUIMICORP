const XLSX = require('xlsx');
const fs = require('fs');

const files = ['FORMATO DE KÁRDEX.xlsx', 'INVENTARIO QUIMICORP FINAL 2026.xlsx', 'FORMULAS ACTUALES.xlsx'];

files.forEach(fname => {
  if (!fs.existsSync(fname)) return;
  console.log('==================================================');
  console.log('FILE:', fname);
  const wb = XLSX.readFile(fname);
  console.log('Sheet names:', wb.SheetNames);
  wb.SheetNames.forEach(sheetName => {
    console.log('\n--- Sheet:', sheetName);
    const sheet = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log('Total rows:', json.length);
    json.slice(0, 15).forEach((r, idx) => {
      if (r && r.length) console.log(`  Row ${idx + 1}:`, JSON.stringify(r));
    });
  });
});
