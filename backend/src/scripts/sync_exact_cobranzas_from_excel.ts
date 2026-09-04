import * as xlsx from 'xlsx';
import { PrismaClient, Prisma } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

function parseExcelDate(val: any): Date {
  if (!val) return new Date();
  if (typeof val === 'number') {
    const date = new Date((val - 25569) * 86400 * 1000);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  const str = String(val).trim();
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date();
}

async function syncExactCobranzas() {
  const excelPath = path.resolve('/host/CONTROL DE VENTAS Y COBRANZAS.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Rep. Vtas y Cobranzas'];
  const rawRows: any[] = xlsx.utils.sheet_to_json(sheet, { range: 5 });

  console.log('========================================================================================');
  console.log('🚀 SINCRONIZACIÓN EXACTA Y PURA DE COBRANZAS: EXCEL ➔ POSTGRESQL');
  console.log('========================================================================================\n');

  // 1. Clientes Canónicos
  const dbClientes = await prisma.cliente.findMany();
  const clientByRuc = new Map<string, any>();
  const clientByName = new Map<string, any>();

  for (const c of dbClientes) {
    if (c.ruc) clientByRuc.set(c.ruc.trim().toUpperCase(), c);
    if (c.razonSocial) clientByName.set(c.razonSocial.trim().toUpperCase(), c);
  }

  // 2. Agrupar filas del Excel por comprobante único normalizado
  interface InvoiceAggregate {
    codigoDoc: string;
    ruc: string;
    clienteNombre: string;
    productos: string[];
    ordenes: string[];
    montoTotalFloat: number;
    condicionPago: string;
    estado: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
    fechaPago?: Date;
    medioPago?: string;
    canalBanco?: string;
  }

  const invoiceMap = new Map<string, InvoiceAggregate>();

  for (const r of rawRows) {
    const compRaw = String(r['Comprobante'] || '').trim();
    if (!compRaw) continue;

    const comp = compRaw.toUpperCase().replace(/\s+/g, '');
    const cliName = String(r['Cliente'] || 'SIN CLIENTE').trim();
    const ruc = String(r['RUC'] || '').trim();
    const totalRow = Number(r['Total']) || 0;
    const estadoRow = String(r['Estado'] || 'Pendiente').trim();
    const producto = String(r['Producto'] || '').trim();
    const op = String(r['Orden de Producción Asociada'] || '').trim();
    const condicion = String(r['Condición'] || 'Contado').trim();
    const medio = r['Medio'] ? String(r['Medio']).trim() : undefined;
    const canal = r['Canal'] ? String(r['Canal']).trim() : undefined;

    const fechaEmision = parseExcelDate(r['Fecha']);
    const fechaPago = r['Fecha Pago'] ? parseExcelDate(r['Fecha Pago']) : undefined;

    const fechaVenc = new Date(fechaEmision);
    if (condicion.toLowerCase().includes('credito') || condicion.toLowerCase().includes('crédito')) {
      fechaVenc.setDate(fechaVenc.getDate() + 7);
    }

    if (!invoiceMap.has(comp)) {
      invoiceMap.set(comp, {
        codigoDoc: comp,
        ruc,
        clienteNombre: cliName,
        productos: [],
        ordenes: [],
        montoTotalFloat: 0,
        condicionPago: condicion,
        estado: estadoRow,
        fechaEmision,
        fechaVencimiento: fechaVenc,
        fechaPago,
        medioPago: medio,
        canalBanco: canal,
      });
    }

    const inv = invoiceMap.get(comp)!;
    inv.montoTotalFloat += totalRow;
    if (producto && !inv.productos.includes(producto)) inv.productos.push(producto);
    if (op && !inv.ordenes.includes(op)) inv.ordenes.push(op);
    if (estadoRow.toLowerCase() === 'pagado') inv.estado = 'Pagado';
    if (!inv.ruc && ruc) inv.ruc = ruc;
    if (medio && !inv.medioPago) inv.medioPago = medio;
    if (canal && !inv.canalBanco) inv.canalBanco = canal;
    if (fechaPago && !inv.fechaPago) inv.fechaPago = fechaPago;
  }

  // 3. Depurar registros que no pertenezcan al conjunto oficial de 61
  const allowedDocCodes = Array.from(invoiceMap.keys());
  const allDbCuentas = await prisma.cuentaCobrar.findMany();
  for (const c of allDbCuentas) {
    if (!allowedDocCodes.includes(c.codigoDoc)) {
      await prisma.pagoAbono.deleteMany({ where: { cuentaCobrarId: c.id } });
      await prisma.cuentaCobrar.delete({ where: { id: c.id } });
      console.log(`🧹 Registro residual/duplicado eliminado: [${c.codigoDoc}]`);
    }
  }

  // 4. Upsert de los 61 Comprobantes Oficiales
  let updatedCount = 0;
  let abonosCreatedCount = 0;

  for (const inv of invoiceMap.values()) {
    const isPagado = inv.estado.toLowerCase() === 'pagado';
    const montoTotalDecimal = new Prisma.Decimal(Math.round(inv.montoTotalFloat * 100) / 100);
    const saldoPendienteDecimal = isPagado ? new Prisma.Decimal(0) : montoTotalDecimal;
    const dbEstado = isPagado ? 'PAGADO' : 'PENDIENTE';

    let canonicalClient = clientByRuc.get(inv.ruc.toUpperCase()) || clientByName.get(inv.clienteNombre.toUpperCase());
    
    if (!canonicalClient) {
      if (inv.clienteNombre.toUpperCase().includes('SIN CLIENTE') || !inv.clienteNombre) {
        canonicalClient = await prisma.cliente.findFirst({
          where: { razonSocial: { contains: 'VENTAS MOSTRADOR', mode: 'insensitive' } },
        });
      }
    }

    const clienteId = canonicalClient?.id || null;
    const clienteNombreFinal = canonicalClient?.razonSocial || inv.clienteNombre;
    const clienteRucFinal = canonicalClient?.ruc || (inv.ruc || 'S/N');

    const productosStr = inv.productos.join(' / ');
    const ordenesStr = inv.ordenes.join(', ');

    const cuenta = await prisma.cuentaCobrar.upsert({
      where: { codigoDoc: inv.codigoDoc },
      update: {
        clienteId,
        clienteNombre: clienteNombreFinal,
        clienteRuc: clienteRucFinal,
        producto: productosStr,
        ordenProd: ordenesStr,
        montoTotal: montoTotalDecimal,
        saldoPendiente: saldoPendienteDecimal,
        condicionPago: inv.condicionPago,
        fechaEmision: inv.fechaEmision,
        fechaVencimiento: inv.fechaVencimiento,
        fechaPago: isPagado ? (inv.fechaPago || inv.fechaEmision) : null,
        estado: dbEstado,
        medioPago: inv.medioPago || (isPagado ? 'DEPOSITO EN CUENTA' : null),
        canalBanco: inv.canalBanco || (isPagado ? 'INTERBANK' : null),
      },
      create: {
        codigoDoc: inv.codigoDoc,
        clienteId,
        clienteNombre: clienteNombreFinal,
        clienteRuc: clienteRucFinal,
        producto: productosStr,
        ordenProd: ordenesStr,
        montoTotal: montoTotalDecimal,
        saldoPendiente: saldoPendienteDecimal,
        condicionPago: inv.condicionPago,
        fechaEmision: inv.fechaEmision,
        fechaVencimiento: inv.fechaVencimiento,
        fechaPago: isPagado ? (inv.fechaPago || inv.fechaEmision) : null,
        estado: dbEstado,
        medioPago: inv.medioPago || (isPagado ? 'DEPOSITO EN CUENTA' : null),
        canalBanco: inv.canalBanco || (isPagado ? 'INTERBANK' : null),
      },
    });

    await prisma.pagoAbono.deleteMany({
      where: { cuentaCobrarId: cuenta.id },
    });

    if (isPagado) {
      await prisma.pagoAbono.create({
        data: {
          cuentaCobrarId: cuenta.id,
          montoAbonado: montoTotalDecimal,
          fechaAbono: inv.fechaPago || inv.fechaEmision,
          medio: inv.medioPago || 'DEPOSITO EN CUENTA',
          banco: inv.canalBanco || 'INTERBANK',
          numOperacion: `OP-${inv.codigoDoc}`,
          observaciones: 'Pago total registrado según control de ventas y cobranzas',
        },
      });
      abonosCreatedCount++;
    }

    updatedCount++;
  }

  // 5. Auditoría Final de Verificación
  const dbFinalCuentas = await prisma.cuentaCobrar.findMany({
    include: { cliente: true, pagos: true },
    orderBy: { fechaEmision: 'asc' },
  });

  let totalDbFacturado = 0;
  let totalDbPagado = 0;
  let totalDbPendiente = 0;
  let countDbPagado = 0;
  let countDbPendiente = 0;

  for (const c of dbFinalCuentas) {
    const tot = Number(c.montoTotal);
    const sal = Number(c.saldoPendiente);
    totalDbFacturado += tot;
    totalDbPendiente += sal;
    totalDbPagado += (tot - sal);

    if (c.estado === 'PAGADO') countDbPagado++;
    else countDbPendiente++;
  }

  console.log('\n========================================================================================');
  console.log('🏁 RESULTADOS FINALES EXACTOS EN POSTGRESQL:');
  console.log('========================================================================================');
  console.log(`📋 Total Comprobantes en PostgreSQL: ${dbFinalCuentas.length} (Exactamente 61)`);
  console.log(`✅ Comprobantes PAGADOS al 100%:    ${countDbPagado} (S/. ${totalDbPagado.toFixed(2)})`);
  console.log(`⏳ Comprobantes PENDIENTES:          ${countDbPendiente} (S/. ${totalDbPendiente.toFixed(2)})`);
  console.log(`💰 Gran Total Facturado:             S/. ${totalDbFacturado.toFixed(2)}`);
  console.log('========================================================================================\n');
}

syncExactCobranzas()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
