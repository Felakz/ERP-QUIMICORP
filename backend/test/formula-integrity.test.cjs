const {test}=require('node:test');
const assert=require('node:assert/strict');
const {detallesVinculados}=require('../dist/formulas/formula-integrity');
const ingredient={id:'inventory-a',nombre:'ACEITE',codigo:'INS-A'};
const tx={insumo:{findMany:async()=>[ingredient]}};
const original=[{id:'detail-a',insumoId:ingredient.id,nombreComponente:'ACEITE',porcentaje:100}];
test('an editor that omits the inventory ID retains the existing detail association',async()=>{
 const [r]=await detallesVinculados(tx,[{id:'detail-a',nombreComponente:'ACEITE',porcentaje:100}],original);
 assert.equal(r.insumoId,ingredient.id);assert.equal(r.id,'detail-a');
});
test('unique unchanged legacy name may preserve an old association, never create one',async()=>{
 assert.equal((await detallesVinculados(tx,[{nombreComponente:'ACEITE',porcentaje:100}],original))[0].insumoId,ingredient.id);
 await assert.rejects(detallesVinculados(tx,[{nombreComponente:'ACEITE',porcentaje:100}]),/Seleccione/);
 await assert.rejects(detallesVinculados(tx,[{nombreComponente:'OTRO ACEITE',porcentaje:100}],original),/Seleccione/);
});
test('explicit null, nonexistent and foreign detail IDs cannot silently unlink ingredients',async()=>{
 await assert.rejects(detallesVinculados(tx,[{id:'detail-a',insumoId:null,porcentaje:100}],original),/Seleccione/);
 await assert.rejects(detallesVinculados(tx,[{insumoId:'missing',porcentaje:100}]),/no existe/);
 await assert.rejects(detallesVinculados(tx,[{id:'foreign',insumoId:ingredient.id,porcentaje:100}],original),/no pertenece/);
});
test('empty, repeated detail IDs and invalid quantities are rejected',async()=>{
 await assert.rejects(detallesVinculados(tx,[]));
 await assert.rejects(detallesVinculados(tx,[...original,...original],original));
 for(const porcentaje of [-1,0,NaN,Infinity,null,true,''])await assert.rejects(detallesVinculados(tx,[{insumoId:ingredient.id,porcentaje}]));
});
