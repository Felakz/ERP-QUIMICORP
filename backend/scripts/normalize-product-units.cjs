/* Normalizes historical finished-product Kardex rows to GR/ML/UN. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { PrismaClient, Prisma } = require('@prisma/client');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');
const reportDir = path.resolve(__dirname, '../../reports/kardex-reconciliation');
const planPath = path.join(reportDir, 'preview.json');

const definitions = {
  KG: ['GR', 1000], KILO: ['GR', 1000], KILOS: ['GR', 1000], KILOGRAMO: ['GR', 1000], KILOGRAMOS: ['GR', 1000],
  GR: ['GR', 1], G: ['GR', 1],
  L: ['ML', 1000], LT: ['ML', 1000], LITRO: ['ML', 1000], LITROS: ['ML', 1000], ML: ['ML', 1],
  UN: ['UN', 1], UND: ['UN', 1], UNIDAD: ['UN', 1], UNIDADES: ['UN', 1],
};
const close = (a, b) => Math.abs(Number(a || 0) - Number(b || 0)) <= 0.0001;
const json = value => JSON.stringify(value, (_, item) => typeof item === 'bigint' ? item.toString() : item, 2);

async function main() {
  if (!fs.existsSync(planPath)) throw new Error('Falta preview.json; ejecuta reconcile-kardex-preview.cjs primero.');
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
  const duplicateIds = new Set(plan.entradasProductoTerminadoDuplicadas.map(row => row.movimientoId));
  const rows = await prisma.kardexMovimiento.findMany({
    where: { categoriaKardex: 'PRODUCTO_TERMINADO' },
    orderBy: [{ fecha: 'asc' }, { id: 'asc' }],
  });
  const changes = rows.map(row => {
    const unit = String(row.unidadMedida || '').trim().toUpperCase();
    const definition = definitions[unit];
    if (!definition) throw new Error(`Unidad de producto terminado no soportada: ${row.unidadMedida} (${row.id}).`);
    const [baseUnit, factor] = definition;
    const duplicate = duplicateIds.has(row.id);
    return {
      id: row.id,
      before: row,
      duplicate,
      data: {
        unidadMedida: baseUnit,
        cantidadEntrada: duplicate ? 0 : new Prisma.Decimal(row.cantidadEntrada).mul(factor).toNumber(),
        cantidadSalida: duplicate ? 0 : new Prisma.Decimal(row.cantidadSalida).mul(factor).toNumber(),
        saldoFinal: duplicate ? 0 : new Prisma.Decimal(row.saldoFinal).mul(factor).toNumber(),
        costoUnitario: row.costoUnitario == null ? null : new Prisma.Decimal(row.costoUnitario).div(factor).toNumber(),
        montoEntradaPen: duplicate ? 0 : row.montoEntradaPen,
        montoSalidaPen: duplicate ? 0 : row.montoSalidaPen,
        montoSaldoPen: duplicate ? 0 : row.montoSaldoPen,
        proveedorCliente: duplicate
          ? `${row.proveedorCliente || ''} [CORRECCIÓN AUDITORÍA: LIBERACIÓN DUPLICADA]`.trim()
          : row.proveedorCliente,
      },
    };
  }).filter(change => change.duplicate || change.before.unidadMedida !== change.data.unidadMedida);

  const summary = {
    productRowsFound: rows.length,
    rowsToNormalize: changes.length,
    duplicateRowsToVoid: changes.filter(row => row.duplicate).length,
    kgToGr: changes.filter(row => ['KG', 'KILO', 'KILOS', 'KILOGRAMO', 'KILOGRAMOS'].includes(String(row.before.unidadMedida).toUpperCase())).length,
    litersToMl: changes.filter(row => ['L', 'LT', 'LITRO', 'LITROS'].includes(String(row.before.unidadMedida).toUpperCase())).length,
  };
  if (!apply) return console.log(json({ mode: 'DRY_RUN', ...summary }));

  const backup = { generatedAt: new Date().toISOString(), summary, rows };
  const backupText = json(backup);
  const backupPath = path.join(reportDir, `backup-product-units-${new Date().toISOString().replaceAll(':', '-')}.json`);
  fs.writeFileSync(backupPath, backupText);
  const planHash = crypto.createHash('sha256').update(backupText).digest('hex');

  const result = await prisma.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('quimicorp-product-unit-normalization-v1'))`;
    for (const change of changes) {
      await tx.$queryRaw`SELECT id FROM kardex_movimientos WHERE id = ${change.id} FOR UPDATE`;
      const current = await tx.kardexMovimiento.findUniqueOrThrow({ where: { id: change.id } });
      if (current.unidadMedida !== change.before.unidadMedida ||
          !close(current.cantidadEntrada, change.before.cantidadEntrada) ||
          !close(current.cantidadSalida, change.before.cantidadSalida) ||
          !close(current.saldoFinal, change.before.saldoFinal)) {
        throw new Error(`El movimiento ${change.id} cambió después del respaldo.`);
      }
    }
    await tx.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS kardex_reconciliation_audit (
      id uuid PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now(),
      plan_hash text NOT NULL,
      summary jsonb NOT NULL,
      backup jsonb NOT NULL
    )`);
    const auditId = crypto.randomUUID();
    await tx.$executeRaw`INSERT INTO kardex_reconciliation_audit (id, plan_hash, summary, backup)
      VALUES (${auditId}::uuid, ${planHash}, ${JSON.stringify(summary)}::jsonb, ${backupText}::jsonb)`;
    for (const change of changes) await tx.kardexMovimiento.update({ where: { id: change.id }, data: change.data });
    return { auditId, backupPath };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 15000, timeout: 120000 });

  console.log(json({ mode: 'APPLIED', ...summary, ...result }));
}

main().catch(error => { console.error('No se normalizaron productos terminados:', error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
