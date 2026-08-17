import * as xlsx from 'xlsx';
import * as path from 'path';

const excelPath = path.resolve(__dirname, '../../../FRAGANCIAS, ACEITES ESENCIALES.xlsx');
const workbook = xlsx.readFile(excelPath);

const wsFrag = workbook.Sheets['FRAGANCIA '];
const dataFrag = xlsx.utils.sheet_to_json<any[]>(wsFrag, { header: 1 });

const fragancias: string[] = [];
const aceitesEsenciales: string[] = [];
const saborizantes: string[] = [];

for (let r = 3; r < dataFrag.length; r++) {
  const row = dataFrag[r];
  if (row[1] && String(row[1]).trim()) fragancias.push(String(row[1]).trim());
  if (row[4] && String(row[4]).trim()) aceitesEsenciales.push(String(row[4]).trim());
  if (row[7] && String(row[7]).trim()) saborizantes.push(String(row[7]).trim());
}

const wsCol = workbook.Sheets['COLORANTES'];
const dataCol = xlsx.utils.sheet_to_json<any[]>(wsCol, { header: 1 });

const colorAgua: string[] = [];
const colorGrasa: string[] = [];
const colorAcido: string[] = [];
const colorAlimenticio: string[] = [];

for (let r = 3; r < dataCol.length; r++) {
  const row = dataCol[r];
  if (row[1] && String(row[1]).trim()) colorAgua.push(String(row[1]).trim());
  if (row[4] && String(row[4]).trim()) colorGrasa.push(String(row[4]).trim());
  if (row[7] && String(row[7]).trim()) colorAcido.push(String(row[7]).trim());
  if (row[11] && String(row[11]).trim()) colorAlimenticio.push(String(row[11]).trim());
}

console.log('🌸 FRAGANCIAS (' + fragancias.length + '):', fragancias);
console.log('🌿 ACEITES ESENCIALES (' + aceitesEsenciales.length + '):', aceitesEsenciales);
console.log('🍬 SABORIZANTES (' + saborizantes.length + '):', saborizantes);
console.log('💧 COLORANTES AL AGUA (' + colorAgua.length + '):', colorAgua);
console.log('🧈 COLORANTES A LA GRASA (' + colorGrasa.length + '):', colorGrasa);
console.log('🧪 COLORANTES ÁCIDO (' + colorAcido.length + '):', colorAcido);
console.log('🍏 COLORANTES ALIMENTICIO (' + colorAlimenticio.length + '):', colorAlimenticio);
