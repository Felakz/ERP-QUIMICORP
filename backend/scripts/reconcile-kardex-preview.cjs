/* Read-only preview. It never writes to PostgreSQL. */
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient, Prisma } = require('@prisma/client');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
const prisma = new PrismaClient();
const outputDir = path.resolve(__dirname, '../../reports/kardex-reconciliation');
const close = (a, b, tolerance = 0.011) => Math.abs(Number(a) - Number(b)) <= tolerance;

function csvCell(value) {
  const string = value == null ? '' : String(value);
  return /[\",\n]/.test(string) ? `\"${string.replaceAll('\"', '\"\"')}\"` : string;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const columns = Object.keys(rows[0]);
  return [columns.join(','), ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n');
}

// aprobarLote writes all component outputs followed by one finished-product
// entry. This marker remains useful even when the mutable formula later changes.
function isFinishedProductMarker(row) {
  return row.categoriaKardex === 'PRODUCTO_TERMINADO' && row.tipoOperacion === 'ENTRADA_PRODUCCION' &&
    (row.cantidadEntrada > 0 || String(row.proveedorCliente || '').includes('CORRECCIÓN AUDITORÍA: LIBERACIÓN DUPLICADA'));
}

function splitReleases(rows) {
  const complete = [];
  let current = [];
  for (const row of rows) {
    current.push(row);
    if (isFinishedProductMarker(row)) {
      complete.push(current);
      current = [];
    }
  }
  return { complete, incomplete: current };
}

function orderMassKg(order) {
  const unit = String(order.pedidoComercial?.unidadMedida || 'KG').toUpperCase();
  const quantity = Number(order.cantidadPlanificada);
  if (unit === 'KG') return quantity;
  if (unit === 'GR') return quantity / 1000;
  if (unit === 'L' || unit === 'LT') return quantity * Number(order.formula.densidadTeorica);
  return null;
}

function classifyHistoricalQuantity(order, movement) {
  if (movement.unidadMedida === 'GR') return { desired: Number(movement.cantidadSalida), action: 'CONSERVAR_GR' };
  const batchKg = orderMassKg(order);
  const details = order.formula.detalles.filter(detail => detail.insumoId === movement.insumoId);
  if (!(batchKg > 0) || !details.length || !(movement.cantidadSalida > 0)) return null;
  const percentages = details.map(detail => Number(detail.porcentaje));
  if (percentages.length > 1) percentages.push(percentages.reduce((sum, value) => sum + value, 0));
  const expectedKg = percentages.map(percentage => batchKg * percentage / 100).filter(value => value > 0);
  const distance = expected => Math.abs(Math.log10(Number(movement.cantidadSalida) / expected));
  const kgDistance = Math.min(...expectedKg.map(distance));
  const grDistance = Math.min(...expectedKg.map(value => distance(value * 1000)));
  // A factor-of-1000 scale gap dominates ordinary edits to a mutable formula.
  if (kgDistance + 0.5 < grDistance) {
    return { desired: new Prisma.Decimal(movement.cantidadSalida).mul(1000).toDecimalPlaces(4).toNumber(), action: 'CONVERTIR_KG_A_GR', kgDistance, grDistance };
  }
  if (grDistance + 0.5 < kgDistance) {
    return { desired: Number(movement.cantidadSalida), action: 'RELABELAR_COMO_GR', kgDistance, grDistance };
  }
  return null;
}

async function main() {
  const snapshot = await prisma.$transaction(async tx => {
    await tx.$executeRaw`SET TRANSACTION READ ONLY`;
    const [insumos, movimientos, trazas, ordenes] = await Promise.all([
      tx.insumo.findMany({ select: { id: true, codigo: true, nombre: true, unidadMedida: true, stockReal: true, stockTeorico: true } }),
      tx.kardexMovimiento.findMany({ where: { tipoDoc: 'OP' }, orderBy: [{ fecha: 'asc' }, { id: 'asc' }] }),
      tx.kardexInmutable.findMany({ where: { tipoMovimiento: 'SALIDA' }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
      tx.ordenProduccion.findMany({ include: { pedidoComercial: { select: { unidadMedida: true } }, formula: { include: { detalles: true } } } }),
    ]);
    return { insumos, movimientos, trazas, ordenes };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead, timeout: 60000 });

  const itemById = new Map(snapshot.insumos.map(item => [item.id, item]));
  const knownOrders = new Set(snapshot.ordenes.map(order => order.codigoLote));
  const orderByCode = new Map(snapshot.ordenes.map(order => [order.codigoLote, order]));
  const rowsByOrder = new Map();
  for (const movement of snapshot.movimientos) {
    if (!movement.numero || !knownOrders.has(movement.numero)) continue;
    if (!rowsByOrder.has(movement.numero)) rowsByOrder.set(movement.numero, []);
    rowsByOrder.get(movement.numero).push(movement);
  }
  const tracesByDocument = new Map();
  for (const trace of snapshot.trazas) {
    if (!trace.documentoReferencia) continue;
    if (!tracesByDocument.has(trace.documentoReferencia)) tracesByDocument.set(trace.documentoReferencia, []);
    tracesByDocument.get(trace.documentoReferencia).push(trace);
  }

  const changes = [];
  const duplicateFinishedProducts = [];
  const review = [];
  const releaseSummary = [];
  const impacts = new Map();

  for (const [orderCode, rows] of rowsByOrder) {
    const order = orderByCode.get(orderCode);
    const { complete, incomplete } = splitReleases(rows);
    if (!complete.length) {
      review.push({ lote: orderCode, razon: 'No existe entrada de producto terminado que delimite una liberación completa', filas: rows.length });
      continue;
    }
    const canonical = complete[0];
    const duplicateReleases = complete.slice(1);
    const tracePool = tracesByDocument.get(`OP-${orderCode}`) || [];
    const usedTraceIds = new Set();
    const lastTraceByItem = new Map();
    let tracedChanges = 0;

    const processOutput = (movement, action, releaseNumber) => {
      if (!(movement.cantidadSalida > 0) || !movement.insumoId) return;
      const item = itemById.get(movement.insumoId);
      if (!item || !['KG', 'GR'].includes(String(item.unidadMedida))) {
        review.push({ lote: orderCode, movimientoId: movement.id, razon: 'Salida sin insumo de masa verificable', filas: 1 });
        return;
      }
      if (!['KG', 'GR'].includes(String(movement.unidadMedida))) {
        review.push({ lote: orderCode, movimientoId: movement.id, codigo: item.codigo, razon: `Unidad histórica no convertible: ${movement.unidadMedida}`, filas: 1 });
        return;
      }
      const classification = action === 'DUPLICADO' ? { desired: 0, action: 'DUPLICADO' } : classifyHistoricalQuantity(order, movement);
      if (!classification) {
        review.push({ lote: orderCode, movimientoId: movement.id, codigo: item.codigo, razon: 'Escala KG/GR ambigua frente al lote y la fórmula actual', filas: 1 });
        return;
      }
      const desired = classification.desired;
      const trace = tracePool.find(candidate =>
        !usedTraceIds.has(candidate.id) && candidate.insumoId === movement.insumoId &&
        close(candidate.cantidad, movement.cantidadSalida) &&
        close(Number(candidate.stockAnterior) - Number(candidate.stockNuevo), movement.cantidadSalida)
      );
      if (!trace) {
        review.push({ lote: orderCode, movimientoId: movement.id, codigo: item.codigo, razon: 'No se encontró traza inmutable inequívoca', filas: 1 });
        return;
      }
      usedTraceIds.add(trace.id);
      let stockAdjustment;
      if (classification.action === 'DUPLICADO') {
        const previous = lastTraceByItem.get(item.id);
        if (!previous) {
          review.push({ lote: orderCode, movimientoId: movement.id, codigo: item.codigo, razon: 'Duplicado sin traza previa comparable', filas: 1 });
          return;
        }
        if (close(trace.stockAnterior, previous.stockNuevo)) {
          stockAdjustment = Number(movement.cantidadSalida); // descuento secuencial: devolverlo
        } else if (close(trace.stockAnterior, previous.stockAnterior) && close(trace.stockNuevo, previous.stockNuevo)) {
          stockAdjustment = 0; // carrera concurrente: ambas filas escribieron el mismo saldo
        } else {
          review.push({ lote: orderCode, movimientoId: movement.id, codigo: item.codigo, razon: 'No se pudo determinar si el duplicado afectó el stock', filas: 1 });
          return;
        }
      } else {
        stockAdjustment = new Prisma.Decimal(movement.cantidadSalida).minus(desired).toDecimalPlaces(4).toNumber();
      }
      lastTraceByItem.set(item.id, trace);
      changes.push({
        lote: orderCode, liberacion: releaseNumber, accion: classification.action,
        codigo: item.codigo, insumo: item.nombre, insumoId: item.id,
        movimientoId: movement.id, trazaId: trace.id, fecha: movement.fecha.toISOString(),
        unidadActual: movement.unidadMedida, cantidadActual: movement.cantidadSalida,
        unidadCorregida: 'GR', cantidadCorregida: desired,
        ajusteStock: stockAdjustment,
      });
      tracedChanges += 1;
      if (!impacts.has(item.id)) impacts.set(item.id, { codigo: item.codigo, insumo: item.nombre, insumoId: item.id, stockActual: Number(item.stockReal), conversiones: 0, duplicados: 0, ajusteNeto: 0 });
      const impact = impacts.get(item.id);
      if (classification.action === 'DUPLICADO') impact.duplicados += 1;
      else if (classification.action === 'CONVERTIR_KG_A_GR') impact.conversiones += 1;
      impact.ajusteNeto += stockAdjustment;
    };

    canonical.forEach(row => processOutput(row, 'CONSERVAR_Y_CONVERTIR', 1));
    duplicateReleases.forEach((release, index) => {
      release.forEach(row => processOutput(row, 'DUPLICADO', index + 2));
      const product = release.find(isFinishedProductMarker);
      if (product?.cantidadEntrada > 0) duplicateFinishedProducts.push({ lote: orderCode, liberacion: index + 2, movimientoId: product.id, fecha: product.fecha.toISOString(), cantidadEntrada: product.cantidadEntrada, unidad: product.unidadMedida });
    });
    if (incomplete.length) review.push({ lote: orderCode, razon: 'Filas posteriores sin cierre de producto terminado', filas: incomplete.length, ids: incomplete.map(row => row.id).join('|') });
    releaseSummary.push({ lote: orderCode, liberacionesCompletas: complete.length, liberacionesDuplicadas: duplicateReleases.length, filasIncompletas: incomplete.length, cambiosConTraza: tracedChanges });
  }

  const byItem = [...impacts.values()].map(impact => {
    const adjustment = new Prisma.Decimal(impact.ajusteNeto).toDecimalPlaces(4).toNumber();
    const projected = new Prisma.Decimal(impact.stockActual).plus(adjustment).toDecimalPlaces(4).toNumber();
    return { ...impact, ajusteNeto: adjustment, stockProyectado: projected, estado: projected < 0 ? 'BLOQUEADO_STOCK_NEGATIVO' : 'LISTO_PARA_REVISION' };
  }).sort((a, b) => a.stockProyectado - b.stockProyectado);

  const report = {
    generado: new Date().toISOString(), soloLectura: true,
    criterio: 'Se conserva la primera liberación completa; KG se convierte a GR; liberaciones completas posteriores se anulan como duplicadas; toda salida requiere traza coincidente.',
    resumen: {
      lotesAnalizados: releaseSummary.length,
      lotesConLiberacionDuplicada: releaseSummary.filter(row => row.liberacionesDuplicadas > 0).length,
      liberacionesDuplicadas: releaseSummary.reduce((sum, row) => sum + row.liberacionesDuplicadas, 0),
      movimientosAConvertir: changes.filter(row => row.accion === 'CONVERTIR_KG_A_GR').length,
      movimientosSoloRelabelar: changes.filter(row => row.accion === 'RELABELAR_COMO_GR').length,
      movimientosDuplicadosAAnular: changes.filter(row => row.accion === 'DUPLICADO').length,
      entradasProductoTerminadoDuplicadas: duplicateFinishedProducts.length,
      casosRevisionManual: review.length,
      insumosAfectados: byItem.length,
      insumosBloqueadosPorStockNegativo: byItem.filter(item => item.estado === 'BLOQUEADO_STOCK_NEGATIVO').length,
    },
    impactoPorInsumo: byItem, cambios: changes,
    entradasProductoTerminadoDuplicadas: duplicateFinishedProducts,
    liberaciones: releaseSummary, revisionManual: review,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'preview.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, 'cambios.csv'), toCsv(changes));
  fs.writeFileSync(path.join(outputDir, 'impacto-por-insumo.csv'), toCsv(byItem));
  fs.writeFileSync(path.join(outputDir, 'productos-terminados-duplicados.csv'), toCsv(duplicateFinishedProducts));
  fs.writeFileSync(path.join(outputDir, 'revision-manual.csv'), toCsv(review));
  fs.writeFileSync(path.join(outputDir, 'resumen.md'), `# Simulación de conciliación del kardex\n\nGenerado: ${report.generado}\n\nLa consulta fue de solo lectura; no modificó la base.\n\n- Lotes analizados: ${report.resumen.lotesAnalizados}\n- Lotes con liberación duplicada: ${report.resumen.lotesConLiberacionDuplicada}\n- Liberaciones duplicadas: ${report.resumen.liberacionesDuplicadas}\n- Movimientos KG para convertir a GR: ${report.resumen.movimientosAConvertir}\n- Salidas duplicadas para anular: ${report.resumen.movimientosDuplicadosAAnular}\n- Entradas de producto terminado duplicadas: ${report.resumen.entradasProductoTerminadoDuplicadas}\n- Casos para revisión manual: ${report.resumen.casosRevisionManual}\n- Insumos afectados: ${report.resumen.insumosAfectados}\n- Insumos cuyo stock proyectado quedaría negativo: ${report.resumen.insumosBloqueadosPorStockNegativo}\n\nNo se deben aplicar los casos negativos hasta confirmar entradas omitidas o un inventario físico de corte.\n`);
  console.log(JSON.stringify({ ...report.resumen, output: outputDir, insumosBloqueados: byItem.filter(item => item.estado === 'BLOQUEADO_STOCK_NEGATIVO') }, null, 2));
}

main().catch(error => { console.error('No se completó la simulación:', error.code || error.name, error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
