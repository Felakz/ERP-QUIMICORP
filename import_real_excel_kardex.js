const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

async function importRealExcelKardex() {
  console.log('=== IMPORTANDO DATOS REALES DE FORMATO DE KÁRDEX.xlsx Y DE INVENTARIO 2026 ===');

  // Clear existing kardex_movimientos to load real plant records
  await prisma.kardexMovimiento.deleteMany({});

  // 1. Cargar datos de FORMATO DE KÁRDEX.xlsx
  const kardexWb = XLSX.readFile('FORMATO DE KÁRDEX.xlsx');
  
  // Sheet INSUMOS & ENVASES & EMBALAJE
  for (const sheetName of kardexWb.SheetNames) {
    const sheet = kardexWb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let currentFamilia = '';
    let currentCategoria = 'INSUMO';
    let currentProveedor = '';
    let currentProducto = '';
    let currentUnidad = 'KG';
    let currentSaldo = 0;

    for (let r = 5; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const familiaVal = row[0];
      const categoriaVal = row[1];
      const proveedorVal = row[2];
      const productoVal = row[3];
      const unidadVal = row[4];
      const stockInicialVal = row[5];

      // Detect header row for a new item
      if (productoVal && String(productoVal).trim() !== '' && stockInicialVal !== undefined) {
        currentFamilia = familiaVal || currentFamilia || 'GENERAL';
        currentCategoria = categoriaVal || sheetName;
        currentProveedor = proveedorVal || 'PROVEEDOR INDUSTRIAL';
        currentProducto = String(productoVal).trim();
        currentUnidad = unidadVal || 'KG';
        currentSaldo = parseFloat(stockInicialVal) || 0;

        let catKardex = 'INSUMO';
        const sheetLower = sheetName.toLowerCase();
        if (sheetLower.includes('envase')) catKardex = 'ENVASE';
        else if (sheetLower.includes('embalaje')) catKardex = 'EMBALAJE';
        else if (currentFamilia.toLowerCase().includes('aceite') || currentFamilia.toLowerCase().includes('ácido') || currentFamilia.toLowerCase().includes('solvente')) {
          catKardex = 'MATERIA_PRIMA';
        }

        // Insert initial stock entry movement
        await prisma.kardexMovimiento.create({
          data: {
            categoriaKardex: catKardex,
            productoNombre: currentProducto,
            familia: String(currentFamilia),
            categoriaNombre: String(currentCategoria),
            proveedorCliente: String(currentProveedor),
            unidadMedida: String(currentUnidad),
            fecha: new Date('2024-07-01T08:00:00Z'),
            tipoDoc: 'INVENTARIO',
            serie: 'INICIAL',
            numero: '0001',
            otp: 'INICIAL',
            tipoOperacion: 'ENTRADA_COMPRA',
            cantidadEntrada: currentSaldo,
            cantidadSalida: 0,
            saldoFinal: currentSaldo,
          },
        });
        continue;
      }

      // Check for transaction movement row
      const fechaVal = row[6];
      const tipoDocVal = row[7];
      const serieVal = row[8];
      const numeroVal = row[9];
      const operacionVal = row[11];
      const entradaVal = row[12];
      const salidaVal = row[13];
      const saldoVal = row[14];

      if ((tipoDocVal || operacionVal) && currentProducto) {
        let catKardex = 'INSUMO';
        const sheetLower = sheetName.toLowerCase();
        if (sheetLower.includes('envase')) catKardex = 'ENVASE';
        else if (sheetLower.includes('embalaje')) catKardex = 'EMBALAJE';
        else if (currentFamilia.toLowerCase().includes('aceite') || currentFamilia.toLowerCase().includes('ácido') || currentFamilia.toLowerCase().includes('solvente')) {
          catKardex = 'MATERIA_PRIMA';
        }

        const qtyEntrada = parseFloat(entradaVal) || 0;
        const qtySalida = parseFloat(salidaVal) || 0;
        let finalSaldo = parseFloat(saldoVal);
        if (isNaN(finalSaldo)) {
          finalSaldo = currentSaldo + qtyEntrada - qtySalida;
        }
        currentSaldo = finalSaldo;

        let opType = 'ENTRADA_COMPRA';
        const opStr = String(operacionVal || '').toUpperCase();
        if (opStr.includes('VENTA') || opStr.includes('CONSUMO')) {
          opType = 'SALIDA_CONSUMO_PRODUCCION';
        } else if (opStr.includes('COMPRA')) {
          opType = 'ENTRADA_COMPRA';
        }

        let fechaMov = new Date('2024-07-28T10:00:00Z');
        if (typeof fechaVal === 'number') {
          // Excel serial date to JS Date
          fechaMov = new Date((fechaVal - (25567 + 2)) * 86400 * 1000);
        }

        await prisma.kardexMovimiento.create({
          data: {
            categoriaKardex: catKardex,
            productoNombre: currentProducto,
            familia: String(currentFamilia),
            categoriaNombre: String(currentCategoria),
            proveedorCliente: opType.includes('SALIDA') ? 'Cliente Industrial / Consumo Planta' : String(currentProveedor),
            unidadMedida: String(currentUnidad),
            fecha: fechaMov,
            tipoDoc: String(tipoDocVal || 'OP'),
            serie: String(serieVal || '0007'),
            numero: String(numeroVal || '0001'),
            otp: `OTP-${currentProducto.substring(0, 4)}-${numeroVal || '01'}`,
            tipoOperacion: opType,
            cantidadEntrada: qtyEntrada,
            cantidadSalida: qtySalida,
            saldoFinal: finalSaldo,
          },
        });
      }
    }
  }

  // 2. Cargar datos de Productos Terminados desde INVENTARIO QUIMICORP FINAL 2026.xlsx
  const invWb = XLSX.readFile('INVENTARIO QUIMICORP FINAL 2026.xlsx');
  if (invWb.SheetNames.includes('PRODUCTOS TERMINADOS STOCK')) {
    const sheet = invWb.Sheets['PRODUCTOS TERMINADOS STOCK'];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row[0]) continue;

      const productoNombre = String(row[0]).trim();
      const cliente = row[1] ? String(row[1]).trim() : 'Stock Alquimia / Quimicorp';
      const color = row[2] ? String(row[2]).trim() : 'Estándar';
      const pesoStr = String(row[3] || '10 KG').replace(/[^0-9.]/g, '');
      const peso = parseFloat(pesoStr) || 20;

      await prisma.kardexMovimiento.create({
        data: {
          categoriaKardex: 'PRODUCTO_TERMINADO',
          productoNombre,
          familia: 'Productos Terminados Alquimia',
          categoriaNombre: `Color: ${color}`,
          proveedorCliente: cliente,
          unidadMedida: String(row[3]).toLowerCase().includes('lt') ? 'L' : 'KG',
          fecha: new Date('2024-08-01T10:00:00Z'),
          tipoDoc: 'OP',
          serie: 'LOTE',
          numero: `PT-2024-${String(r).padStart(4, '0')}`,
          otp: `OTP-PT-${String(r).padStart(3, '0')}`,
          tipoOperacion: 'ENTRADA_PRODUCCION',
          cantidadEntrada: peso,
          cantidadSalida: 0,
          saldoFinal: peso,
        },
      });
    }
  }

  console.log('✅ Importación exitosa de FORMATO DE KÁRDEX.xlsx y INVENTARIO QUIMICORP FINAL 2026.xlsx a PostgreSQL!');
}

importRealExcelKardex()
  .catch((e) => console.error('Error importando kardex:', e))
  .finally(async () => await prisma.$disconnect());
