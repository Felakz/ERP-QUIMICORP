import * as xlsx from 'xlsx';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
const workbook = xlsx.readFile(filePath);

const sheetName = 'INSUMOS PRODUCCION';
const sheet = workbook.Sheets[sheetName];
const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

// Cabecera en fila 2 (index 1)
const header = rawRows[1];
console.log('Cabeceras oficiales:', header);

const dataRows = rawRows.slice(2);
console.log(`Total filas de datos brutas: ${dataRows.length}`);

const items: any[] = [];
const categoriasCount: Record<string, number> = {};
const unidadesCount: Record<string, number> = {};
const proveedoresCount: Record<string, number> = {};

dataRows.forEach((row, i) => {
  const itemNum = row[0];
  const producto = row[1]?.toString().trim();
  const categoria = row[2]?.toString().trim() || 'SIN_CATEGORIA';
  const provAnterior = row[3]?.toString().trim() || null;
  const provActual = row[4]?.toString().trim() || null;
  const peso = row[5];
  const unidad = row[6]?.toString().trim() || 'KG';

  if (producto) {
    items.push({
      itemNum,
      producto,
      categoria,
      provAnterior,
      provActual,
      peso: typeof peso === 'number' ? peso : parseFloat(peso) || 0,
      unidad,
    });

    categoriasCount[categoria] = (categoriasCount[categoria] || 0) + 1;
    unidadesCount[unidad] = (unidadesCount[unidad] || 0) + 1;
    if (provActual) {
      proveedoresCount[provActual] = (proveedoresCount[provActual] || 0) + 1;
    }
  }
});

console.log(`\n📦 Total Insumos Válidos encontrados: ${items.length}`);

console.log('\n--- Distribución por Categoría Oficial ---');
Object.entries(categoriasCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  • ${cat.padEnd(25)}: ${count} insumos`);
  });

console.log('\n--- Unidades de Medida Utilizadas ---');
Object.entries(unidadesCount).forEach(([u, count]) => {
  console.log(`  • ${u.padEnd(10)}: ${count} registros`);
});

console.log('\n--- Top 10 Proveedores Actuales ---');
Object.entries(proveedoresCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([prov, count]) => {
    console.log(`  • ${prov.padEnd(25)}: ${count} insumos`);
  });

console.log('\n--- Muestra de Insumos por Categoría ---');
const categoriasUnicas = Array.from(new Set(items.map(i => i.categoria)));
categoriasUnicas.forEach(cat => {
  const ejemplos = items.filter(i => i.categoria === cat).slice(0, 3);
  console.log(`\nCategoría: [${cat}] (${items.filter(i => i.categoria === cat).length} total)`);
  ejemplos.forEach(ej => {
    console.log(`   - Item ${ej.itemNum}: "${ej.producto}" | Stock: ${ej.peso} ${ej.unidad} | Proveedor: ${ej.provActual || 'N/A'}`);
  });
});
