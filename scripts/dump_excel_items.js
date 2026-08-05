const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('FORMATO DE KÁRDEX.xlsx');

const parsedData = [];

wb.SheetNames.forEach(sheetName => {
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  let currentItem = null;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;

    // Check if this row is a Product Header row (row has Familia, Categoria, Proveedor, Producto, Unid, Stock Inicial)
    const familia = r[0];
    const categoria = r[1];
    const proveedor = r[2];
    const producto = r[3];
    const unid = r[4];
    const stockInicial = r[5];

    if (producto && stockInicial !== undefined && stockInicial !== null && String(stockInicial).trim() !== '' && String(producto).trim() !== 'PRODUCTO') {
      // Save previous item if exists
      if (currentItem) {
        parsedData.push(currentItem);
      }

      currentItem = {
        sheetName,
        familia: familia ? String(familia).trim() : 'GENERAL',
        categoria: categoria ? String(categoria).trim() : sheetName,
        proveedor: proveedor ? String(proveedor).trim() : 'PROVEEDOR INDUSTRIAL',
        producto: String(producto).trim(),
        unidadMedida: unid ? String(unid).trim() : 'KG',
        stockInicial: parseFloat(stockInicial) || 0,
        movimientos: [],
      };
      continue;
    }

    // Check if movement row
    if (currentItem) {
      const fechaVal = r[6];
      const tipoDocVal = r[7];
      const serieVal = r[8];
      const numeroVal = r[9];
      const otroVal = r[10];
      const operacionVal = r[11];
      const entradaVal = r[12];
      const salidaVal = r[13];
      const saldoVal = r[14];

      // Ignore row if it's just an empty spacer or SALDO FINAL summary row without actual doc or amounts
      if (operacionVal === 'SALDO FINAL' && !tipoDocVal && !fechaVal) {
        continue;
      }

      if (tipoDocVal || operacionVal || entradaVal !== undefined || salidaVal !== undefined || fechaVal) {
        const ent = parseFloat(entradaVal) || 0;
        const sal = parseFloat(salidaVal) || 0;
        const sld = parseFloat(saldoVal);

        if (tipoDocVal || operacionVal || ent > 0 || sal > 0) {
          currentItem.movimientos.push({
            fechaRaw: fechaVal,
            tipoDoc: tipoDocVal ? String(tipoDocVal).trim() : 'OP',
            serie: serieVal ? String(serieVal).trim() : '',
            numero: numeroVal ? String(numeroVal).trim() : '',
            otro: otroVal ? String(otroVal).trim() : '',
            operacion: operacionVal ? String(operacionVal).trim() : 'AJUSTE',
            cantidadEntrada: ent,
            cantidadSalida: sal,
            saldoCalculado: !isNaN(sld) ? sld : null,
          });
        }
      }
    }
  }

  if (currentItem) {
    parsedData.push(currentItem);
  }
});

console.log(`Total productos extraídos de FORMATO DE KÁRDEX.xlsx: ${parsedData.length}`);

// Print sample items (e.g. ACIDO OLEICO)
const acidoOleico = parsedData.find(p => p.producto.toLowerCase().includes('oleico'));
console.log('ACIDO OLEICO DUMP:', JSON.stringify(acidoOleico, null, 2));

fs.writeFileSync('kardex_parsed_dump.json', JSON.stringify(parsedData, null, 2));
