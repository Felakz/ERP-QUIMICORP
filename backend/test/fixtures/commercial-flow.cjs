const { PedidosAdminService } = require('../../dist/pedidos-admin/pedidos-admin.service');
const { ProduccionService } = require('../../dist/produccion/produccion.service');
const { KardexService } = require('../../dist/kardex/kardex.service');
const { Prisma } = require('@prisma/client');
const copy = value => {
  if (Prisma.Decimal.isDecimal(value)) return new Prisma.Decimal(value);
  if (value instanceof Date) return new Date(value);
  if (Array.isArray(value)) return value.map(copy);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)]));
  return value;
};
const F1='11111111-1111-4111-8111-111111111111', F2='22222222-2222-4222-8222-222222222222';
function fixture(options={}) {
  const state={orders:[],lots:[],items:[],moves:[],traces:[],additives:[],extras:[],audit:[],queue:[]};
  const events=[]; let seq=0;
  const ingredient={id:'raw',codigo:'INS-TEST',nombre:'Materia prima de prueba',unidadMedida:'KG',stockReal:1000000,costoUnitario:10,tipo:'BASE',familia:{nombre:'PRUEBA'}};
  const remainder={...ingredient,id:'rest',stockReal:1000000};
  const formulas=[{id:F1,codigoFormula:'FM-9001',nombreProducto:'Producto A'},{id:F2,codigoFormula:'FM-9002',nombreProducto:'Producto B'}].map(f=>({...f,version:1,densidadTeorica:1.2,
    detalles:[{insumoId:'raw',insumo:ingredient,porcentaje:10},{insumoId:'rest',insumo:remainder,porcentaje:90}]}));
  const client={id:'customer',razonSocial:'Cliente de prueba local',ruc:'TEST'};
  const match=(row,where)=>Object.entries(where||{}).every(([key,v])=>row[key]===v);
  const orderHydrate=o=>o&&({...o,formula:formulas.find(f=>f.id===o.formulaId),items:state.items.filter(i=>i.pedidoId===o.id),aditivos:state.additives.filter(a=>a.pedidoId===o.id),adicionales:state.extras.filter(a=>a.pedidoId===o.id),ordenesProduccion:state.lots.filter(l=>l.pedidoComercialId===o.id)});
  const lotHydrate=l=>l&&({...l,formula:formulas.find(f=>f.id===l.formulaId),pedidoItem:state.items.find(i=>i.id===l.pedidoItemId),pedidoComercial:orderHydrate(state.orders.find(o=>o.id===l.pedidoComercialId))});
  const table=(name,hydrate=(r=>({...r})))=>({
    findUnique:async({where})=>{const r=state[name].find(r=>match(r,where));return r?hydrate(r):null;},
    findUniqueOrThrow:async({where})=>{const r=state[name].find(r=>match(r,where));if(!r)throw Error('Missing test record');return hydrate(r);},
    findFirst:async({where})=>{const r=state[name].find(r=>match(r,where));return r?hydrate(r):null;},
    findMany:async({where}={})=>state[name].filter(r=>match(r,where)).map(hydrate),
    count:async({where}={})=>state[name].filter(r=>match(r,where)).length,
    create:async({data})=>{if(name==='lots'&&options.failLot)throw Error('Synthetic storage failure');if(name==='traces'&&options.failTrace)throw Error('Synthetic trace failure');const r={id:`${name}-${++seq}`,...data};state[name].push(r);return hydrate(r);},
    update:async({where,data})=>{const r=state[name].find(r=>match(r,where));if(!r)throw Error('Missing test record');Object.assign(r,data);return hydrate(r);},
    delete:async({where})=>{const index=state[name].findIndex(r=>match(r,where));if(index<0)throw Error('Missing test record');return state[name].splice(index,1)[0];},
    deleteMany:async({where})=>{let count=0;for(let i=state[name].length-1;i>=0;i--)if(match(state[name][i],where)){state[name].splice(i,1);count++;}return{count};},
  });
  const db={pedidoComercial:table('orders',orderHydrate),pedidoComercialItem:table('items'),ordenProduccion:table('lots',lotHydrate),pedidoAditivo:table('additives'),pedidoAdicional:table('extras'),kardexMovimiento:table('moves'),kardexInmutable:table('traces'),auditLog:table('audit'),colaDespacho:table('queue'),
    formulaMaster:{findUnique:async({where})=>formulas.find(f=>match(f,where))||null},
    cliente:{findUnique:async({where})=>match(client,where)?{...client}:null},formulaVariant:{findUnique:async()=>null},
    usuario:{findUnique:async()=>({id:'supervisor'}),findFirst:async()=>options.noSupervisor?null:{id:'supervisor'}},
    insumo:{findUnique:async({where})=>[ingredient,remainder].find(i=>match(i,where))||null,findUniqueOrThrow:async({where})=>{const r=[ingredient,remainder].find(i=>match(i,where));if(!r)throw Error('Missing ingredient');return r;},update:async({where,data})=>Object.assign([ingredient,remainder].find(i=>match(i,where)),data)},
    $queryRaw:async()=>[],
  };
  db.$transaction=async callback=>{const previous=copy(state),beforeIngredients=copy([ingredient,remainder]);try{return await callback(db);}catch(e){for(const key of Object.keys(state))state[key].splice(0,state[key].length,...previous[key]);Object.assign(ingredient,beforeIngredients[0]);Object.assign(remainder,beforeIngredients[1]);throw e;}};
  const gateway={server:{emit:(...args)=>events.push(args)},emitirEstadoActualizado:d=>events.push(d)};
  return {...state,ingredient,remainder,formulas,client,events,gateway,db,service:new PedidosAdminService(db,gateway),production:new ProduccionService(db,new KardexService(db),gateway)};
}
const payload=(extra={})=>({mode:'PEDIDO',clienteId:'customer',producto:'FM-9001 - Producto A',formulaId:F1,cantidad:10,unidad:'KG',precioUnitario:2,...extra});
const mixedItems=()=>[
  {id:'a',formulaId:F1,codigoFM:'FM-9001',productoNombre:'Producto A',cantidad:20,unidadMedida:'LT',precioUnitario:2,densidadKgL:1.2,fuenteConversion:'Documento ficticio de prueba'},
  {id:'b',formulaId:F2,codigoFM:'FM-9002',productoNombre:'Producto B',cantidad:60,unidadMedida:'KG',precioUnitario:2},
];
module.exports={fixture,payload,mixedItems,F1,F2};
