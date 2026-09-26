/* Read-only diagnosis. No UPDATE/INSERT/DELETE, no historical repair. */
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient, Prisma } = require('@prisma/client');
const env = path.resolve(__dirname, '../.env');
if (fs.existsSync(env)) process.loadEnvFile(env);
const prisma = new PrismaClient();
const out = path.resolve(__dirname, '../../reports/kardex-units');
const near = (a, b) => Math.abs(a - b) < 0.011;

async function main() {
  const data = await prisma.$transaction(async tx => {
    await tx.$executeRaw`SET TRANSACTION READ ONLY`;
    const insumos = await tx.insumo.findMany({ select: { id: true, codigo: true, nombre: true, unidadMedida: true, stockReal: true, costoUnitario: true } });
    const movimientos = await tx.kardexMovimiento.findMany({ orderBy: [{ fecha: 'asc' }, { id: 'asc' }] });
    const inmutables = await tx.kardexInmutable.findMany({ orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });
    const ordenes = await tx.ordenProduccion.findMany({ include: { formula: { include: { detalles: true } }, pedidoComercial: { select: { unidadMedida: true } } } });
    return { insumos, movimientos, inmutables, ordenes };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead, timeout: 60000 });
  const items = new Map(data.insumos.map(i => [i.id, i]));
  const orders = new Map(data.ordenes.map(o => [o.codigoLote, o]));
  const candidatos = [];
  for (const m of data.movimientos) {
    const insumo = items.get(m.insumoId);
    if (!insumo || !['GR', 'KG'].includes(insumo.unidadMedida) || m.tipoDoc !== 'OP' || m.cantidadSalida <= 0) continue;
    const order = orders.get(m.numero);
    const detail = order?.formula.detalles.find(d => d.insumoId === m.insumoId);
    if (!order || !detail) continue;
    const unit = order.pedidoComercial?.unidadMedida || 'KG';
    let kg = Number(order.cantidadPlanificada);
    if (['GR', 'G'].includes(unit)) kg /= 1000;
    else if (['L', 'LT'].includes(unit)) kg *= Number(order.formula.densidadTeorica);
    else if (unit !== 'KG') continue;
    const requiredKg = kg * Number(detail.porcentaje) / 100;
    if (!near(m.cantidadSalida, requiredKg) || requiredKg <= 0) continue;
    const trace = data.inmutables.find(t => t.insumoId === m.insumoId && t.documentoReferencia === `OP-${order.codigoLote}` && near(Number(t.cantidad), m.cantidadSalida));
    candidatos.push({ movimientoId: m.id, insumoId: insumo.id, codigo: insumo.codigo, producto: insumo.nombre, lote: order.codigoLote,
      fecha: m.fecha, unidadRegistrada: m.unidadMedida, salidaRegistrada: m.cantidadSalida,
      consumoGramosSegunFormulaActual: requiredKg * 1000, diferenciaPotencialGramos: requiredKg * 1000 - m.cantidadSalida,
      descuentoInmutable: trace ? Number(trace.stockAnterior) - Number(trace.stockNuevo) : null,
      evidencia: trace ? 'Cantidad del movimiento coincide con KG de fórmula actual y tiene traza de stock.' : 'Cantidad coincide con KG de fórmula actual; falta traza inmutable coincidente.',
      estado: 'REVISAR: la fórmula y unidad actuales no prueban la receta ni la unidad histórica.' });
  }
  const unidadesMezcladas = data.insumos.map(i => {
    const units = [...new Set(data.movimientos.filter(m => m.insumoId === i.id).map(m => m.unidadMedida))];
    return { codigo: i.codigo, nombre: i.nombre, unidadFicha: i.unidadMedida, unidadesMovimientos: units };
  }).filter(i => i.unidadesMovimientos.length > 1);
  const negativos = data.insumos.filter(i => Number(i.stockReal) < 0);
  const captura = data.movimientos.filter(m => near(m.saldoFinal, 98632.79) || near(m.saldoFinal, 98640.65)).map(m => ({ id: m.id, producto: m.productoNombre, unidad: m.unidadMedida, salida: m.cantidadSalida, saldo: m.saldoFinal, numero: m.numero, fecha: m.fecha }));
  const report = { generado: new Date().toISOString(), soloLectura: true,
    alcance: 'Base configurada en backend/.env. No se presume que sea la misma instancia desplegada sin verificar configuración del hosting.',
    advertencia: 'Candidatos, no correcciones aprobadas. Conciliar con inventario físico, documentos originales, recetas y ajustes posteriores. No sumar diferencias a stock automáticamente.',
    resumen: { insumos: data.insumos.length, movimientos: data.movimientos.length, trazas: data.inmutables.length, candidatos: candidatos.length, insumosUnidadesMezcladas: unidadesMezcladas.length, stocksNegativos: negativos.length },
    captura, candidatos, unidadesMezcladas, negativos };
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'diagnostico.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(out, 'diagnostico.md'), `# Diagnóstico de unidades del kardex\n\nGenerado: ${report.generado}\n\n${report.alcance}\n\nConsulta en transacción de solo lectura. No se modificaron registros.\n\n${report.advertencia}\n\n- Insumos: ${report.resumen.insumos}\n- Movimientos: ${report.resumen.movimientos}\n- Candidatos a consumo sin conversión: ${candidatos.length}\n- Insumos con unidades mezcladas: ${unidadesMezcladas.length}\n- Stocks negativos: ${negativos.length}\n\nLa evidencia por movimiento y las coincidencias con la captura están en diagnostico.json.\n`);
  console.log(JSON.stringify({ ...report.resumen, captura, output: out }, null, 2));
}
main().catch(e => { console.error('No se completó la auditoría:', e.code || e.name); process.exitCode = 1; }).finally(() => prisma.$disconnect());
