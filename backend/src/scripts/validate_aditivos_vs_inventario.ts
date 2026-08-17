import * as xlsx from 'xlsx';
import * as path from 'path';

// 1. Leer los 231 insumos oficiales de INVENTARIO QUIMICORP FINAL 2026.xlsx (Hoja "INSUMOS PRODUCCION")
const invPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const wbInv = xlsx.readFile(invPath);
const wsInv = wbInv.Sheets['INSUMOS PRODUCCION'];
const rowsInv = xlsx.utils.sheet_to_json<any[]>(wsInv, { header: 1 }).slice(2);

const inventarioOficial: { item: number; codigo: string; nombre: string; categoria: string; stock: number; unidad: string }[] = [];

for (let i = 0; i < rowsInv.length; i++) {
  const row = rowsInv[i];
  const prod = row[1];
  if (prod && String(prod).trim()) {
    inventarioOficial.push({
      item: row[0],
      codigo: `INS-${String(inventarioOficial.length + 1).padStart(3, '0')}`,
      nombre: String(prod).trim().toUpperCase(),
      categoria: String(row[2] || '').trim().toUpperCase(),
      stock: typeof row[5] === 'number' ? row[5] : parseFloat(row[5]) || 0,
      unidad: String(row[6] || 'GR').trim().toUpperCase(),
    });
  }
}

console.log(`📦 Insumos Oficiales en Inventario: ${inventarioOficial.length}`);

// 2. Leer Aditivos de FRAGANCIAS, ACEITES ESENCIALES.xlsx
const aditivosPath = path.resolve(__dirname, '../../../FRAGANCIAS, ACEITES ESENCIALES.xlsx');
const wbAditivos = xlsx.readFile(aditivosPath);

// Hoja FRAGANCIA
const wsFrag = wbAditivos.Sheets['FRAGANCIA '];
const dataFrag = xlsx.utils.sheet_to_json<any[]>(wsFrag, { header: 1 });

const fragancias: string[] = [];
const aceitesEsenciales: string[] = [];
const saborizantes: string[] = [];

for (let r = 3; r < dataFrag.length; r++) {
  const row = dataFrag[r];
  if (row[1] && String(row[1]).trim()) fragancias.push(String(row[1]).trim().toUpperCase());
  if (row[4] && String(row[4]).trim()) aceitesEsenciales.push(String(row[4]).trim().toUpperCase());
  if (row[7] && String(row[7]).trim()) saborizantes.push(String(row[7]).trim().toUpperCase());
}

// Hoja COLORANTES
const wsCol = wbAditivos.Sheets['COLORANTES'];
const dataCol = xlsx.utils.sheet_to_json<any[]>(wsCol, { header: 1 });

const colorAgua: string[] = [];
const colorGrasa: string[] = [];
const colorAcido: string[] = [];
const colorAlimenticio: string[] = [];

for (let r = 3; r < dataCol.length; r++) {
  const row = dataCol[r];
  if (row[1] && String(row[1]).trim()) colorAgua.push(String(row[1]).trim().toUpperCase());
  if (row[4] && String(row[4]).trim()) colorGrasa.push(String(row[4]).trim().toUpperCase());
  if (row[7] && String(row[7]).trim()) colorAcido.push(String(row[7]).trim().toUpperCase());
  if (row[11] && String(row[11]).trim()) colorAlimenticio.push(String(row[11]).trim().toUpperCase());
}

// Función de Match
function matchItem(nombreBuscado: string, prefijos: string[]) {
  // 1. Match Exacto
  const exact = inventarioOficial.find(i => i.nombre === nombreBuscado);
  if (exact) return { tipo: 'EXACTO', item: exact };

  // 2. Match con Prefijos comunes (FRAG., FRAGANCIA, COL., A.E, AC. ES.)
  for (const pref of prefijos) {
    const conPref = `${pref} ${nombreBuscado}`;
    const matchPref = inventarioOficial.find(i => i.nombre === conPref || i.nombre.includes(conPref));
    if (matchPref) return { tipo: 'CON_PREFIJO', item: matchPref, matchNombre: matchPref.nombre };
  }

  // 3. Match Parcial de Contenido
  const matchParcial = inventarioOficial.find(i => 
    i.nombre.includes(nombreBuscado) || nombreBuscado.includes(i.nombre.replace(/FRAG\.\s*|COL\.\s*|A\.E\s*/g, ''))
  );
  if (matchParcial) return { tipo: 'PARCIAL', item: matchParcial, matchNombre: matchParcial.nombre };

  return null;
}

