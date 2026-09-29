const {test}=require('node:test');const assert=require('node:assert/strict');
const {costoRegistradoPedido,resumirRentabilidad}=require('../dist/facturacion/profitability');
const order={items:[{id:'line'}],ordenesProduccion:[{codigoLote:'LOT-1',pedidoItemId:'line',estado:'DESPACHADO',cantidadPlanificada:10,cantidadObtenida:10,unidadMedida:'KG',recetaSnapshot:{consumos:[{insumoId:'raw',modo:'CONSUMO_REAL_DOCUMENTADO'}],entregas:[{guia:'GUIA',fingerprint:'fixture'}]}}]};
const rows=[{numero:'LOT-1',categoriaKardex:'PRODUCTO_TERMINADO',tipoOperacion:'ENTRADA_PRODUCCION',cantidadEntrada:10000},
{id:'raw',unidadMedida:'GR',numero:'LOT-1',insumoId:'raw',tipoOperacion:'SALIDA_CONSUMO_PRODUCCION',cantidadSalida:5000,cantidadEntrada:0,montoSalidaPen:50,montoEntradaPen:0,costoUnitario:0.01},
{id:'return',unidadMedida:'GR',numero:'LOT-1',insumoId:'raw',tipoOperacion:'ENTRADA_AJUSTE',cantidadSalida:0,cantidadEntrada:100,montoSalidaPen:0,montoEntradaPen:1,costoUnitario:0.01},
{id:'pack',numero:'GUIA',unidadMedida:'UN',otp:'OTP-LOT-1',insumoId:'envase',tipoOperacion:'SALIDA_VENTA',cantidadSalida:2,cantidadEntrada:0,montoSalidaPen:10,montoEntradaPen:0,costoUnitario:5}];
test('recorded material costs include returns and packaging once, never finished-product cost twice',()=>{
const cost=costoRegistradoPedido(order,rows);assert.equal(cost.materiales,49);assert.equal(cost.adicionales,10);assert.equal(cost.costo,59);assert.deepEqual(cost.pendientes,[]);
});
test('missing valuations and partial deliveries suppress a definitive margin',()=>{
const cost=costoRegistradoPedido({...order,ordenesProduccion:[{...order.ordenesProduccion[0],estado:'EN_ETIQUETADO'}]},rows.map(r=>r.id==='raw'?{...r,valoracionPendiente:true}:r));
assert.ok(cost.pendientes.length>=2);const total=resumirRentabilidad([{facturado:100,costo:59,pendientes:cost.pendientes}]);assert.equal(total.margen,null);assert.equal(total.pedidosPendientes,1);
});
test('total and client margins use summed money rather than average percentages',()=>{
const total=resumirRentabilidad([{facturado:100,costo:50,pendientes:[]},{facturado:900,costo:810,pendientes:[]}]);assert.equal(total.margen,14);assert.equal(total.utilidad,140);
});
test('missing fabrication is a pending cost, not a confirmed 100 percent margin',()=>{
const cost=costoRegistradoPedido({items:[{id:'line'}],ordenesProduccion:[]},[]);assert.ok(cost.pendientes.length);assert.equal(resumirRentabilidad([{facturado:500,costo:0,pendientes:cost.pendientes}]).margen,null);
});

test('legacy gram quantities labelled kilograms and unverified commercial prices never become confirmed cost',()=>{const old={...order,ordenesProduccion:[{...order.ordenesProduccion[0],recetaSnapshot:{}}]};const cost=costoRegistradoPedido(old,rows.map(r=>r.id==='raw'?{...r,unidadMedida:'KG',montoSalidaPen:50000}:r));assert.equal(cost.costo,0);assert.ok(cost.pendientes.length);assert.equal(resumirRentabilidad([{facturado:100,costo:0,pendientes:cost.pendientes}]).utilidad,null);});
