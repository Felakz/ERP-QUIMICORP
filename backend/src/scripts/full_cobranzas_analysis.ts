import * as xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

interface ItemRow {
  comprobante: string;
  fecha: string;
  cmo: string;
  producto: string;
  cantidad: number;
  medida: string;
  pUnit: number;
  bImponible: number;
  totalFloat: number;
  estado: string;
  fechaPago?: string;
  medio?: string;
  canal?: string;
}

interface ComprobanteGroup {
  codigo: string;
  ruc: string;
  cliente: string;
  items: ItemRow[];
  totalFloat: number;
  totalRound: number;
  estado: string;
  fechaPago?: string;
  medio?: string;
}

interface ClientGroup {
  cliente: string;
  ruc: string;
  comprobantes: Map<string, ComprobanteGroup>;
  totalFacturadoFloat: number;
  totalFacturadoRound: number;
  totalPagadoRound: number;
  totalPendienteRound: number;
  pendientesCount: number;
  pagadosCount: number;
}

async function analyzeAllCobranzas() {
  const excelPath = path.resolve('/host/CONTROL DE VENTAS Y COBRANZAS.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Rep. Vtas y Cobranzas'];
  const rawRows: any[] = xlsx.utils.sheet_to_json(sheet, { range: 5 });

  console.log('========================================================================================');
  console.log('📊 AUDITORÍA Y ANÁLISIS TOTAL EXHAUSTIVO DE TODAS LAS VENTAS Y COBRANZAS (EXCEL)');
  console.log('========================================================================================\n');

  const clientsMap = new Map<string, ClientGroup>();

  // Procesar todas las filas válidas
  for (const [index, r] of rawRows.entries()) {
    const compRaw = String(r['Comprobante'] || '').trim();
    if (!compRaw) continue;

    const comp = compRaw.toUpperCase().replace(/\s+/g, '');
    const cliName = String(r['Cliente'] || 'SIN CLIENTE').trim().toUpperCase();
    const ruc = String(r['RUC'] || '').trim();
    const totalFloat = Number(r['Total']) || 0;
    const estadoRaw = String(r['Estado'] || 'Pendiente').trim();
    const fecha = String(r['Fecha'] || '');
    const cmo = String(r['CMO'] || '');
    const prod = String(r['Producto'] || '');
    const cant = Number(r['Cantidad']) || 0;
    const med = String(r['Medida'] || '');
    const pUnit = Number(r['P. Unit']) || 0;
    const bImp = Number(r['B. Imponible']) || 0;
    const fechaPago = r['Fecha Pago'] ? String(r['Fecha Pago']) : undefined;
    const medio = r['Medio'] ? String(r['Medio']) : undefined;
    const canal = r['Canal'] ? String(r['Canal']) : undefined;

    // Normalizar cliente key
    const clientKey = cliName;

    if (!clientsMap.has(clientKey)) {
      clientsMap.set(clientKey, {
        cliente: cliName,
        ruc: ruc,
        comprobantes: new Map(),
        totalFacturadoFloat: 0,
        totalFacturadoRound: 0,
        totalPagadoRound: 0,
        totalPendienteRound: 0,
        pendientesCount: 0,
        pagadosCount: 0,
      });
    }

    const client = clientsMap.get(clientKey)!;
    if (ruc && (!client.ruc || client.ruc === '')) client.ruc = ruc;

    if (!client.comprobantes.has(comp)) {
      client.comprobantes.set(comp, {
        codigo: comp,
        ruc: ruc,
        cliente: cliName,
        items: [],
        totalFloat: 0,
        totalRound: 0,
        estado: estadoRaw,
        fechaPago,
        medio,
      });
    }

    const inv = client.comprobantes.get(comp)!;
    inv.items.push({
      comprobante: comp,
      fecha,
      cmo,
      producto: prod,
      cantidad: cant,
      medida: med,
      pUnit,
      bImponible: bImp,
      totalFloat,
      estado: estadoRaw,
      fechaPago,
      medio,
      canal,
    });
    inv.totalFloat += totalFloat;
    if (estadoRaw.toLowerCase() === 'pagado') {
      inv.estado = 'Pagado';
    }
  }

  // Calcular totales por cliente
  let granTotalFacturadoFloat = 0;
  let granTotalFacturadoRound = 0;
  let granTotalPagado = 0;
  let granTotalPendiente = 0;
  let totalComprobantesUnicos = 0;
  let totalComprobantesPendientes = 0;
  let totalComprobantesPagados = 0;

  for (const client of clientsMap.values()) {
    for (const inv of client.comprobantes.values()) {
      inv.totalRound = Math.round(inv.totalFloat * 100) / 100;
      client.totalFacturadoFloat += inv.totalFloat;
      client.totalFacturadoRound += inv.totalRound;

      const isPaid = inv.estado.toLowerCase() === 'pagado';
      if (isPaid) {
        client.totalPagadoRound += inv.totalRound;
        client.pagadosCount++;
        totalComprobantesPagados++;
        granTotalPagado += inv.totalRound;
      } else {
        client.totalPendienteRound += inv.totalRound;
        client.pendientesCount++;
        totalComprobantesPendientes++;
        granTotalPendiente += inv.totalRound;
      }
      totalComprobantesUnicos++;
    }
    granTotalFacturadoFloat += client.totalFacturadoFloat;
    granTotalFacturadoRound += client.totalFacturadoRound;
  }

  // Desglose por cliente
  console.log(`🏢 TOTAL CLIENTES CON REGISTROS EN EL EXCEL: ${clientsMap.size}`);
  console.log(`📑 TOTAL COMPROBANTES ÚNICOS EN EL EXCEL:    ${totalComprobantesUnicos}`);
  console.log(`✅ COMPROBANTES PAGADOS:                    ${totalComprobantesPagados}`);
  console.log(`⏳ COMPROBANTES PENDIENTES:                 ${totalComprobantesPendientes}`);
  console.log(`💰 GRAN TOTAL FACTURADO (EXACTO FLOAT):     S/. ${granTotalFacturadoFloat.toFixed(6)}`);
  console.log(`💰 GRAN TOTAL FACTURADO (REDONDEADO):       S/. ${granTotalFacturadoRound.toFixed(2)}`);
  console.log(`✅ TOTAL COBRADO / PAGADO:                   S/. ${granTotalPagado.toFixed(2)}`);
  console.log(`⏳ TOTAL SALDO PENDIENTE REAL:              S/. ${granTotalPendiente.toFixed(2)}`);
  console.log('========================================================================================\n');

  // Imprimir cliente por cliente
  let clienteIdx = 1;
  for (const client of clientsMap.values()) {
    console.log(`----------------------------------------------------------------------------------------`);
    console.log(`👤 CLIENTE #${clienteIdx++}: ${client.cliente} (RUC: ${client.ruc || 'S/N'})`);
    console.log(`   Total Facturado: S/. ${client.totalFacturadoRound.toFixed(2)} | Pagado: S/. ${client.totalPagadoRound.toFixed(2)} | Pendiente: S/. ${client.totalPendienteRound.toFixed(2)}`);
    console.log(`   Comprobantes (${client.comprobantes.size} docs: ${client.pagadosCount} pagados, ${client.pendientesCount} pendientes):`);

    for (const inv of client.comprobantes.values()) {
      const isMulti = inv.items.length > 1;
      const statusIcon = inv.estado.toLowerCase() === 'pagado' ? '✅ PAGADO' : '⏳ PENDIENTE';
      console.log(`   • [${inv.codigo}] | ${statusIcon} | Total: S/. ${inv.totalRound.toFixed(2)} (Float: ${inv.totalFloat.toFixed(6)}) | ${inv.items.length} ${inv.items.length === 1 ? 'producto' : 'PRODUCTOS'}`);
      
      if (isMulti || inv.estado.toLowerCase() !== 'pagado') {
        for (const [itIdx, it] of inv.items.entries()) {
          console.log(`       - Item ${itIdx + 1}: ${it.producto} | Cant: ${it.cantidad} ${it.medida} | P.U: S/. ${it.pUnit} | Subtotal: S/. ${it.totalFloat.toFixed(4)}`);
        }
      }
    }
    console.log('');
  }

  console.log('========================================================================================');
  console.log('🏁 RESUMEN GENERAL DE SALDOS PENDIENTES POR COBRAR:');
  console.log('========================================================================================');

  for (const client of clientsMap.values()) {
    if (client.totalPendienteRound > 0) {
      console.log(`🔴 ${client.cliente} (RUC: ${client.ruc}):`);
      console.log(`   Deuda Pendiente: S/. ${client.totalPendienteRound.toFixed(2)}`);
      for (const inv of client.comprobantes.values()) {
        if (inv.estado.toLowerCase() !== 'pagado') {
          console.log(`     - Doc: ${inv.codigo} | Total: S/. ${inv.totalRound.toFixed(2)} (${inv.items.length} ítems)`);
        }
      }
    }
  }

  console.log('========================================================================================\n');
}

analyzeAllCobranzas()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
