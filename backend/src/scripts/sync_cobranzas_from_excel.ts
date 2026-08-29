import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

/**
 * CORRECCIÓN DE COBRANZAS DESDE EL EXCEL REAL
 * ---------------------------------------------
 * PROBLEMA: El seed anterior (sync_all_clients_and_cobranzas.ts) leía de
 * `COBRANZAS_EXCEL_SEED` (ya incompleto): solo 1 ítem por comprobante.
 * 12 comprobantes tienen múltiples ítems en el Excel real y quedaron
 * subestimados (ej. E001-183 = S/800 en BD, pero S/5,000 en el Excel).
 *
 * SOLUCIÓN: Este script lee DIRECTAMENTE el Excel "CONTROL DE VENTAS Y
 * COBRANZAS.xlsx" (fuente de verdad), agrupa las 74 líneas por
 * comprobante (61), suma los totales por ítem (col 8, con IGV) y hace
 * upsert en `cuentaCobrar`, corrigiendo los montos y saldos.
 *
 * EJECUTAR (desde backend/):
 *   npx ts-node src/scripts/sync_cobranzas_from_excel.ts
 *
 * Es idempotente: por comprobante (codigoDoc) actualiza o crea.
 */

const prisma = new PrismaClient();

const EXCEL_PATH = path.resolve(
  __dirname,
  '../../../CONTROL DE VENTAS Y COBRANZAS.xlsx',
);

// Columnas de la hoja "Rep. Vtas y Cobranzas" (cabecera ïndice 5)
// 0 Fecha | 2 Comprobante | 5 Producto | 8 Total(con IGV) | 9 RUC
// 10 Cliente | 12 Orden Produccion | 13 Condicion | 14 Estado
// 15 Fecha Pago | 16 Medio | 17 Canal

function serialToDate(serial: any): Date | null {
  if (!serial && serial !== 0) return null;
  if (typeof serial === 'number') {
    return new Date(Math.round((serial - 25569) * 86400 * 1000));
  }
  const d = new Date(serial as string);
  return isNaN(d.getTime()) ? null : d;
}

function diasPlazoSegunCondicion(cond: string): number {
  const c = (cond || '').toLowerCase();
  if (c.includes('60')) return 60;
  if (c.includes('20')) return 20;
  if (c.includes('15')) return 15;
  if (c.includes('07') || c.includes('7')) return 7;
  return 0;
}

function normalizarCondicion(cond: string): string {
  const c = (cond || '').trim();
  if (!c) return 'Contado';
  if (c.toLowerCase().includes('credito')) return c;
  return 'Contado';
}

function normalizarEstado(estado: string, cond: string, fechaVenc: Date): string {
  const e = (estado || '').trim().toLowerCase();
  if (e === 'pagado') return 'PAGADO';
  if (e === 'pendiente') return 'PENDIENTE';
  // Estado vacío + condición de crédito => pendiente
  if (!e) return 'PENDIENTE';
  return 'PENDIENTE';
}

