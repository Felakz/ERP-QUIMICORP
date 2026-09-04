import * as xlsx from 'xlsx';
import * as path from 'path';

function inspectRobertCanto() {
  const excelPath = path.resolve('/host/CONTROL DE VENTAS Y COBRANZAS.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Rep. Vtas y Cobranzas'];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet, { range: 5 });

  const cantoRows = rows.filter(r => 
    String(r['Cliente'] || '').toUpperCase().includes('CANTO') || 
    String(r['Cliente'] || '').toUpperCase().includes('ROBERT') || 
    String(r['RUC'] || '').includes('73940637')
  );

  console.log('================================================================');
  console.log('🔍 DETALLE DE FILAS DE JHON ROBERT CCANTO PÉREZ EN EL EXCEL');
  console.log('================================================================');

  let sumaTotalExacta = 0;

  cantoRows.forEach((r, idx) => {
    const total = Number(r['Total']) || 0;
    sumaTotalExacta += total;
    console.log(`Fila ${idx + 1}:`);
    console.log(`  • Comprobante:   ${r['Comprobante']}`);
    console.log(`  • Fecha / CMO:   ${r['Fecha']} / ${r['CMO']}`);
    console.log(`  • Producto:      ${r['Producto']}`);
    console.log(`  • Cantidad:      ${r['Cantidad']} ${r['Medida']}`);
    console.log(`  • P. Unit:       ${r['P. Unit']}`);
    console.log(`  • B. Imponible:  ${r['B. Imponible']}`);
    console.log(`  • Total Fila:    ${total} (sin redondear)`);
    console.log(`  • Estado:        ${r['Estado']}`);
    console.log('----------------------------------------------------------------');
  });

  console.log(`\n💰 SUMA TOTAL EXACTA (FLOAT): ${sumaTotalExacta}`);
  console.log(`💰 SUMA TOTAL REDONDEADA:     S/. ${sumaTotalExacta.toFixed(2)}`);
  console.log('================================================================');
}

inspectRobertCanto();
