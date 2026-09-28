// Audit real compiled services with an in-memory database. No PrismaClient,
// dotenv, network connection, or production writes are used by this script.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { PedidosAdminService } = require('../dist/pedidos-admin/pedidos-admin.service');
const { ProduccionService } = require('../dist/produccion/produccion.service');
const { KardexService } = require('../dist/kardex/kardex.service');

const { fixture, payload, mixedItems } = require('../test/fixtures/commercial-flow.cjs');
const results = [];
async function probe(name, expected, run) {
  try {
    const actual = await run();
    let pass = true;
    try { assert.deepStrictEqual(actual, expected); } catch { pass = false; }
    results.push({ name, status: pass ? 'CUMPLE' : 'NO_CUMPLE', expected, actual });
  } catch (error) {
    results.push({ name, status: 'ERROR_DE_PRUEBA', expected, error: String(error.stack) });
  }
}
async function rejected(run) { try { await run(); return false; } catch { return true; } }
async function run() {
  await probe('Pedido directo 10 KG conserva cantidad/unidad y no descuenta al registrarse', { quantity: 10, unit: 'KG', stock: 1000000, movements: 0, lots: 0 }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload());
    return { quantity: p.cantidadSolicitada, unit: p.unidadMedida, stock: Number(f.ingredient.stockReal), movements: f.moves.length, lots: f.lots.length };
  });
  await probe('Cotización convertida conserva ambos productos y sus unidades', { type: 'OP', items: mixedItems().map(i => ({ ...i, aditivos: [] })), movements: 0, lots: 0 }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload({ mode: 'COTIZACION', cantidad: 20, unidad: 'LT', itemsJson: mixedItems() }));
    await f.service.convertirCotizacionAPedido(p.id);
    return { type: f.orders[0].docType, items: JSON.parse(f.orders[0].notasAdmin).items, movements: f.moves.length, lots: f.lots.length };
  });
  await probe('Pedido de un producto 10 KG: aprobar y liberar consume 1,000 GR al 10%', { linked: true, consumption: 1000, productQuantity: 10000, productUnit: 'GR' }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload()); await f.service.aprobarPedido(p.id);
    await f.production.aprobarLote({ ordenProduccionId: f.lots[0].id });
    return { linked: f.lots[0].pedidoComercialId === p.id, consumption: f.moves[0].cantidadSalida, productQuantity: f.moves.at(-1).cantidadEntrada, productUnit: f.moves.at(-1).unidadMedida };
  });
  await probe('Pedido mixto LT/KG: segundo producto 60 KG consume 6,000 GR al 10%', { consumption: 6000, productQuantity: 60000, productUnit: 'GR' }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload({ cantidad: 20, unidad: 'LT', itemsJson: mixedItems() })); await f.service.aprobarPedido(p.id);
    await f.production.aprobarLote({ ordenProduccionId: f.lots[1].id });
    return { consumption: f.moves[0].cantidadSalida, productQuantity: f.moves.at(-1).cantidadEntrada, productUnit: f.moves.at(-1).unidadMedida };
  });
  await probe('Cotización todavía no convertida no debe crear producción', { rejected: true, type: 'COT', lots: 0 }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload({ mode: 'COTIZACION' }));
    return { rejected: await rejected(() => f.service.aprobarPedido(p.id)), type: f.orders[0].docType, lots: f.lots.length };
  });
  await probe('Una OP ya convertida no debe convertirse otra vez', { rejected: true, codeUnchanged: true, quoteReferencePreserved: true }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload({ mode: 'COTIZACION' }));
    await f.service.convertirCotizacionAPedido(p.id); const code = f.orders[0].codigoOrden;
    const reject = await rejected(() => f.service.convertirCotizacionAPedido(p.id));
    return { rejected: reject, codeUnchanged: f.orders[0].codigoOrden === code, quoteReferencePreserved: f.orders[0].codigoRefAdmin === p.codigoOrden };
  });
  await probe('Editar los productos de un pedido conserva las cantidades nuevas', { itemQuantity: 70 }, async () => {
    const f = fixture(); const items = mixedItems(); const p = await f.service.crearPedido(payload({ cantidad: 20, unidad: 'LT', itemsJson: items }));
    items[1].cantidad = 70; await f.service.actualizarPedido(p.id, { itemsJson: items });
    return { itemQuantity: JSON.parse(f.orders[0].notasAdmin).items[1].cantidad };
  });
  await probe('Aditivo 1% de un pedido de 5,000 GR corresponde a 50 GR', { grams: 50 }, async () => {
    const f = fixture(); await f.service.crearPedido(payload({ cantidad: 5000, unidad: 'GR', aditivos: [{ insumoId: 'raw', porcentaje: 1 }] }));
    return { grams: f.additives[0].gramosCalculados };
  });
  await probe('No aceptar cantidad cero ni sustituirla por otra cantidad', { rejected: true, orders: 0 }, async () => {
    const f = fixture(); return { rejected: await rejected(() => f.service.crearPedido(payload({ cantidad: 0 }))), orders: f.orders.length };
  });
  await probe('No aceptar cantidad negativa', { rejected: true, orders: 0 }, async () => {
    const f = fixture(); return { rejected: await rejected(() => f.service.crearPedido(payload({ cantidad: -5 }))), orders: f.orders.length };
  });
  await probe('API conserva cantidadSolicitada si se usa ese nombre del campo', { quantity: 25 }, async () => {
    const f = fixture(); const p = await f.service.crearPedido(payload({ cantidad: undefined, cantidadSolicitada: 25 })); return { quantity: p.cantidadSolicitada };
  });
  await probe('No aceptar una unidad desconocida', { rejected: true, orders: 0 }, async () => {
    const f = fixture(); return { rejected: await rejected(() => f.service.crearPedido(payload({ unidad: 'CAJAS_ERRONEAS' }))), orders: f.orders.length };
  });
  await probe('Aprobar sin supervisor debe dejar el pedido pendiente', { rejected: true, state: 'PENDIENTE_REVISION', lots: 0 }, async () => {
    const f = fixture({ noSupervisor: true }); const p = await f.service.crearPedido(payload());
    return { rejected: await rejected(() => f.service.aprobarPedido(p.id)), state: f.orders[0].estado, lots: f.lots.length };
  });
  await probe('Un producto sin fórmula válida no debe usar una fórmula arbitraria', { rejected: true, lots: 0 }, async () => {
    const f = fixture();
    return { rejected: await rejected(async () => { const p = await f.service.crearPedido(payload({ formulaId: undefined, cantidad: 5, itemsJson: [{ productoNombre: 'Producto no identificado', cantidad: 5, unidadMedida: 'KG', precioUnitario: 2 }] })); await f.service.aprobarPedido(p.id); }), lots: f.lots.length };
  });
  await probe('Un adicional inválido no debe dejar un pedido parcialmente guardado', { rejected: true, orders: 0 }, async () => {
    const f = fixture(); return { rejected: await rejected(() => f.service.crearPedido(payload({ adicionales: [{ categoria: 'ENVASES', cantidad: 0, precioUnitarioVenta: 1 }] }))), orders: f.orders.length };
  });
  await probe('Falla al crear lote debe fallar aprobación y conservar estado pendiente', { rejected: true, state: 'PENDIENTE_REVISION', lots: 0 }, async () => {
    const f = fixture({ failLot: true }); const p = await f.service.crearPedido(payload());
    return { rejected: await rejected(() => f.service.aprobarPedido(p.id)), state: f.orders[0].estado, lots: f.lots.length };
  });
  const reportDir = path.resolve(__dirname, '../../reports/order-registration-audit');
  fs.mkdirSync(reportDir, { recursive: true });
  const report = { checkedAt: new Date().toISOString(), environment: 'In-memory synthetic fixtures; real compiled local services; no production calls', syntheticDensityKgPerL: 1.2, results };
  fs.writeFileSync(path.join(reportDir, 'flow-validation.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(reportDir, 'flow-validation.md'), '# Validación del registro comercial y producción\n\n' +
    `Fecha: ${report.checkedAt}. Servicios reales compilados del código local, base en memoria. No se crearon pedidos ni se modificó producción. La densidad 1.2 de las pruebas es ficticia para comprobar las dimensiones; no es una medición de los productos reales.\n\n` +
    '| Caso | Resultado | Esperado | Obtenido |\n| --- | --- | --- | --- |\n' + results.map(r => `| ${r.name} | ${r.status} | ${JSON.stringify(r.expected)} | ${JSON.stringify(r.actual || r.error).replace(/\n/g, ' ')} |`).join('\n') +
    '\n\nCUMPLE significa que pasó este escenario, no que todo el sistema está certificado. NO_CUMPLE identifica una expectativa de negocio incumplida; ERROR_DE_PRUEBA indica un fallo de la prueba que debe investigarse. Estos casos no validan autenticación, HTTP, concurrencia real ni la versión desplegada.\n');
  console.log(JSON.stringify({ report: path.join(reportDir, 'flow-validation.md'), counts: results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {}), failures: results.filter(r => r.status !== 'CUMPLE') }, null, 2));
  // Nonzero exit is intentional when the business expectations fail.
  if (results.some(r => r.status !== 'CUMPLE')) process.exitCode = 1;
}
run().catch(error => { console.error(error); process.exitCode = 1; });
