import * as xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

async function auditGroupedByInvoice() {
  const excelPath = path.resolve('/host/CONTROL DE VENTAS Y COBRANZAS.xlsx');
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets['Rep. Vtas y Cobranzas'];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet, { range: 5 });

  console.log('================================================================');
  console.log('🔍 AUDITORÍA AGRUPADA POR COMPROBANTE (FACTURA / BOLETA COMPLETA)');
  console.log('================================================================\n');

  // Agrupar filas del Excel por comprobante normalizado
  const excelInvoices = new Map<string, {
    cliente: string;
    ruc: string;
    total: number;
    estados: Set<string>;
    items: number;
    fechas: string[];
    medios: string[];
  }>();

  for (const r of rows) {
    let comp = String(r['Comprobante'] || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!comp) continue;

    const tot = Number(r['Total']) || 0;
    const cli = String(r['Cliente'] || '').trim();
    const ruc = String(r['RUC'] || '').trim();
    const est = String(r['Estado'] || 'Pendiente').trim();
    const fecha = String(r['Fecha'] || '');
    const medio = String(r['Medio'] || '');

    if (!excelInvoices.has(comp)) {
      excelInvoices.set(comp, {
        cliente: cli,
        ruc: ruc,
        total: 0,
        estados: new Set(),
        items: 0,
        fechas: [],
        medios: [],
      });
    }

    const inv = excelInvoices.get(comp)!;
    inv.total += tot;
    inv.estados.add(est);
    inv.items++;
    if (fecha) inv.fechas.push(fecha);
    if (medio) inv.medios.push(medio);
  }

  console.log(`📑 Total Comprobantes Únicos en Excel: ${excelInvoices.size}`);

  const dbCuentas = await prisma.cuentaCobrar.findMany({
    include: { cliente: true },
  });

  console.log(`📋 Total Cuentas por Cobrar en Base de Datos: ${dbCuentas.length}\n`);

  const dbMap = new Map<string, any>();
  for (const c of dbCuentas) {
    const norm = c.codigoDoc.trim().toUpperCase().replace(/\s+/g, '');
    dbMap.set(norm, c);
  }

  let exactMatches = 0;
  let differences: any[] = [];
  let pendingListExcel: any[] = [];

  for (const [comp, excelData] of excelInvoices.entries()) {
    const isPaidExcel = Array.from(excelData.estados).every(e => e.toLowerCase() === 'pagado');
    const dbRecord = dbMap.get(comp);

    if (!isPaidExcel) {
      pendingListExcel.push({ comp, ...excelData, isPaidExcel });
    }

    if (!dbRecord) {
      differences.push({
        tipo: 'FALTA_EN_DB',
        comp,
        excel: excelData,
      });
    } else {
      const dbTotal = Number(dbRecord.montoTotal);
      const dbSaldo = Number(dbRecord.saldoPendiente);
      const dbIsPaid = dbRecord.estado === 'PAGADO';
      const diff = Math.abs(excelData.total - dbTotal);

      if (diff > 0.05 || isPaidExcel !== dbIsPaid) {
        differences.push({
          tipo: 'DESCUADRE_MONTO_O_ESTADO',
          comp,
          excelTotal: excelData.total,
          excelEstado: isPaidExcel ? 'PAGADO' : 'PENDIENTE',
          excelItems: excelData.items,
          dbTotal,
          dbSaldo,
          dbEstado: dbRecord.estado,
          cliente: excelData.cliente,
        });
      } else {
        exactMatches++;
      }
    }
  }

  console.log(`✅ Coincidencias 100% Exactas: ${exactMatches} comprobantes`);
  console.log(`⚠️ Descuadres / Diferencias: ${differences.length} comprobantes\n`);

  if (differences.length > 0) {
    console.log('--- DETALLE DE DIFERENCIAS ENTRE EXCEL Y DB ---');
    for (const d of differences) {
      if (d.tipo === 'DESCUADRE_MONTO_O_ESTADO') {
        console.log(`• Comprobante: ${d.comp} | Cliente: ${d.cliente}`);
        console.log(`  EXCEL (Suma de ${d.excelItems} líneas): S/. ${d.excelTotal.toFixed(2)} [${d.excelEstado}]`);
        console.log(`  DB:    Monto S/. ${d.dbTotal.toFixed(2)} | Saldo S/. ${d.dbSaldo.toFixed(2)} [${d.dbEstado}]`);
      } else {
        console.log(`• Comprobante NO encontrado en DB: ${d.comp} (${d.excel.cliente}) Total S/. ${d.excel.total.toFixed(2)}`);
      }
    }
  }

  console.log('\n--- CUENTAS PENDIENTES DE PAGO DETECTADAS EN EL EXCEL ---');
  for (const p of pendingListExcel) {
    console.log(`⏳ ${p.comp} | Cliente: ${p.cliente} | Monto Total: S/. ${p.total.toFixed(2)} | Estados: [${Array.from(p.estados).join(', ')}]`);
  }

  console.log('\n================================================================');
}

auditGroupedByInvoice()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
