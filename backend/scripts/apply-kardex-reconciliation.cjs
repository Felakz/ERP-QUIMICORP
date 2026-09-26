/* Applies a previously generated, read-only reconciliation preview. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { PrismaClient, Prisma } = require('@prisma/client');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
const prisma = new PrismaClient();
const reportDir = path.resolve(__dirname, '../../reports/kardex-reconciliation');
const planPath = path.join(reportDir, 'preview.json');
const apply = process.argv.includes('--apply');
const physicalCode = process.argv.find(arg => arg.startsWith('--physical-code='))?.split('=')[1];
const physicalStockText = process.argv.find(arg => arg.startsWith('--physical-stock='))?.split('=')[1];
const physicalStock = physicalStockText === undefined ? undefined : Number(physicalStockText);
const close = (a, b, tolerance = 0.011) => Math.abs(Number(a) - Number(b)) <= tolerance;

function json(value) {
  return JSON.stringify(value, (_, item) => typeof item === 'bigint' ? item.toString() : item, 2);
}

async function main() {
  if (!fs.existsSync(planPath)) throw new Error('Falta preview.json. Ejecuta primero reconcile-kardex-preview.cjs.');
  const planText = fs.readFileSync(planPath, 'utf8');
  const plan = JSON.parse(planText);
  if ((physicalCode && physicalStock === undefined) || (!physicalCode && physicalStock !== undefined) || (physicalStock !== undefined && (!Number.isFinite(physicalStock) || physicalStock < 0))) {
    throw new Error('El conteo físico requiere --physical-code=CODIGO y --physical-stock=CANTIDAD_BASE no negativa.');
  }
  const physicalItem = physicalCode ? plan.impactoPorInsumo.find(item => item.codigo === physicalCode) : null;
  if (physicalCode && !physicalItem) throw new Error(`El insumo ${physicalCode} no existe en el plan.`);
  const blocked = new Set(plan.impactoPorInsumo.filter(item => item.estado === 'BLOQUEADO_STOCK_NEGATIVO').map(item => item.insumoId));
  if (physicalItem) blocked.delete(physicalItem.insumoId);
  const relevantActions = new Set(['CONVERTIR_KG_A_GR', 'RELABELAR_COMO_GR', 'DUPLICADO']);
  const changes = plan.cambios.filter(change => relevantActions.has(change.accion) && !blocked.has(change.insumoId));
  const itemPlans = plan.impactoPorInsumo.filter(item => !blocked.has(item.insumoId) && changes.some(change => change.insumoId === item.insumoId));
  const summary = {
    planGeneratedAt: plan.generado,
    itemsToApply: itemPlans.length,
    rowsToApply: changes.length,
    conversions: changes.filter(change => change.accion === 'CONVERTIR_KG_A_GR').length,
    relabels: changes.filter(change => change.accion === 'RELABELAR_COMO_GR').length,
    duplicateOutputs: changes.filter(change => change.accion === 'DUPLICADO').length,
    blockedItems: blocked.size,
    physicalReconciliation: physicalItem ? { codigo: physicalCode, stockFinal: physicalStock } : null,
  };
  if (!apply) {
    console.log(json({ mode: 'DRY_RUN', ...summary, message: 'No se modificó la base. Agrega --apply para ejecutar.' }));
    return;
  }
  if (!changes.length) throw new Error('El plan no contiene cambios aplicables.');

  const planHash = crypto.createHash('sha256').update(planText).digest('hex');
  const backupPath = path.join(reportDir, `backup-${new Date().toISOString().replaceAll(':', '-')}.json`);
  const changesByMovement = new Map(changes.map(change => [change.movimientoId, change]));
  const changesByTrace = new Map(changes.map(change => [change.trazaId, change]));

  const result = await prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('quimicorp-kardex-reconciliation-v1'))`;
    const itemIds = itemPlans.map(item => item.insumoId);
    for (const itemId of itemIds) await tx.$queryRaw`SELECT id FROM insumos WHERE id = ${itemId} FOR UPDATE`;

    const [items, movements, traces] = await Promise.all([
      tx.insumo.findMany({ where: { id: { in: itemIds } }, include: { familia: true }, orderBy: { id: 'asc' } }),
      tx.kardexMovimiento.findMany({ where: { insumoId: { in: itemIds } }, orderBy: [{ fecha: 'asc' }, { id: 'asc' }] }),
      tx.kardexInmutable.findMany({ where: { insumoId: { in: itemIds } }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }),
    ]);
    const itemById = new Map(items.map(item => [item.id, item]));
    const movementById = new Map(movements.map(row => [row.id, row]));
    const traceById = new Map(traces.map(row => [row.id, row]));

    for (const itemPlan of itemPlans) {
      const item = itemById.get(itemPlan.insumoId);
      if (!item || !close(item.stockReal, itemPlan.stockActual)) throw new Error(`Plan desactualizado para ${itemPlan.codigo}: stock cambió.`);
    }
    for (const change of changes) {
      const movement = movementById.get(change.movimientoId);
      const trace = traceById.get(change.trazaId);
      if (!movement || !trace) throw new Error(`Falta movimiento o traza para ${change.movimientoId}.`);
      if (movement.unidadMedida !== change.unidadActual || !close(movement.cantidadSalida, change.cantidadActual)) throw new Error(`Movimiento cambió desde la simulación: ${movement.id}.`);
      if (!close(trace.cantidad, change.cantidadActual) || !close(Number(trace.stockAnterior) - Number(trace.stockNuevo), change.cantidadActual)) throw new Error(`Traza cambió desde la simulación: ${trace.id}.`);
    }

    const backup = { generatedAt: new Date().toISOString(), planHash, summary, items, movements, traces };
    fs.writeFileSync(backupPath, json(backup));
    await tx.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS kardex_reconciliation_audit (
      id uuid PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now(),
      plan_hash text NOT NULL,
      summary jsonb NOT NULL,
      backup jsonb NOT NULL
    )`);
    const auditId = crypto.randomUUID();
    await tx.$executeRaw`INSERT INTO kardex_reconciliation_audit (id, plan_hash, summary, backup)
      VALUES (${auditId}::uuid, ${planHash}, ${JSON.stringify(summary)}::jsonb, ${JSON.stringify(backup)}::jsonb)`;

    let movementUpdates = 0;
    let traceUpdates = 0;
    const physicalAdjustments = [];
    for (const itemPlan of itemPlans) {
      const item = itemById.get(itemPlan.insumoId);
      const itemMovements = movements.filter(row => row.insumoId === itemPlan.insumoId);
      let movementAdjustment = new Prisma.Decimal(0);
      for (const movement of itemMovements) {
        const change = changesByMovement.get(movement.id);
        if (change) movementAdjustment = movementAdjustment.plus(change.ajusteStock);
        const newBalance = new Prisma.Decimal(movement.saldoFinal).plus(movementAdjustment).toDecimalPlaces(4).toNumber();
        const data = { saldoFinal: newBalance };
        if (change) {
          data.unidadMedida = 'GR';
          data.cantidadSalida = change.cantidadCorregida;
          if (change.accion === 'DUPLICADO') {
            data.montoSalidaPen = 0;
            data.proveedorCliente = `${movement.proveedorCliente || ''} [CORRECCIÓN AUDITORÍA: LIBERACIÓN DUPLICADA]`.trim();
          } else if (change.cantidadCorregida > 0 && movement.costoUnitario != null) {
            data.costoUnitario = new Prisma.Decimal(movement.costoUnitario).mul(change.cantidadActual).div(change.cantidadCorregida).toNumber();
          }
        }
        if (change || !close(newBalance, movement.saldoFinal)) {
          await tx.kardexMovimiento.update({ where: { id: movement.id }, data });
          movementUpdates += 1;
        }
      }
      if (!close(movementAdjustment, itemPlan.ajusteNeto)) throw new Error(`Impacto de movimientos inconsistente para ${itemPlan.codigo}.`);

      const itemTraces = traces.filter(row => row.insumoId === itemPlan.insumoId);
      let traceAdjustment = new Prisma.Decimal(0);
      for (const trace of itemTraces) {
        const change = changesByTrace.get(trace.id);
        const newPrevious = new Prisma.Decimal(trace.stockAnterior).plus(traceAdjustment).toDecimalPlaces(4);
        if (change) traceAdjustment = traceAdjustment.plus(change.ajusteStock);
        const newNext = new Prisma.Decimal(trace.stockNuevo).plus(traceAdjustment).toDecimalPlaces(4);
        if (change || !newPrevious.equals(trace.stockAnterior) || !newNext.equals(trace.stockNuevo)) {
          await tx.kardexInmutable.update({
            where: { id: trace.id },
            data: { cantidad: change ? change.cantidadCorregida : trace.cantidad, stockAnterior: newPrevious, stockNuevo: newNext },
          });
          traceUpdates += 1;
        }
      }
      if (!close(traceAdjustment, itemPlan.ajusteNeto)) throw new Error(`Impacto de trazas inconsistente para ${itemPlan.codigo}.`);
      const projected = new Prisma.Decimal(itemPlan.stockActual).plus(itemPlan.ajusteNeto).toDecimalPlaces(4);
      const hasPhysicalCount = physicalItem?.insumoId === itemPlan.insumoId;
      if (projected.isNegative() && !hasPhysicalCount) throw new Error(`La corrección dejaría negativo a ${itemPlan.codigo}.`);
      let finalStock = projected;
      if (hasPhysicalCount) {
        finalStock = new Prisma.Decimal(physicalStock).toDecimalPlaces(4);
        const adjustment = finalStock.minus(projected).toDecimalPlaces(4);
        if (!adjustment.isZero()) {
          const user = await tx.usuario.findFirst({ where: { dni: '70000000' } });
          if (!user) throw new Error('No se encontró el usuario sistema para registrar el conteo físico.');
          const factor = ['KG', 'L'].includes(String(item.unidadMedida).toUpperCase()) ? 1000 : 1;
          const cost = new Prisma.Decimal(item.costoUnitario || 0).div(factor).toNumber();
          const input = adjustment.isPositive();
          await tx.kardexMovimiento.create({ data: {
            categoriaKardex: item.tipo === 'ENVASE' ? 'ENVASE' : item.tipo === 'BASE' ? 'MATERIA_PRIMA' : 'INSUMO',
            productoNombre: item.nombre,
            familia: item.familia?.nombre || 'General',
            categoriaNombre: item.familia?.nombre || 'General',
            proveedorCliente: `CONCILIACIÓN POR CONTEO FÍSICO ${new Date().toISOString().slice(0, 10)}`,
            unidadMedida: ['KG', 'GR'].includes(String(item.unidadMedida).toUpperCase()) ? 'GR' : ['L', 'ML'].includes(String(item.unidadMedida).toUpperCase()) ? 'ML' : 'UN',
            fecha: new Date(), tipoDoc: 'AJUSTE', tipoOperacion: input ? 'ENTRADA_AJUSTE' : 'SALIDA_MERMA',
            cantidadEntrada: input ? adjustment.toNumber() : 0,
            cantidadSalida: input ? 0 : adjustment.abs().toNumber(),
            saldoFinal: finalStock.toNumber(), costoUnitario: cost,
            montoEntradaPen: input ? adjustment.mul(cost).toNumber() : 0,
            montoSalidaPen: input ? 0 : adjustment.abs().mul(cost).toNumber(),
            montoSaldoPen: finalStock.mul(cost).toNumber(), insumoId: item.id, usuarioId: user.id,
          } });
          await tx.kardexInmutable.create({ data: {
            insumoId: item.id, tipoMovimiento: 'AJUSTE_FINO', cantidad: adjustment.abs(),
            stockAnterior: projected, stockNuevo: finalStock,
            documentoReferencia: `CONCILIACIÓN CONTEO FÍSICO ${new Date().toISOString().slice(0, 10)}`, usuarioId: user.id,
          } });
          movementUpdates += 1;
          traceUpdates += 1;
          physicalAdjustments.push({ codigo: itemPlan.codigo, stockTeoricoCorregido: projected.toNumber(), ajuste: adjustment.toNumber(), stockFinal: finalStock.toNumber() });
        }
      }
      await tx.insumo.update({ where: { id: itemPlan.insumoId }, data: { stockReal: finalStock, stockTeorico: finalStock } });
    }

    return { auditId, movementUpdates, traceUpdates, itemsUpdated: itemPlans.length, physicalAdjustments, backupPath };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 15000, timeout: 120000 });

  console.log(json({ mode: 'APPLIED', ...summary, ...result }));
}

main().catch(error => { console.error('No se aplicó la conciliación:', error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
