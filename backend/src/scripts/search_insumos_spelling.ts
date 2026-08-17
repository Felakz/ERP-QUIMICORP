import * as xlsx from 'xlsx';
import * as path from 'path';

const excelPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const workbook = xlsx.readFile(excelPath);
const worksheet = workbook.Sheets['INSUMOS PRODUCCION'];
const rawRows = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
const dataRows = rawRows.slice(2);

const items = dataRows.map(r => String(r[1] || '').trim().toUpperCase()).filter(Boolean);

console.log('--- Búsquedas específicas en INSUMOS PRODUCCION ---');
const terms = ['AGUA', 'ALOE', 'ALHOE', 'DEHY', 'ROMERO', 'CARBO', 'MENTOL', 'KOJICO', 'AMAMELIS', 'HAMAMELIS'];
for (const t of terms) {
  const found = items.filter(i => i.includes(t));
  console.log(`Búsqueda "${t}":`, found);
}
