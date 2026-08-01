const XLSX = require('xlsx');

const wb = XLSX.readFile('FORMATO DE KÁRDEX.xlsx');

console.log('=== ANALIZANDO ESTRUCTURA EXACTA DE FORMATO DE KÁRDEX.xlsx ===\n');

wb.SheetNames.forEach(sheetName => {
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n========================================`);
  console.log(`HOJA: ${sheetName} (Total filas: ${rows.length})`);
  console.log(`========================================`);

  let itemsFound = 0;
  let movementsFound = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;

    // Check if this row is a Product Header definition
    const familia = r[0];
    const categoria = r[1];
    const proveedor = r[2];
    const producto = r[3];
    const unid = r[4];
    const stockInicial = r[5];

    if (producto && stockInicial !== undefined && stockInicial !== null && stockInicial !== '') {
      itemsFound++;
      console.log(`\n[PRODUCTO #${itemsFound}] ${producto}`);
      console.log(`   Familia: ${familia || 'N/A'} | Categ: ${categoria || 'N/A'} | Prov: ${proveedor || 'N/A'} | Unid: ${unid || 'N/A'} | Stock Inicial: ${stockInicial}`);
      
      // Look ahead for movement rows for this product
      for (let j = i + 1; j < rows.length; j++) {
        const mr = rows[j];
        if (!mr || mr.length === 0) continue;

        // If next row defines another product header (has column 3 and column 5), stop inner loop
        if (mr[3] && mr[5] !== undefined && mr[5] !== null && mr[5] !== '') {
          break;
        }

        const fecha = mr[6];
        const tipoDoc = mr[7];
        const serie = mr[8];
        const numero = mr[9];
        const otro = mr[10];
        const operacion = mr[11];
        const entradas = mr[12];
        const salidas = mr[13];
        const saldoFinal = mr[14];

        if (operacion || tipoDoc || fecha || saldoFinal !== undefined) {
          movementsFound++;
          console.log(`      -> Mov: Fecha=${fecha || 'N/A'}, Doc=${tipoDoc || 'N/A'} ${serie || ''}-${numero || ''}, Op=${operacion || 'N/A'}, Ent=${entradas || 0}, Sal=${salidas || 0}, Saldo=${saldoFinal}`);
        }
      }
    }
  }

  console.log(`\nResumen Hoja ${sheetName}: ${itemsFound} productos, ${movementsFound} movimientos.`);
});
