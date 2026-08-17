import * as xlsx from 'xlsx';
import * as path from 'path';

const excelPath = path.resolve(__dirname, '../../../FORMULACIONES CLIENTES- DARIO.xlsx');
const wb = xlsx.readFile(excelPath);

console.log('Sheets:', wb.SheetNames);

['ALFALION', 'DAVID SARMIENTO', 'JHON CANTO'].forEach(sName => {
  if (wb.Sheets[sName]) {
    console.log(`\n=== SHEET: ${sName} ===`);
    const rows: any[][] = xlsx.utils.sheet_to_json(wb.Sheets[sName], { header: 1 });
    rows.slice(0, 20).forEach((r, idx) => {
      if (r && r.length > 0 && r.some(c => c !== null && c !== '')) {
        console.log(`Fila ${idx}:`, JSON.stringify(r));
      }
    });
  }
});
