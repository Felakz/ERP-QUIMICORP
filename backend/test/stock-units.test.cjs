const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Prisma } = require('@prisma/client');
const { cantidadEnStock, consumoFormulaGramos, cantidadLoteKg } = require('../dist/common/stock-units');
const { ProduccionService } = require('../dist/produccion/produccion.service');
const { KardexService } = require('../dist/kardex/kardex.service');
const { OrdenesCompraService } = require('../dist/ordenes-compra/ordenes-compra.service');
const { InventarioService } = require('../dist/inventario/inventario.service');

function fixture(stock = 98640.65, unit = 'KG') {
  const item = { id: 'item', codigo: 'AGUA', nombre: 'AGUA DESIONIZADA', unidadMedida: unit, stockReal: new Prisma.Decimal(stock), costoUnitario: 10, familia: { nombre: 'BASES' }, tipo: 'BASE' };
  const moves = [], traces = [];
  const order = { id: 'order', codigoLote: 'LOTE-TEST', estado: 'QA_PENDIENTE', cantidadPlanificada: 10, supervisorId: 'user',
    formula: { nombreProducto: 'PRODUCTO', densidadTeorica: 1, detalles: [{ insumoId: item.id, porcentaje: 78.6, insumo: item }] }, pedidoComercial: { unidadMedida: 'KG', montoTotal: 100 } };
  const tx = {
    $queryRaw: async () => [],
    insumo: { findUnique: async () => item, findUniqueOrThrow: async () => item, update: async ({data}) => Object.assign(item, data) },
    ordenProduccion: { findUnique: async () => order, findUniqueOrThrow: async () => order, update: async ({data}) => Object.assign(order, data) },
    kardexMovimiento: { create: async ({data}) => { moves.push(data); return data; } },
    kardexInmutable: { create: async ({data}) => { traces.push(data); return data; } },
    colaDespacho: { findFirst: async () => null, create: async ({data}) => data },
    usuario: { findUnique: async () => ({ id: 'user' }), findFirst: async () => ({ id: 'user' }) },
    ordenCompraItem: { update: async () => ({}) },
  };
  const db = { ...tx, $transaction: async fn => fn(tx) };
  return { item, moves, traces, order, tx, db, service: new ProduccionService(db, new KardexService(db), { emitirEstadoActualizado() {} }) };
}

test('KG, GR, L, ML and UN convert only once and incompatible dimensions fail', () => {
  assert.equal(cantidadEnStock(7.86, 'KG', 'GR'), 7860);
  assert.equal(cantidadEnStock(250, 'KG', 'KG'), 250000);
  assert.equal(cantidadEnStock(250, 'KILOGRAMOS', 'KG'), 250000);
  assert.equal(cantidadEnStock(250000, 'GR', 'KG'), 250000);
  assert.equal(cantidadEnStock(7860, 'GR', 'KG'), 7860);
  assert.equal(cantidadEnStock(2.5, 'L', 'ML'), 2500);
  assert.equal(cantidadEnStock(2500, 'ML', 'L'), 2500);
  assert.equal(cantidadEnStock(12, 'UN', 'UN'), 12);
  assert.throws(() => cantidadEnStock(2, 'KG', 'L'));
  assert.throws(() => cantidadEnStock(NaN, 'KG', 'GR'));
  assert.equal(consumoFormulaGramos(10, 78.6, 'KG'), 7860);
  assert.equal(cantidadLoteKg(10, 'L', 1.2), 12);
  assert.throws(() => cantidadLoteKg(10, 'L'));
});

for (const unit of ['KG', 'GR']) test(`QA consumes 7,860 GR from the screenshot balance with ${unit} metadata`, async () => {
  const f = fixture(98640.65, unit);
  await f.service.aprobarLote({ ordenProduccionId: 'order' });
  assert.equal(Number(f.item.stockReal), 90780.65);
  assert.equal(f.moves[0].cantidadSalida, 7860);
  assert.equal(f.moves[0].unidadMedida, 'GR');
  assert.equal(f.moves[0].saldoFinal, 90780.65);
  assert.equal(Number(f.traces[0].cantidad), 7860);
  assert.equal(f.moves[1].cantidadEntrada, 10000);
  assert.equal(f.moves[1].unidadMedida, 'GR');
  assert.equal(f.moves[1].montoEntradaPen, 100);
  if (unit === 'KG') assert.ok(Math.abs(f.moves[0].montoSalidaPen - 78.6) < 1e-8);
});

