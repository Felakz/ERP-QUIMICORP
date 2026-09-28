// Real PostgreSQL + HTTP tests, restricted to the disposable localhost copy.
require('reflect-metadata');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const url = process.env.DATABASE_URL;
if (!url || new URL(url).hostname !== '127.0.0.1' || new URL(url).pathname !== '/quimicorp_validation') throw Error('Only the isolated localhost validation database is allowed.');
process.env.JWT_SECRET = 'isolated-validation-only';
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../dist/app.module');
const { PrismaService } = require('../dist/common/prisma/prisma.service');
let app, db, base;
const results = [];
async function http(method, route, body) {
  const res = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer jwt_mock_token_admin' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: res.status, body: await res.json() };
}
async function probe(name, run) { await run(); results.push({ name, passed: true }); console.log('PASS: ' + name); }
async function main() {
  app = await NestFactory.create(AppModule, { logger: ['error'] });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(0, '127.0.0.1');
  base = `http://127.0.0.1:${app.getHttpServer().address().port}/api/v1`;
  db = app.get(PrismaService);
  const actor = await db.usuario.findFirstOrThrow();
  app.get(require('../dist/auth/auth.service').AuthService).verifyToken = async () => ({ ...actor, role: 'GERENCIA', rol: 'GERENCIA' });
  const tag = crypto.randomUUID();
  const family = await db.familiaInsumo.create({ data: { nombre: 'PRUEBA AISLADA ' + tag } });
  const ingredients = await Promise.all([0,1].map(index=>db.insumo.create({ data: { codigo: `TEST-${tag}-${index}`, nombre: `PRUEBA AISLADA ${index}`, familiaId: family.id, unidadMedida: 'KG', unidadStock: 'GR', stockReal: 1000000, costoUnitario: 10, tipo: 'BASE' } })));
  const formula = await db.formulaMaster.create({ data: { codigoFormula: 'FM-9999-' + tag, nombreProducto: 'PRODUCTO PRUEBA AISLADA', densidadTeorica: 1,
    detalles: { create: ingredients.map((i,index)=>({ insumoId: i.id, porcentaje: index ? 90 : 10, pesoMasaTeorico: index ? 900 : 100 })) } }, include: { detalles: true } });
  const client = await db.cliente.create({ data: { razonSocial: 'CLIENTE PRUEBA AISLADA', ruc: 'TEST-' + tag } });
  const payload = (extra={})=>({ mode: 'PEDIDO', clienteId: client.id, formulaId: formula.id, cantidad: 10, unidad: 'KG', precioUnitario: 2, ...extra });
  const real = total => ingredients.map((i,index) => ({ insumoId:i.id, cantidad:total*(index?0.9:0.1), unidadMedida:'GR', documentoSoporte:'HOJA PRUEBA AISLADA' }));
  let single, mixed, lots;
  await probe('Concurrent HTTP retries produce exactly one order and its lines', async()=>{
    const request = payload({ claveOperacion: tag });
    const responses = await Promise.all([http('POST','/pedidos-admin',request),http('POST','/pedidos-admin',request)]);
    responses.forEach(r=>assert.equal(r.status,201,JSON.stringify(r.body)));
    assert.equal(responses[0].body.id,responses[1].body.id); single=responses[0].body;
    assert.equal(await db.pedidoComercial.count({ where:{claveOperacion:tag} }),1);
    assert.equal(await db.pedidoComercialItem.count({ where:{pedidoId:single.id} }),1);
    const conflict = await http('POST','/pedidos-admin',payload({ claveOperacion:tag,cantidad:20 })); assert.equal(conflict.status,409);
  });
  await probe('Mismatched money is rejected with no partial database records', async()=>{
    const before = await db.pedidoComercial.count();
    const res = await http('POST','/pedidos-admin',payload({ precioTotal:999 })); assert.equal(res.status,400);
    assert.equal(await db.pedidoComercial.count(),before);
  });
  await probe('Quote conversion preserves KG/GR/LT/ML product lines and exact totals', async()=>{
    const items=[{id:'kg',cantidad:10,unidadMedida:'KG'},{id:'gr',cantidad:5000,unidadMedida:'GR'},{id:'lt',cantidad:3,unidadMedida:'LT'},{id:'ml',cantidad:2000,unidadMedida:'ML'}].map(i=>({...i,formulaId:formula.id,precioUnitario:0.1}));
    const res=await http('POST','/pedidos-admin',payload({mode:'COTIZACION',itemsJson:items,precioTotal:701.3})); assert.equal(res.status,201,JSON.stringify(res.body)); mixed=res.body;
    assert.equal((await http('POST',`/pedidos-admin/${mixed.id}/aprobar`,{})).status,400);
    const converted=await http('POST',`/pedidos-admin/${mixed.id}/convertir-a-pedido`,{}); assert.equal(converted.status,201,JSON.stringify(converted.body));
    const rows=await db.pedidoComercialItem.findMany({where:{pedidoId:mixed.id},orderBy:{indice:'asc'}}); assert.deepEqual(rows.map(i=>i.unidadMedida),['KG','GR','LT','ML']);
    assert.equal((await http('POST',`/pedidos-admin/${mixed.id}/aprobar`,{})).status,201);
    lots=await db.ordenProduccion.findMany({where:{pedidoComercialId:mixed.id},orderBy:{codigoLote:'asc'}}); assert.equal(lots.length,4);
    assert.ok(lots.every(l=>l.clienteId===client.id&&l.pedidoItemId&&l.recetaSnapshot));
  });
  await probe('Volume QA requires actual ingredients and stores final weight separately', async()=>{
    const lot=lots.find(l=>l.unidadMedida==='LT'); const before=await db.kardexMovimiento.count();
    const rejected=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id}); assert.equal(rejected.status,400); assert.equal(await db.kardexMovimiento.count(),before);
    const valid=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,pesoNetoKg:2.4,fuenteConversion:'PESAJE FICTICIO PRUEBA AISLADA',consumosReales:real(2400)}); assert.equal(valid.status,200,JSON.stringify(valid.body));
    const movements=await db.kardexMovimiento.findMany({where:{numero:lot.codigoLote,insumoId:ingredients[0].id}}); assert.equal(Number(movements[0].cantidadSalida),240);
    const output=await db.kardexMovimiento.findFirst({where:{numero:lot.codigoLote,categoriaKardex:'PRODUCTO_TERMINADO'}}); assert.equal(output.unidadMedida,'ML'); assert.equal(Number(output.cantidadEntrada),3000);
    assert.equal((await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id})).status,400); assert.equal(await db.kardexMovimiento.count(),before+3);
  });
  await probe('Captured recipe survives later formula edits; a GR lot consumes GR exactly once',async()=>{
    await db.formulaDetalle.update({where:{id:formula.detalles[0].id},data:{porcentaje:50}});
    await db.formulaDetalle.update({where:{id:formula.detalles[1].id},data:{porcentaje:50}});
    const lot=lots.find(l=>l.unidadMedida==='GR'); const res=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,consumosReales:real(lot.unidadMedida==='GR'?5000:10000)}); assert.equal(res.status,200,JSON.stringify(res.body));
    const move=await db.kardexMovimiento.findFirst({where:{numero:lot.codigoLote,insumoId:ingredients[0].id}}); assert.equal(Number(move.cantidadSalida),500);
    assert.equal((await http('PUT',`/pedidos-admin/${mixed.id}`,{cantidad:20})).status,400);
  });
  await probe('Failure on the second ingredient rolls back stock, movements and lot status',async()=>{
    const lot=lots.find(l=>l.unidadMedida==='KG'); const ids=ingredients.map(i=>i.id).sort();
    await db.insumo.update({where:{id:ids[1]},data:{stockReal:0}});
    const stockBefore=await db.insumo.findUnique({where:{id:ids[0]}}); const count=await db.kardexMovimiento.count();
    const res=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,consumosReales:real(lot.unidadMedida==='GR'?5000:10000)}); assert.equal(res.status,400);
    assert.equal(String((await db.insumo.findUnique({where:{id:ids[0]}})).stockReal),String(stockBefore.stockReal)); assert.equal(await db.kardexMovimiento.count(),count);
    assert.equal((await db.ordenProduccion.findUnique({where:{id:lot.id}})).estado,'EN_PROCESO'); await db.insumo.update({where:{id:ids[1]},data:{stockReal:1000000}});
  });
  await probe('Dispatch waits for every line, records PT sale and repeated requests cannot duplicate stock',async()=>{
    const lot=lots.find(l=>l.unidadMedida==='GR'); const queue=await db.colaDespacho.findFirst({where:{loteCodigo:lot.codigoLote}});
    const res=await http('POST','/produccion/etiquetas/despachar',{colaId:queue.id,numeroGuia:'GUIA-PRUEBA-AISLADA',cantidadEntregada:5000,unidadEntrega:'GR'}); assert.equal(res.status,201,JSON.stringify(res.body));
    assert.equal((await db.pedidoComercial.findUnique({where:{id:mixed.id}})).estado,'APROBADO');
    const count=await db.kardexMovimiento.count(); assert.equal((await http('POST','/produccion/etiquetas/despachar',{colaId:queue.id,numeroGuia:'GUIA-PRUEBA-AISLADA',cantidadEntregada:5000,unidadEntrega:'GR'})).status,201); assert.equal(await db.kardexMovimiento.count(),count);
    const moves=await db.kardexMovimiento.findMany({where:{otp:`OTP-${lot.codigoLote}`,categoriaKardex:'PRODUCTO_TERMINADO'}}); assert.equal(moves.length,2); assert.equal(Number(moves[1].cantidadSalida),5000);
  });
  await probe('Partial deliveries preserve litres, remainder and ingredients; retry does not duplicate',async()=>{
    const lot=lots.find(l=>l.unidadMedida==='LT');
    const queue=await db.colaDespacho.findFirst({where:{loteCodigo:lot.codigoLote}});
    const stock=await db.insumo.findUnique({where:{id:ingredients[0].id}});
    const request={colaId:queue.id,numeroGuia:'PARCIAL-'+tag,cantidadEntregada:1,unidadEntrega:'LT'};
    const first=await http('POST','/produccion/etiquetas/despachar',request);assert.equal(first.status,201,JSON.stringify(first.body));assert.equal(first.body.saldoPendiente,2000);assert.equal(first.body.estado,'LISTO_PARA_IMPRIMIR');
    const count=await db.kardexMovimiento.count();
    assert.equal((await http('POST','/produccion/etiquetas/despachar',request)).body.repetido,true);assert.equal(await db.kardexMovimiento.count(),count);
    assert.equal((await http('POST','/produccion/etiquetas/despachar',{...request,numeroGuia:'EXCESO-'+tag,cantidadEntregada:3})).status,400);
    assert.equal((await http('POST','/produccion/etiquetas/despachar',{...request,numeroGuia:'UNIDAD-'+tag,unidadEntrega:'KG'})).status,400);
    const last=await http('POST','/produccion/etiquetas/despachar',{...request,numeroGuia:'FINAL-'+tag,cantidadEntregada:2});assert.equal(last.status,201);assert.equal(last.body.saldoPendiente,0);
    assert.equal(String((await db.insumo.findUnique({where:{id:ingredients[0].id}})).stockReal),String(stock.stockReal));
  });
  await probe('A direct state update cannot bypass QA and its stock transactions',async()=>{
    const res=await http('PATCH','/produccion/ordenes/paso',{ordenProduccionId:lots[0].id,pasoProceso:'LIBERADO_QA'}); assert.equal(res.status,400);
  });
  await probe('Documented actual consumption preserves zero substitutions without guessing water or density',async()=>{
    const lot=lots.find(l=>l.unidadMedida==='ML');
    const before=await db.insumo.findUnique({where:{id:ingredients[0].id}});
    const partial=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,consumosReales:[{insumoId:ingredients[0].id,cantidad:0,unidadMedida:'GR',documentoSoporte:'PRUEBA AISLADA'}]});assert.equal(partial.status,400);
    const actual=ingredients.map((i,index)=>({insumoId:i.id,cantidad:index?1800:0,unidadMedida:'GR',documentoSoporte:'REGISTRO FICTICIO DE PRUEBA: SUSTITUCION DOCUMENTADA'}));
    const res=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,cantidadObtenida:1900,consumosReales:actual}); assert.equal(res.status,200,JSON.stringify(res.body));
    assert.equal(String((await db.insumo.findUnique({where:{id:ingredients[0].id}})).stockReal),String(before.stockReal));
    assert.equal(res.body.recetaSnapshot.baseMasaKg,null);
    const output=await db.kardexMovimiento.findFirst({where:{numero:lot.codigoLote,categoriaKardex:'PRODUCTO_TERMINADO'}});assert.equal(Number(output.cantidadEntrada),1900);assert.equal(output.unidadMedida,'ML');
  });
  await probe('Bruto minus tara is validated on the server and the original weighing is preserved',async()=>{
    const request=payload({cantidad:2,unidad:'LT'});
    const order=await http('POST','/pedidos-admin',request);assert.equal(order.status,201,JSON.stringify(order.body));
    assert.equal((await http('POST',`/pedidos-admin/${order.body.id}/aprobar`,{})).status,201);
    const lot=await db.ordenProduccion.findFirst({where:{pedidoComercialId:order.body.id}});
    assert.equal((await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,pesoBrutoKg:3,taraKg:0.5,pesoNetoKg:3,fuenteConversion:'PRUEBA AISLADA'})).status,400);
    const res=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,pesoBrutoKg:3,taraKg:0.5,fuenteConversion:'PRUEBA AISLADA',consumosReales:real(2800)});assert.equal(res.status,200,JSON.stringify(res.body));
    assert.equal(res.body.recetaSnapshot.pesaje.netoKg,2.5);assert.equal(res.body.recetaSnapshot.pesaje.taraKg,0.5);
  });
  await probe('Failed packaging dispatch rolls back every stock and status update, then succeeds once',async()=>{
    const lot=lots.find(l=>l.unidadMedida==='ML');
    const envase=await db.insumo.create({data:{codigo:'TEST-ENVASE-'+tag,nombre:'ENVASE PRUEBA AISLADA',familiaId:family.id,unidadMedida:'UN',unidadStock:'UN',tipo:'ENVASE',stockReal:0,costoUnitario:2}});
    const line=await db.pedidoComercialItem.findUnique({where:{id:lot.pedidoItemId}});
    await db.pedidoAdicional.create({data:{pedidoId:mixed.id,itemIndex:line.indice,productoNombre:line.productoNombre,categoria:'ENVASES',insumoId:envase.id,descripcion:envase.nombre,unidadMedida:'UN',cantidad:1,precioUnitarioVenta:3,costoUnitario:2,subtotal:3}});
    const queue=await db.colaDespacho.findFirst({where:{loteCodigo:lot.codigoLote}}), count=await db.kardexMovimiento.count();
    const failed=await http('POST','/produccion/etiquetas/despachar',{colaId:queue.id,numeroGuia:'GUIA-ENVASE-'+tag,cantidadEntregada:1900,unidadEntrega:'ML'});assert.equal(failed.status,400);
    assert.equal((await db.colaDespacho.findUnique({where:{id:queue.id}})).estado,'LISTO_PARA_IMPRIMIR');assert.equal(await db.kardexMovimiento.count(),count);
    await db.insumo.update({where:{id:envase.id},data:{stockReal:5}});
    assert.equal((await http('POST','/produccion/etiquetas/despachar',{colaId:queue.id,numeroGuia:'GUIA-ENVASE-'+tag,cantidadEntregada:1900,unidadEntrega:'ML'})).status,201);
    assert.equal(Number((await db.insumo.findUnique({where:{id:envase.id}})).stockReal),4);
    assert.equal((await http('POST','/produccion/etiquetas/despachar',{colaId:queue.id,numeroGuia:'GUIA-ENVASE-'+tag,cantidadEntregada:1900,unidadEntrega:'ML'})).status,201);
    assert.equal(Number((await db.insumo.findUnique({where:{id:envase.id}})).stockReal),4);assert.equal(await db.kardexMovimiento.count(),count+2);
  });
  await probe('Real PostgreSQL adjustments are included once and final yield never rescales inputs',async()=>{
    const created=await http('POST','/pedidos-admin',payload({cantidad:10,unidad:'LT'}));assert.equal(created.status,201);
    assert.equal((await http('POST',`/pedidos-admin/${created.body.id}/aprobar`,{})).status,201);
    const lot=await db.ordenProduccion.findFirst({where:{pedidoComercialId:created.body.id}});
    const before=await db.insumo.findUnique({where:{id:ingredients[0].id}});
    const adjustment=await http('POST','/produccion/ajustes-finos',{ordenProduccionId:lot.id,insumoId:ingredients[0].id,cantidadAgregada:0.1,unidadMedida:'KG',registradoPorId:actor.id});assert.equal(adjustment.status,201,JSON.stringify(adjustment.body));assert.equal(Number(adjustment.body.cantidadAgregada),100);
    const recipe=await http('GET',`/produccion/ordenes/${lot.id}/receta`);assert.equal(recipe.status,200);assert.equal(recipe.body.ingredientes.find(i=>i.insumoId===ingredients[0].id).consumoRegistrado,100);
    const short=await http('PATCH','/produccion/qa/aprobar',{ordenProduccionId:lot.id,consumosReales:real(500)});assert.equal(short.status,400);
    const request={ordenProduccionId:lot.id,cantidadObtenida:9,pesoBrutoKg:8,taraKg:1,fuenteConversion:'PESAJE FICTICIO',consumosReales:real(2000)};
    const released=await http('PATCH','/produccion/qa/aprobar',request);assert.equal(released.status,200,JSON.stringify(released.body));
    assert.equal(Number((await db.insumo.findUnique({where:{id:ingredients[0].id}})).stockReal),Number(before.stockReal)-200);
    assert.equal(released.body.pesoNetoKg,null);assert.equal(released.body.recetaSnapshot.pesaje.netoKg,7);
    assert.equal(released.body.recetaSnapshot.consumos.find(i=>i.insumoId===ingredients[0].id).descontadoEnQA,100);
    assert.equal((await http('POST','/produccion/ajustes-finos',{ordenProduccionId:lot.id,insumoId:ingredients[0].id,cantidadAgregada:1,unidadMedida:'GR',registradoPorId:actor.id})).status,400);
  });
  await probe('Customer pigment label survives saving and quote conversion without changing the inventory link',async()=>{
    const pigment=await db.insumo.create({data:{codigo:'TEST-PIG-'+tag,nombre:'NOMBRE QUIMICO INTERNO TEST',familiaId:family.id,unidadMedida:'KG',unidadStock:'GR',tipo:'PIGMENTO',stockReal:100,costoUnitario:2}});
    const additive={insumoId:pigment.id,tipo:'PIGMENTO',porcentaje:0.5,nombreCliente:'Azul cielo'};
    const res=await http('POST','/pedidos-admin',payload({mode:'COTIZACION',aditivos:[additive]}));assert.equal(res.status,201,JSON.stringify(res.body));
    const line=await db.pedidoComercialItem.findFirst({where:{pedidoId:res.body.id}});
    assert.equal(line.metadata.aditivos[0].nombreCliente,'Azul cielo');assert.equal(line.metadata.aditivos[0].nombre,pigment.nombre);
    assert.equal(line.metadata.aditivos[0].insumoId,pigment.id);
    assert.equal((await http('POST',`/pedidos-admin/${res.body.id}/convertir-a-pedido`,{})).status,201);
    const after=await db.pedidoComercialItem.findFirst({where:{pedidoId:res.body.id}});assert.equal(after.metadata.aditivos[0].nombreCliente,'Azul cielo');
    const stored=await db.pedidoAditivo.findFirst({where:{pedidoId:res.body.id}});assert.equal(stored.insumoId,pigment.id);assert.equal(Number(stored.porcentaje),0.5);
  });
  const report={checkedAt:new Date().toISOString(),database:'Isolated localhost PostgreSQL copy',productionWrites:false,tests:results};
  fs.mkdirSync(path.resolve(__dirname,'../../reports/order-registration-audit'),{recursive:true});
  fs.writeFileSync(path.resolve(__dirname,'../../reports/order-registration-audit/postgres-http-validation.json'),JSON.stringify(report,null,2));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;}).finally(async()=>{if(app)await app.close();});
