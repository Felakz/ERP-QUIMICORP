// Integration test restricted to a disposable local database. All changes roll back.
require('reflect-metadata');
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const url=process.env.DATABASE_URL;
if(!url||new URL(url).hostname!=='127.0.0.1'||new URL(url).pathname!=='/quimicorp_validation')throw Error('Isolated localhost database required');
const {PrismaClient}=require('@prisma/client');
const {FormulasService}=require('../dist/formulas/formulas.service');
const db=new PrismaClient();let passed=0;
async function main(){
 const rollback=new Error('ROLLBACK_TEST');
 try{await db.$transaction(async tx=>{
  const user=await tx.usuario.findFirstOrThrow(),items=await tx.insumo.findMany({take:2});assert.equal(items.length,2);
  const service=new FormulasService({...tx,$transaction:fn=>fn(tx)});
  const formula=await service.crear({codigoFormula:'TEST-'+crypto.randomUUID(),nombreProducto:'INTEGRITY TEST',densidadTeorica:1,detalles:items.map(i=>({insumoId:i.id,porcentaje:50}))},user.id);
  assert.equal(await tx.auditLog.count({where:{registroId:formula.id,accion:'CREAR_FORMULA',usuarioId:user.id}}),1);passed++;
  const payload={expectedUpdatedAt:formula.updatedAt.toISOString(),detalles:formula.detalles.map(d=>({id:d.id,nombreComponente:d.nombreComponente,porcentaje:50}))};
  const updated=await service.actualizarFormula(formula.id,payload,user.id);
  assert.deepEqual(updated.detalles.map(d=>[d.id,d.insumoId]).sort(),formula.detalles.map(d=>[d.id,d.insumoId]).sort());passed++;
  assert.equal(updated.version,2);assert.equal(await tx.auditLog.count({where:{registroId:formula.id,accion:'EDITAR_FORMULA',usuarioId:user.id}}),1);passed++;
  await assert.rejects(service.actualizarFormula(formula.id,payload,user.id),/cambió/);passed++;
  await assert.rejects(service.actualizarFormula(formula.id,{expectedUpdatedAt:updated.updatedAt.toISOString(),detalles:[{nombreComponente:'NO INVENTORY',porcentaje:100}]},user.id),/Seleccione/);passed++;
  assert.equal(await tx.formulaDetalle.count({where:{formulaId:formula.id}}),2);passed++;
  await assert.rejects(service.actualizarFormula(formula.id,{nombreProducto:'OLD CLIENT'},user.id),/versión/);passed++;
  throw rollback;
 },{timeout:30000});}catch(e){if(e!==rollback)throw e;}
 console.log(JSON.stringify({passed,rolledBack:true,productionWrites:false}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