async function main() {
  console.log('--- CORRIGIENDO COBRANZAS DESDE EXCEL REAL ---');

  if (!require('fs').existsSync(EXCEL_PATH)) {
    throw new Error(`No se encontró el Excel: ${EXCEL_PATH}`);
  }

  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets['Rep. Vtas y Cobranzas'];
  if (!ws) throw new Error('No se encontró la hoja "Rep. Vtas y Cobranzas"');

  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // 1. Filtrar filas de datos (comprobante E001-* / EB01-*)
  const data = rows.filter(
    (r) => /^(E001|EB01)/i.test(String(r[2] || '').trim()),
  );
  console.log(`Filas de datos en Excel: ${data.length}`);

  // 2. Agrupar por comprobante (clave normalizada) y sumar ítems
  const grupos = new Map<
    string,
    {
      claveOriginal: string;
      total: number;
      estado: string;
      cond: string;
      medio: string;
      canal: string;
      orden: string;
      fechaEmision: Date | null;
      fechaPago: Date | null;
      cliente: string;
      ruc: string;
      productos: string[];
    }
  >();

  const norm = (s: string) => (s || '').trim().toUpperCase();

  for (const r of data) {
    const clave = norm(String(r[2]));
    if (!grupos.has(clave)) {
      grupos.set(clave, {
        claveOriginal: String(r[2]).trim(),
        total: 0,
        estado: '',
        cond: '',
        medio: '',
        canal: '',
        orden: '',
        fechaEmision: null,
        fechaPago: null,
        cliente: String(r[10] || '').trim(),
        ruc: String(r[9] || '').trim(),
        productos: [],
      });
    }
    const g = grupos.get(clave)!;
    g.total += Number(r[8]) || 0;
    g.estado = String(r[14] || '').trim() || g.estado;
    g.cond = String(r[13] || '').trim() || g.cond;
    g.medio = String(r[16] || '').trim() || g.medio;
    g.canal = String(r[17] || '').trim() || g.canal;
    g.orden = String(r[12] || '').trim() || g.orden;
    if (!g.fechaEmision) g.fechaEmision = serialToDate(r[0]);
    if (!g.fechaPago) g.fechaPago = serialToDate(r[15]);
    const prod = String(r[5] || '').trim();
    if (prod) g.productos.push(prod);
  }

  console.log(`Comprobantes únicos (agrupados): ${grupos.size}`);

  // 3. Mapa de códigos existentes en BD (normalizado -> código real almacenado)
  const existentes = await prisma.cuentaCobrar.findMany({
    select: { codigoDoc: true },
  });
  const codigoRealPorNorm = new Map<string, string>();
  for (const c of existentes) {
    codigoRealPorNorm.set(norm(c.codigoDoc), c.codigoDoc);
  }

  // 4. Mapa de clientes por RUC para vincular clienteId
  const clientes = await prisma.cliente.findMany({
    select: { id: true, ruc: true },
  });
  const clienteIdPorRuc = new Map<string, string>();
  for (const c of clientes) {
    const ruc = (c.ruc || '').replace(/\.0$/, '').trim();
    clienteIdPorRuc.set(ruc, c.id);
  }

  let creados = 0;
  let actualizados = 0;

  for (const [claveNorm, g] of grupos) {
    const montoTotal = Number(g.total.toFixed(2));
    const dias = diasPlazoSegunCondicion(g.cond);
    const fechaEmision = g.fechaEmision || new Date();
    const fechaPago = g.fechaPago;
    const fechaVenc = new Date(
      fechaEmision.getTime() + dias * 24 * 60 * 60 * 1000,
    );

    const estado =
      g.estado.toLowerCase() === 'pagado'
        ? 'PAGADO'
        : 'PENDIENTE';

    // Saldo pendiente: si está PAGADO => 0; si no => monto total
    const saldoPendiente = estado === 'PAGADO' ? 0 : montoTotal;

    // Si pagado pero tiene fecha de pago, usar esa; las cuentas PAGADAS
    // del seed ya estaban liquidadas con saldo 0.
    const clienteRuc = g.ruc.replace(/\.0$/, '').trim();
    const clienteId = clienteIdPorRuc.get(clienteRuc) || null;

    // Producto: concatenar los ítems del comprobante
    const producto = g.productos.length
      ? g.productos.join(' + ')
      : 'Fórmula Industrial';

    // código real a usar en el upsert (mantener el string almacenado si existe)
    const codigoReal = codigoRealPorNorm.get(claveNorm) || g.claveOriginal;

    await prisma.cuentaCobrar.upsert({
      where: { codigoDoc: codigoReal },
      create: {
        codigoDoc: codigoReal,
        clienteId,
        clienteNombre: g.cliente,
        clienteRuc: g.ruc,
        ordenProd: g.orden || null,
        producto,
        montoTotal,
        saldoPendiente,
        condicionPago: g.cond || 'Contado',
        diasPlazo: dias,
        fechaEmision,
        fechaVencimiento: fechaVenc,
        fechaPago,
        estado,
        medioPago: g.medio || null,
        canalBanco: g.canal || null,
      },
      update: {
        clienteId,
        clienteNombre: g.cliente,
        clienteRuc: g.ruc,
        ordenProd: g.orden || null,
        producto,
        montoTotal,
        saldoPendiente,
        condicionPago: g.cond || 'Contado',
        diasPlazo: dias,
        fechaEmision,
        fechaVencimiento: fechaVenc,
        fechaPago,
        estado,
        medioPago: g.medio || null,
        canalBanco: g.canal || null,
      },
    });

    const yaExistia = codigoRealPorNorm.has(claveNorm);
    if (yaExistia) actualizados++;
    else creados++;
  }

  // 5. Verificación post-corrección
  const agg = await prisma.cuentaCobrar.aggregate({
    _sum: { montoTotal: true, saldoPendiente: true },
  });
  const totalDocs = await prisma.cuentaCobrar.count();

  console.log('--- RESULTADO ---');
  console.log(`Creadas: ${creados} | Actualizadas: ${actualizados}`);
  console.log(`Total cuentas en BD: ${totalDocs}`);
  console.log(
    `Total facturado (Σ montoTotal): S/${Number(agg._sum.montoTotal).toFixed(2)}`,
  );
  console.log(
    `Total saldo pendiente (Σ saldoPendiente): S/${Number(
      agg._sum.saldoPendiente,
    ).toFixed(2)}`,
  );
  console.log('(Esperado: facturado S/154663.05 | saldo ~S/58451.50)');
}

main()
  .catch((e) => {
    console.error('ERROR al corregir cobranzas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
