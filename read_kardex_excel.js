const XLSX = require('xlsx');

['FORMATO DE KÁRDEX.xlsx', 'INVENTARIO QUIMICORP FINAL 2026.xlsx'].forEach(fname => {
  try {
    console.log('\n==================================================');
    console.log('FILE:', fname);
    const wb = XLSX.readFile(fname);
    console.log('Sheet Names:', wb.SheetNames);
    wb.SheetNames.forEach(sheetName => {
      console.log(`\n=== SHEET: ${sheetName} ===`);
      const sheet = wb.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log('Total rows:', data.length);
      data.slice(0, 15).forEach((row, index) => {
        if (row && row.length > 0) {
          console.log(`Row ${index + 1}:`, JSON.stringify(row));
        }
      });
    });
  } catch (e) {
    console.error('Error reading file:', e);
  }
});