console.log('\n===============================================================');
console.log('🌸 1. VALIDACIÓN DE FRAGANCIAS (' + fragancias.length + ' items)');
console.log('===============================================================');
let fragMatchCount = 0;
fragancias.forEach((f, idx) => {
  const res = matchItem(f, ['FRAG.', 'FRAGANCIA', 'FRAG']);
  if (res) {
    fragMatchCount++;
    console.log(`✅ [${String(idx + 1).padStart(2, '0')}] "${f.padEnd(22)}" -> Match en Inventario: [${res.item.codigo}] "${res.item.nombre}" (${res.item.stock} ${res.item.unidad})`);
  } else {
    console.log(`❌ [${String(idx + 1).padStart(2, '0')}] "${f.padEnd(22)}" -> NO figura en INSUMOS PRODUCCION`);
  }
});
console.log(`📊 Coincidencia Fragancias: ${fragMatchCount} de ${fragancias.length} (${((fragMatchCount / fragancias.length) * 100).toFixed(1)}%)\n`);

console.log('===============================================================');
console.log('🌿 2. VALIDACIÓN DE ACEITES ESENCIALES (' + aceitesEsenciales.length + ' items)');
console.log('===============================================================');
let aeMatchCount = 0;
aceitesEsenciales.forEach((ae, idx) => {
  const limpio = ae.replace(/AC\.\s*ES\.\s*|A\.ES\.\s*|ACEITE\s*ESENCIAL\s*(DE\s*)?/g, '');
  const res = matchItem(limpio, ['A.E', 'A.E.', 'ACEITE ESENCIAL', 'AC. ES.']);
  if (res) {
    aeMatchCount++;
    console.log(`✅ [${String(idx + 1).padStart(2, '0')}] "${ae.padEnd(22)}" -> Match en Inventario: [${res.item.codigo}] "${res.item.nombre}" (${res.item.stock} ${res.item.unidad})`);
  } else {
    console.log(`❌ [${String(idx + 1).padStart(2, '0')}] "${ae.padEnd(22)}" -> NO figura en INSUMOS PRODUCCION`);
  }
});
console.log(`📊 Coincidencia Aceites Esenciales: ${aeMatchCount} de ${aceitesEsenciales.length} (${((aeMatchCount / aceitesEsenciales.length) * 100).toFixed(1)}%)\n`);

console.log('===============================================================');
console.log('🍬 3. VALIDACIÓN DE SABORIZANTES (' + saborizantes.length + ' items)');
console.log('===============================================================');
let sabMatchCount = 0;
saborizantes.forEach((s, idx) => {
  const res = matchItem(s, ['SABORIZANTE', 'SABOR']);
  if (res) {
    sabMatchCount++;
    console.log(`✅ [${String(idx + 1).padStart(2, '0')}] "${s.padEnd(22)}" -> Match en Inventario: [${res.item.codigo}] "${res.item.nombre}" (${res.item.stock} ${res.item.unidad})`);
  } else {
    console.log(`❌ [${String(idx + 1).padStart(2, '0')}] "${s.padEnd(22)}" -> NO figura en INSUMOS PRODUCCION`);
  }
});
console.log(`📊 Coincidencia Saborizantes: ${sabMatchCount} de ${saborizantes.length} (${((sabMatchCount / saborizantes.length) * 100).toFixed(1)}%)\n`);

console.log('===============================================================');
console.log('🎨 4. VALIDACIÓN DE COLORANTES');
console.log('===============================================================');
const colorantesTodos = [
  ...colorAgua.map(c => ({ tipo: 'AL AGUA', nombre: c })),
  ...colorGrasa.map(c => ({ tipo: 'A LA GRASA', nombre: c })),
  ...colorAcido.map(c => ({ tipo: 'ÁCIDO', nombre: c })),
  ...colorAlimenticio.map(c => ({ tipo: 'ALIMENTICIO', nombre: c })),
];

let colMatchCount = 0;
colorantesTodos.forEach((c, idx) => {
  const res = matchItem(c.nombre, ['COL.', 'COLORANTE', 'COL']);
  if (res) {
    colMatchCount++;
    console.log(`✅ [${String(idx + 1).padStart(2, '0')}] "${c.nombre.padEnd(12)}" (${c.tipo.padEnd(11)}) -> Match en Inventario: [${res.item.codigo}] "${res.item.nombre}" (${res.item.stock} ${res.item.unidad})`);
  } else {
    console.log(`❌ [${String(idx + 1).padStart(2, '0')}] "${c.nombre.padEnd(12)}" (${c.tipo.padEnd(11)}) -> NO figura en INSUMOS PRODUCCION`);
  }
});
console.log(`📊 Coincidencia Colorantes: ${colMatchCount} de ${colorantesTodos.length} (${((colMatchCount / colorantesTodos.length) * 100).toFixed(1)}%)\n`);
