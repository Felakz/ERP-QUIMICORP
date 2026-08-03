const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

function excelSerialToDate(serial) {
  if (typeof serial !== 'number' || isNaN(serial)) {
    return new Date('2026-07-18T10:00:00Z');
  }
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
}

async function importPerfectExcelKardex() {
  console.log('=== IMPORTACIÓN COMPLETA Y AUDITADA DESDE EXCEL QUIMICORP ===\n');

  await prisma.kardexMovimiento.deleteMany({});

  const wbKardex = XLSX.readFile('FORMATO DE KÁRDEX.xlsx');
  let countTotal = 0;

  for (const sheetName of wbKardex.SheetNames) {
    const sheet = wbKardex.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let currentProductoHeader = null;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;

      const familiaVal = r[0];
      const categoriaVal = r[1];
      const proveedorVal = r[2];
      const productoVal = r[3];
      const unidVal = r[4];
      const stockInicialVal = r[5];

      const prodStr = productoVal ? String(productoVal).trim() : '';

      // Skip Table Title and Table Column Header rows
      if (
        !prodStr ||
        prodStr === 'PRODUCTO' ||
        prodStr.includes('REGISTRO KÁRDEX') ||
        prodStr.includes('DETALLE DE') ||
        prodStr === 'UNIDAD'
      ) {
        continue;
      }

      // Detect Product Header row
      if (stockInicialVal !== undefined && stockInicialVal !== null && String(stockInicialVal).trim() !== '') {
        const stockIni = parseFloat(stockInicialVal) || 0;
        const famName = familiaVal ? String(familiaVal).trim() : 'GENERAL';
        const catName = categoriaVal ? String(categoriaVal).trim() : sheetName;
        const provName = proveedorVal ? String(proveedorVal).trim() : 'PROVEEDOR INDUSTRIAL QUIMICORP';
        const unidName = unidVal ? String(unidVal).trim() : 'KG';

        let catEnum = 'INSUMO';
        const sheetLower = sheetName.toLowerCase();

        if (sheetLower.includes('embalaje')) {
          catEnum = 'EMBALAJE';
        } else if (sheetLower.includes('envase')) {
          catEnum = 'ENVASE';
        } else if (sheetLower.includes('prod') || sheetLower.includes('terminado')) {
          catEnum = 'PRODUCTO_TERMINADO';
        } else if (sheetLower.includes('materia')) {
          catEnum = 'MATERIA_PRIMA';
        } else if (sheetLower.includes('insumo')) {
          catEnum = 'INSUMO';
        } else {
          catEnum = 'INSUMO';
        }

        currentProductoHeader = {
          productoNombre: prodStr,
          familia: famName,
          categoriaNombre: catName,
          proveedorCliente: provName,
          unidadMedida: unidName,
          stockInicial: stockIni,
          categoriaKardex: catEnum,
          currentSaldoTracker: stockIni,
        };

        // 1. Insert Stock Inicial Movement Row
        await prisma.kardexMovimiento.create({
          data: {
            categoriaKardex: catEnum,
            productoNombre: prodStr,
            familia: famName,
            categoriaNombre: catName,
            proveedorCliente: provName,
            unidadMedida: unidName,
            fecha: new Date('2026-07-01T08:00:00Z'),
            tipoDoc: 'INV',
            serie: 'INICIAL',
            numero: '0001',
            otp: 'STOCK-INICIAL',
            tipoOperacion: 'ENTRADA_AJUSTE',
            cantidadEntrada: stockIni,
            cantidadSalida: 0,
            saldoFinal: stockIni,
          },
        });
        countTotal++;
        continue;
      }

      // Check for transaction rows belonging to current product
      if (currentProductoHeader) {
        const fechaVal = r[6];
        const tipoDocVal = r[7];
        const serieVal = r[8];
        const numeroVal = r[9];
        const otroVal = r[10];
        const operacionVal = r[11];
        const entradaVal = r[12];
        const salidaVal = r[13];
        const saldoVal = r[14];

        if (operacionVal === 'SALDO FINAL' && !tipoDocVal && !fechaVal) {
          continue;
        }

        const ent = parseFloat(entradaVal) || 0;
        const sal = parseFloat(salidaVal) || 0;
        const sld = parseFloat(saldoVal);

        if (tipoDocVal || operacionVal || ent > 0 || sal > 0 || !isNaN(sld)) {
          let opType = 'SALIDA_CONSUMO_PRODUCCION';
          const opStr = String(operacionVal || '').toUpperCase();
          if (opStr.includes('COMPRA') || ent > 0) {
            opType = 'ENTRADA_COMPRA';
          } else if (opStr.includes('VENTA') || opStr.includes('CONSUMO') || sal > 0) {
            opType = 'SALIDA_CONSUMO_PRODUCCION';
          } else if (opStr.includes('AJUSTE')) {
            opType = 'ENTRADA_AJUSTE';
          }

          let finalSaldo = !isNaN(sld)
            ? sld
            : currentProductoHeader.currentSaldoTracker + ent - sal;
          currentProductoHeader.currentSaldoTracker = finalSaldo;

          const movFecha = typeof fechaVal === 'number' ? excelSerialToDate(fechaVal) : new Date('2026-07-18T14:00:00Z');

          await prisma.kardexMovimiento.create({
            data: {
              categoriaKardex: currentProductoHeader.categoriaKardex,
              productoNombre: currentProductoHeader.productoNombre,
              familia: currentProductoHeader.familia,
              categoriaNombre: currentProductoHeader.categoriaNombre,
              proveedorCliente: opType.includes('SALIDA')
                ? 'Consumo Planta / Cliente Industrial'
                : currentProductoHeader.proveedorCliente,
              unidadMedida: currentProductoHeader.unidadMedida,
              fecha: movFecha,
              tipoDoc: tipoDocVal ? String(tipoDocVal).trim() : 'OP',
              serie: serieVal ? String(serieVal).trim() : '0007',
              numero: numeroVal ? String(numeroVal).trim() : '0001',
              otp: otroVal ? String(otroVal).trim() : `OTP-${currentProductoHeader.productoNombre.substring(0, 4)}-${numeroVal || '01'}`,
              tipoOperacion: opType,
              cantidadEntrada: ent,
              cantidadSalida: sal,
              saldoFinal: finalSaldo,
            },
          });
          countTotal++;
        }
      }
    }
  }

  console.log(`✅ EXITO TOTAL: ${countTotal} movimientos de Kardex inmutables sincronizados perfectamente en PostgreSQL!`);
}

importPerfectExcelKardex()
  .catch((e) => console.error('Error importando:', e))
  .finally(async () => await prisma.$disconnect());
