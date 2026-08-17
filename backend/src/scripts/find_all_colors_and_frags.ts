import * as xlsx from 'xlsx';
import * as path from 'path';

const invPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const wbInv = xlsx.readFile(invPath);
const wsInv = wbInv.Sheets['INSUMOS PRODUCCION'];
const rowsInv = xlsx.utils.sheet_to_json<any[]>(wsInv, { header: 1 }).slice(2);

console.log('--- TODOS LOS COLORANTES Y PIGMENTOS EN INSUMOS PRODUCCION ---');
rowsInv.forEach(r => {
  const nom = String(r[1] || '').trim().toUpperCase();
  const cat = String(r[2] || '').trim().toUpperCase();
  if (nom.startsWith('COL.') || nom.includes('COLOR') || nom.includes('ANILINA') || cat.includes('COLOR') || cat.includes('PIGMENTO')) {
    console.log(`[Item ${r[0]}] ${nom} | Stock: ${r[5]} ${r[6]} | Categoria: ${cat}`);
  }
});

console.log('\n--- TODAS LAS FRAGANCIAS Y AROMAS EN INSUMOS PRODUCCION ---');
rowsInv.forEach(r => {
  const nom = String(r[1] || '').trim().toUpperCase();
  const cat = String(r[2] || '').trim().toUpperCase();
  if (nom.startsWith('FRAG.') || nom.startsWith('A.E') || nom.startsWith('SAB.') || cat.includes('FRAGANCIA')) {
    console.log(`[Item ${r[0]}] ${nom} | Stock: ${r[5]} ${r[6]}`);
  }
});
