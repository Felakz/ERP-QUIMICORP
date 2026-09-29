// Disposable local DB only; every fixture is rolled back.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const url=process.env.DATABASE_URL;
if(!url||new URL(url).hostname!=='127.0.0.1'||new URL(url).pathname!=='/quimicorp_validation')throw Error('Local validation database required');
const {PrismaClient}=require('@prisma/client');
const {FacturacionService}=require('../dist/facturacion/facturacion.service');
const db=new PrismaClient();let passed=0;
async function main(){const rollback=new Error('ROLLBACK_TEST');try{await db.$transaction(async tx=>{
 const tag=crypto.randomUUID(),ruc='TEST-'+tag;
 const order=await tx.pedidoComercial.create({data:{codigoOrden:'TEST-'+tag,clienteNombre:'PROFITABILITY TEST',clienteRuc:ruc,productoNombre:'PRODUCT TEST',cantidadSolicitada:10,unidadMedida:'KG',montoTotal:118,fechaPrometida:new Date('2026-09-10T12:00:00Z'),createdAt:new Date('2026-08-01T12:00:00Z')}});
 await tx.cuentaCobrar.create({data:{codigoDoc:'TEST-'+tag,clienteNombre:order.clienteNombre,clienteRuc:ruc,pedidoId:order.id,ordenProd:order.codigoOrden,montoTotal:118,saldoPendiente:118,fechaEmision:new Date('2026-09-20T12:00:00Z'),fechaVencimiento:new Date('2026-09-30T12:00:00Z')}});
 const service=new FacturacionService(tx);
 const report=await service.rentabilidadPorPedido('MES_ACTUAL','2026-09-01','2026-09-30',ruc);
 assert.equal(report.ventas.length,1);assert.equal(report.ventas[0].facturado,100);passed++;
 assert.equal(report.totales.facturado,100);assert.equal(report.tabla[0].facturado,100);assert.equal(report.totales.margen,null);assert.equal(report.totales.pedidosPendientes,1);passed++;
 assert.equal((await service.rentabilidadPorPedido('MES_ACTUAL','2026-08-01','2026-08-31',ruc)).ventas.length,0);passed++;
 await tx.cuentaCobrar.create({data:{codigoDoc:'UNLINKED-'+tag,clienteNombre:order.clienteNombre,clienteRuc:ruc,montoTotal:59,saldoPendiente:59,fechaEmision:new Date('2026-09-20T12:00:00Z'),fechaVencimiento:new Date('2026-09-30T12:00:00Z')}});
 const missing=await service.rentabilidadPorPedido('MES_ACTUAL','2026-09-01','2026-09-30',ruc);
 assert.equal(missing.ventas.length,2);assert.equal(missing.totales.facturado,150);assert.equal(missing.tabla[0].facturado,150);assert.equal(missing.totales.margen,null);passed++;
 await assert.rejects(service.rentabilidadPorPedido('MES_ACTUAL','2026-09-30','2026-09-01'),/inválido/);passed++;
 throw rollback;
},{timeout:30000});}catch(e){if(e!==rollback)throw e;}console.log(JSON.stringify({passed,rolledBack:true,productionWrites:false}));}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
