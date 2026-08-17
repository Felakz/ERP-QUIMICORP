import * as path from 'path';
import * as XLSX from 'xlsx';

const rootDir = path.resolve(__dirname, '../../..');

function inspect(fileName: string) {
  const filePath = path.join(rootDir, fileName);
  console.log(`\n========================================`);
  console.log(`📊 ARCHIVO: ${fileName}`);
  console.log(`========================================`);
  try {
    const wb = XLSX.readFile(filePath);
    console.log('Hojas disponibles:', wb.SheetNames);
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`\n--- Hoja: "${sheetName}" (Total filas: ${rows.length}) ---`);
      for (let i = 0; i < Math.min(6, rows.length); i++) {
        console.log(`Fila ${i}:`, JSON.stringify(rows[i]));
      }
    }
  } catch (err: any) {
    console.error(`Error leyendo ${fileName}:`, err.message);
  }
}

inspect('INVENTARIO QUIMICORP FINAL 2026.xlsx');
inspect('FORMATO DE KÁRDEX.xlsx');