test('QA refuses insufficient stock instead of clamping the balance to zero', async () => {
  const f = fixture(100);
  await assert.rejects(f.service.aprobarLote({ ordenProduccionId: 'order' }), /Stock insuficiente/);
  assert.equal(Number(f.item.stockReal), 100);
  assert.equal(f.moves.length, 0);
});

test('a second QA release cannot consume stock twice', async () => {
  const f = fixture();
  await f.service.aprobarLote({ ordenProduccionId: 'order' });
  await assert.rejects(f.service.aprobarLote({ ordenProduccionId: 'order' }), /ya fue liberado/);
  assert.equal(Number(f.item.stockReal), 90780.65);
  assert.equal(f.moves.length, 2);
});

test('manual kardex converts explicit KG and records both ledgers in GR', async () => {
  const f = fixture();
  await new KardexService(f.db).registrarMovimiento({ insumoId: 'item', tipoMovimiento: 'SALIDA', cantidad: 7.86, unidadMedida: 'KG', usuarioId: 'user' });
  assert.equal(Number(f.item.stockReal), 90780.65);
  assert.equal(f.moves[0].cantidadSalida, 7860);
  assert.equal(f.traces[0].cantidad, 7860);
});

test('fine adjustment consumes stock in grams; replenishment returns grams', async () => {
  const f = fixture(100);
  const service = new KardexService(f.db);
  await service.registrarMovimiento({ insumoId: 'item', tipoMovimiento: 'AJUSTE_FINO', cantidad: 10, usuarioId: 'user' });
  assert.equal(Number(f.item.stockReal), 90);
  await service.registrarMovimiento({ insumoId: 'item', tipoMovimiento: 'REAPROVECHAMIENTO', cantidad: 5, usuarioId: 'user' });
  assert.equal(Number(f.item.stockReal), 95);
});

for (const unit of ['KG', 'GR']) test(`purchase in KG stores GR and preserves valuation for ${unit} commercial unit`, async () => {
  const f = fixture(1000, unit);
  f.item.costoUnitario = unit === 'KG' ? 10 : 0.01;
  const service = new OrdenesCompraService(f.db);
  await service.procesarRecepcionItem(f.tx, { codigoOC: 'OC-TEST', proveedorNombre: 'Proveedor' }, { id: 'line', insumoId: 'item', cantidad: 2, precioUnitario: 20, unidadMedida: 'KG' }, 'user');
  assert.equal(Number(f.item.stockReal), 3000);
  assert.equal(f.moves[0].cantidadEntrada, 2000);
  assert.equal(f.moves[0].unidadMedida, 'GR');
  assert.equal(f.moves[0].montoEntradaPen, 40);
  assert.ok(Math.abs(f.moves[0].montoSaldoPen - 50) < 1e-8);
  assert.ok(Math.abs(Number(f.item.costoUnitario) - (unit === 'KG' ? 50 / 3 : 50 / 3000)) < 1e-8);
});

test('stock checks compare grams to grams, not kilograms to grams', async () => {
  const f = fixture(1000);
  f.db.formulaMaster = { findUnique: async () => f.order.formula };
  const result = await f.service.validarStockDisponible({ formulaId: 'formula', cantidadPlanificada: 10 });
  assert.equal(result.puedeIniciar, false);
  assert.equal(result.requerimientos[0].cantidadRequerida, '7860.0000');
  assert.equal(result.requerimientos[0].unidadMedida, 'GR');
});

test('manual inventory adjustment uses the base stock amount without a second conversion', async () => {
  const f = fixture(1000);
  await new InventarioService(f.db).actualizarInsumo('item', { stockReal: 500 }, { id: 'user', role: 'ADMINISTRACION' });
  assert.equal(Number(f.item.stockReal), 500);
  assert.equal(f.moves[0].cantidadSalida, 500);
  assert.equal(f.moves[0].unidadMedida, 'GR');
  assert.equal(f.traces[0].stockNuevo, 500);
});

test('initial stock in KG is converted once; its commercial price is retained', async () => {
  const f = fixture(0);
  f.tx.insumo.findUnique = async () => null;
  f.tx.insumo.create = async ({ data }) => Object.assign(f.item, data);
  const service = new InventarioService(f.db);
  f.db.insumo.findUnique = f.tx.insumo.findUnique;
  await service.crearInsumo({ codigo: 'NEW', nombre: 'Nuevo', unidadMedida: 'KG', stockInicial: 2, stockMinimo: 1, costoUnitario: 20, familiaId: 'family' });
  assert.equal(Number(f.item.stockReal), 2000);
  assert.equal(Number(f.item.stockMinimo), 1000);
  assert.equal(Number(f.item.costoUnitario), 20);
  assert.equal(f.moves[0].montoEntradaPen, 40);
});

test('replenishment in commercial KG updates both ledgers in GR', async () => {
  const f = fixture(1000);
  await new InventarioService(f.db).reponerStock('item', 2, 'REPO', 'user');
  assert.equal(Number(f.item.stockReal), 3000);
  assert.equal(f.moves[0].cantidadEntrada, 2000);
  assert.equal(f.traces[0].cantidad, 2000);
});

test('additional dispatch in KG consumes base grams; envases remain units', async () => {
  for (const [unit, stock, expected] of [['KG', 5000, 3000], ['UN', 5, 3]]) {
    const f = fixture(stock, unit);
    f.tx.pedidoAdicional = { update: async () => ({}) };
    await f.service.descontarAdicionalesDespacho([{ id: 'extra', categoria: 'BALDES_HERRAMIENTAS', cantidad: 2, cantidadDespachada: 0, unidadMedida: unit, insumoId: 'item', insumo: f.item }], 'LOTE', 'GUIA', 'user');
    assert.equal(Number(f.item.stockReal), expected);
    assert.equal(f.moves[0].unidadMedida, unit === 'KG' ? 'GR' : 'UN');
  }
});

test('volume ingredients cannot silently be consumed as if liters were kilograms', async () => {
  const f = fixture(10000, 'L');
  await assert.rejects(f.service.aprobarLote({ ordenProduccionId: 'order' }), /densidad específica/);
  assert.equal(Number(f.item.stockReal), 10000);
  assert.equal(f.moves.length, 0);
});

test('inventory updates fail when the immutable ledger fails instead of silently accepting the stock', async () => {
  const f = fixture(1000);
  f.tx.kardexInmutable.create = async () => { throw new Error('ledger unavailable'); };
  await assert.rejects(new InventarioService(f.db).actualizarInsumo('item', { stockReal: 500 }, { id: 'user' }), /ledger unavailable/);
  assert.equal(Number(f.item.stockReal), 1000);
});

test('kardex UI totals convert compatible units, separate dimensions and exclude unresolved historical rows', () => {
  const fs = require('node:fs');
  const ts = require('typescript');
  const source = fs.readFileSync(require('node:path').resolve(__dirname, '../../frontend/lib/stockUnits.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('exports', compiled)(exports);
  const rows = [
    { unidadMedida: 'KG', cantidadEntrada: 2, cantidadSalida: 0 },
    { unidadMedida: 'GR', cantidadEntrada: 500, cantidadSalida: 0 },
    { unidadMedida: 'UN', cantidadEntrada: 3, cantidadSalida: 0 },
    { unidadMedida: 'L', cantidadEntrada: 1, cantidadSalida: 0 },
    { unidadMedida: 'KG', cantidadEntrada: 9999, cantidadSalida: 0, requiereConciliacionUnidad: true },
  ];
  const total = exports.kardexTotal(rows, 'cantidadEntrada', 'KG');
  assert.match(total, /2.50 KG/);
  assert.match(total, /3.00 UN/);
  assert.match(total, /1,000.00 ML/);
  assert.doesNotMatch(total, /9999/);
});
