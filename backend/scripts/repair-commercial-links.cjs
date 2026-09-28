// Evidence-only metadata repair. Never modifies stock, ledger, prices or debts.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { PrismaClient, Prisma } = require('@prisma/client');
if (!process.env.DATABASE_URL) process.loadEnvFile(path.resolve(__dirname, '../.env'));
const [mode, directory] = process.argv.slice(2);
if (!['preview','apply','rollback'].includes(mode) || !directory || !path.isAbsolute(directory)) throw Error('Usage: preview|apply|rollback ABSOLUTE_DIRECTORY');
const prisma = new PrismaClient();
const planFile = path.join(directory, 'commercial-links-plan.json');
const receiptFile = path.join(directory, 'commercial-links-receipt.json');
const parse = value => { try { return JSON.parse(value || '{}'); } catch { return {}; } };
const name = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const units = { KG:'KG', KILOGRAMO:'KG', KILOGRAMOS:'KG', GR:'GR', G:'GR', LT:'LT', L:'LT', LITRO:'LT', LITROS:'LT', ML:'ML' };
const exact = (a,b)=>new Prisma.Decimal(a || 0).equals(b || 0);
const checksum = v => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
function sourceDocuments() {
  const filename=path.resolve(__dirname,'../../fase2_pedidos_sept.sql');
  const content=fs.readFileSync(filename,'utf8');
  const documents=[];
  content.split(/\r?\n/).forEach((line,index)=>{
    if (!line.startsWith('(gen_random_uuid(),')) return;
    const tokens=line.match(/'(?:[^']|'')*'|TIMESTAMP\s+'[^']+'|\b\d+(?:\.\d+)?\b|NULL/g);
    if (!tokens || tokens.length < 15) return;
    const value=tokens.map(t=>t.replace(/^TIMESTAMP\s+/,'').replace(/^'|'$/g,'').replaceAll("''","'"));
    documents.push({ code:value[0], clientName:value[1], ruc:value[2], product:value[3], quantity:Number(value[4]), unit:value[5], amount:value[6], formulaId:value[10], clientId:value[13], source:'fase2_pedidos_sept.sql', line:index+1, sourceSha256:crypto.createHash('sha256').update(content).digest('hex') });
  });
  return documents;
}
async function preview() {
  const data=await prisma.$transaction(async tx=>{
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
    return { orders:await tx.pedidoComercial.findMany({include:{items:true,adicionales:true,clienteRef:true},orderBy:{codigoOrden:'asc'}}), lots:await tx.ordenProduccion.findMany({orderBy:{codigoLote:'asc'}}), clients:await tx.cliente.findMany(), formulas:await tx.formulaMaster.findMany({select:{id:true}}) };
  },{isolationLevel:'RepeatableRead',timeout:30000});
  const orderPlans=[], lotPlans=[], pending=[];
  for(const order of data.orders) {
    if(order.items.length || order.clienteRuc?.startsWith('TEST-')) continue;
    if(new Date(order.updatedAt).getTime()>Date.now()-15*60000) {
      pending.push({kind:'ACTIVIDAD_RECIENTE',code:order.codigoOrden,reason:'Pedido modificado en los últimos 15 minutos; se deja para una conciliación posterior al despliegue.'}); continue;
    }
    const original=parse(order.notasAdmin).items;
    const raw=Array.isArray(original)&&original.length ? original : [{id:'legado-0',formulaId:order.formulaId,productoNombre:order.productoNombre,cantidad:Number(order.cantidadSolicitada),unidadMedida:order.unidadMedida,aditivos:[]}];
    const lines=[];
    for(const [index,item] of raw.entries()) {
      const unit=units[String(item.unidadMedida || item.unidad || '').toUpperCase()];
      const quantity=Number(item.cantidad);
      if(!unit || !(quantity>0) || !Number.isFinite(quantity) || !data.formulas.some(f=>f.id===item.formulaId)) { lines.length=0;break; }
      const price=item.precioUnitario == null ? null : Number(item.precioUnitario);
      if(price!=null&&(!Number.isFinite(price)||price<0)) {lines.length=0;break;}
      lines.push({id:crypto.randomUUID(),pedidoId:order.id,indice:index,codigoLinea:String(item.id || `legado-${index}`),productoNombre:item.productoNombre || order.productoNombre,
        formulaId:item.formulaId,varianteId:item.varianteId || null,cantidad:quantity,unidadMedida:unit,precioUnitario:price,
        subtotal:price==null?null:new Prisma.Decimal(price).mul(quantity).toDecimalPlaces(2).toString(),metadata:item});
    }
    if(!lines.length || new Set(lines.map(l=>l.codigoLinea)).size!==lines.length || !exact(lines[0].cantidad,order.cantidadSolicitada) || lines[0].unidadMedida!==units[order.unidadMedida] || lines[0].formulaId!==order.formulaId) {
      pending.push({kind:'PEDIDO',code:order.codigoOrden,reason:'Detalle ausente, inválido o contradictorio con cabecera; no se inventaron líneas.'});continue;
    }
    const hasPrices=lines.every(l=>l.subtotal!=null);
    const sum=hasPrices?lines.reduce((s,l)=>s.plus(l.subtotal),new Prisma.Decimal(0)).plus(order.adicionales.reduce((s,a)=>s.plus(new Prisma.Decimal(a.cantidad).mul(a.precioUnitarioVenta).toDecimalPlaces(2)),new Prisma.Decimal(0))):null;
    const checked=hasPrices&&exact(sum,order.montoTotal)&&Number(order.montoTotal)>0;
    const previous={origenRegistro:order.origenRegistro,importeValidado:order.importeValidado,updatedAt:order.updatedAt};
    orderPlans.push({id:order.id,code:order.codigoOrden,previous,expected:{notasAdmin:order.notasAdmin,formulaId:order.formulaId,cantidadSolicitada:String(order.cantidadSolicitada),unidadMedida:order.unidadMedida,montoTotal:String(order.montoTotal),clienteId:order.clienteId},proposed:{origenRegistro:'DETALLE_LEGADO_NOTAS_ADMIN',importeValidado:checked},lines});
    if(!checked) pending.push({kind:'IMPORTE',code:order.codigoOrden,reason:hasPrices?'Subtotal de líneas no coincide o total cero.':'Precio unitario ausente; monto de cabecera conservado y sin certificar.'});
  }
  const docs=sourceDocuments();
  for(const lot of data.lots) {
    if(lot.pedidoItemId || lot.clienteId || /^LOTE-TEST/.test(lot.codigoLote)) continue;
    const owner=data.orders.find(o=>o.id===lot.pedidoComercialId);
    if(new Date(lot.updatedAt).getTime()>Date.now()-15*60000 || (owner&&new Date(owner.updatedAt).getTime()>Date.now()-15*60000)) {
      pending.push({kind:'ACTIVIDAD_RECIENTE',code:lot.codigoLote,reason:'El lote o su pedido está siendo modificado recientemente; se conserva para la siguiente conciliación.'}); continue;
    }
    const previous={clienteId:lot.clienteId,pedidoItemId:lot.pedidoItemId,unidadMedida:lot.unidadMedida,conciliacionEstado:lot.conciliacionEstado,updatedAt:lot.updatedAt};
    const proposed={}; let evidence;
    if(lot.pedidoComercialId) {
      const order=data.orders.find(o=>o.id===lot.pedidoComercialId);
      const plan=orderPlans.find(p=>p.id===lot.pedidoComercialId);
      const lines=plan?.lines || order?.items || [];
      const candidates=lines.filter(l=>l.formulaId===lot.formulaId && exact(l.cantidad,lot.cantidadPlanificada));
      const client=order?.clienteRef;
      if(client && client.ruc===order.clienteRuc && name(client.razonSocial)===name(lot.clienteNombre)) proposed.clienteId=client.id;
      if(candidates.length===1) { proposed.pedidoItemId=candidates[0].id; proposed.unidadMedida=candidates[0].unidadMedida; }
      evidence={source:'Pedido existente y detalle original',orderId:order?.id,code:order?.codigoOrden,formulaQuantityMatches:candidates.length};
    } else {
      const match=/^LOT-2026-(\d{8})(\d{2})$/.exec(lot.codigoLote);
      const code=match?`OP-${match[1]}-${match[2]}`:null;
      const doc=docs.find(d=>d.code===code && d.formulaId===lot.formulaId && exact(d.quantity,lot.cantidadPlanificada) && name(d.clientName)===name(lot.clienteNombre));
      if(doc) {
        const client=data.clients.find(c=>c.id===doc.clientId && c.ruc===doc.ruc && name(c.razonSocial)===name(doc.clientName));
        if(client) proposed.clienteId=client.id;
        proposed.unidadMedida=units[doc.unit]; evidence=doc;
      }
      pending.push({kind:'VINCULO_COMERCIAL',code:lot.codigoLote,reason:'No hay pedido comercial acreditado para vincular. Se conserva la procedencia; no se creó venta, factura o precio.'});
    }
    if(Object.keys(proposed).length) {
      proposed.conciliacionEstado=proposed.pedidoItemId&&proposed.clienteId?'VINCULO_LEGADO_RECETA_PENDIENTE':'REFERENCIA_IMPORTACION_PENDIENTE';
      lotPlans.push({id:lot.id,code:lot.codigoLote,previous,expected:{pedidoComercialId:lot.pedidoComercialId,formulaId:lot.formulaId,cantidadPlanificada:String(lot.cantidadPlanificada),clienteNombre:lot.clienteNombre},proposed,evidence});
    } else pending.push({kind:'UNIDAD_CLIENTE',code:lot.codigoLote,reason:'No existe evidencia unívoca para corregir la relación y unidad.'});
  }
  const plan={createdAt:new Date().toISOString(),scope:'Only lines, formal customer links, units and pending flags; stock, ledger, prices and debts untouched.',orderPlans,lotPlans,pending};
  plan.sha256=checksum(plan);
  fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(planFile,JSON.stringify(plan,null,2),{flag:'wx'});
  console.log(JSON.stringify({preview:true,orders:orderPlans.length,lines:orderPlans.reduce((s,p)=>s+p.lines.length,0),lots:lotPlans.length,pending:pending.length}));
}
async function applyOrRollback() {
  const plan=JSON.parse(fs.readFileSync(planFile)); const {sha256,...body}=plan;
  if(checksum(body)!==sha256) throw Error('Repair plan checksum mismatch.');
  if(mode==='apply' && fs.existsSync(receiptFile)) {const receipt=JSON.parse(fs.readFileSync(receiptFile));if(receipt.planSha256!==sha256)throw Error('Different repair already applied.');console.log(JSON.stringify({alreadyApplied:true}));return;}
  const backup=JSON.parse(fs.readFileSync(path.join(directory,'database-manifest.json')));
  if(crypto.createHash('sha256').update(fs.readFileSync(path.join(directory,backup.filename))).digest('hex')!==backup.sha256)throw Error('Backup verification failed.');
  const receipt=mode==='rollback'?JSON.parse(fs.readFileSync(receiptFile)):null;
  if(mode==='apply' && fs.existsSync(path.join(directory,'commercial-links-rollback.json'))) throw Error('This batch was reverted; prepare a fresh preview before applying again.');
  const result=await prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('commercial-links-evidence-repair'))::text AS locked`;
    const after={orders:[],lots:[]};
    const orderIds=plan.orderPlans.map(p=>p.id), lotIds=plan.lotPlans.map(p=>p.id);
    await tx.$queryRawUnsafe('SELECT id FROM pedidos_comerciales WHERE id=ANY($1::text[]) ORDER BY id FOR UPDATE',orderIds);
    await tx.$queryRawUnsafe('SELECT id FROM ordenes_produccion WHERE id=ANY($1::text[]) ORDER BY id FOR UPDATE',lotIds);
    const currentOrders=await tx.pedidoComercial.findMany({where:{id:{in:orderIds}},include:{items:true}});
    const currentLots=await tx.ordenProduccion.findMany({where:{id:{in:lotIds}}});
    for(const p of plan.orderPlans) {
      const row=currentOrders.find(o=>o.id===p.id);
      if(!row)throw Error('Order removed: '+p.code);
      const expected=mode==='apply'?p.previous.updatedAt:receipt.orders.find(o=>o.id===p.id).updatedAt;
      if(new Date(row.updatedAt).getTime()!==new Date(expected).getTime())throw Error('Order changed after snapshot: '+p.code);
      if(mode==='apply') {
        if(row.items.length)throw Error('Order already has lines: '+p.code);
      }
    }
    for(const p of plan.lotPlans) {
      const row=currentLots.find(l=>l.id===p.id);
      if(!row)throw Error('Lot removed: '+p.code);
      const expected=mode==='apply'?p.previous.updatedAt:receipt.lots.find(l=>l.id===p.id).updatedAt;
      if(new Date(row.updatedAt).getTime()!==new Date(expected).getTime())throw Error('Lot changed after snapshot: '+p.code);
    }
    const lineIds=plan.orderPlans.flatMap(p=>p.lines.map(l=>l.id));
    if(mode==='apply') await tx.pedidoComercialItem.createMany({data:plan.orderPlans.flatMap(p=>p.lines)});
    else if(await tx.ordenProduccion.count({where:{pedidoItemId:{in:lineIds},id:{notIn:lotIds}}}))throw Error('A new lot references a repaired line; reversal requires review.');
    const lotUpdates=plan.lotPlans.map(p=>{const values=mode==='apply'?{...p.previous,...p.proposed}:p.previous;return {id:p.id,cliente_id:values.clienteId,pedido_item_id:values.pedidoItemId,unidad_medida:values.unidadMedida,conciliacion_estado:values.conciliacionEstado,updated_at:mode==='apply'?new Date().toISOString():values.updatedAt};});
    await tx.$executeRawUnsafe(`UPDATE ordenes_produccion p SET cliente_id=v.cliente_id, pedido_item_id=v.pedido_item_id, unidad_medida=v.unidad_medida, conciliacion_estado=v.conciliacion_estado, "updatedAt"=v.updated_at FROM json_to_recordset($1::json) AS v(id text,cliente_id text,pedido_item_id text,unidad_medida text,conciliacion_estado text,updated_at timestamp) WHERE p.id=v.id`,JSON.stringify(lotUpdates));
    if(mode==='rollback')await tx.pedidoComercialItem.deleteMany({where:{id:{in:lineIds}}});
    const orderUpdates=plan.orderPlans.map(p=>{const values=mode==='apply'?p.proposed:p.previous;return {id:p.id,origen_registro:values.origenRegistro,importe_validado:values.importeValidado,updated_at:mode==='apply'?new Date().toISOString():values.updatedAt};});
    await tx.$executeRawUnsafe('UPDATE pedidos_comerciales p SET origen_registro=v.origen_registro, importe_validado=v.importe_validado, updated_at=v.updated_at FROM json_to_recordset($1::json) AS v(id text,origen_registro text,importe_validado boolean,updated_at timestamp) WHERE p.id=v.id',JSON.stringify(orderUpdates));
    after.orders=await tx.pedidoComercial.findMany({where:{id:{in:orderIds}},select:{id:true,updatedAt:true}});
    after.lots=await tx.ordenProduccion.findMany({where:{id:{in:lotIds}},select:{id:true,updatedAt:true}});
    if(after.orders.length!==orderIds.length || after.lots.length!==lotIds.length) {
      throw Error('Repair row count mismatch.');
    }
    const actor=await tx.usuario.findFirst({where:{dni:'70000000'}});
    if(!actor)throw Error('No ERP user available to record the repair audit.');
    const audit=await tx.auditLog.create({data:{usuarioId:actor.id,accion:mode==='apply'?'CONCILIAR_VINCULOS_LEGADOS':'REVERTIR_VINCULOS_LEGADOS',tablaAfectada:'pedidos_comerciales',registroId:sha256,
      datosAnteriores:{backupSha256:backup.sha256,orders:plan.orderPlans.map(p=>({id:p.id,...p.previous})),lots:plan.lotPlans.map(p=>({id:p.id,...p.previous}))},
      datosNuevos:{batchSha256:sha256,scope:plan.scope,orders:plan.orderPlans.map(p=>({id:p.id,...p.proposed})),lots:plan.lotPlans.map(p=>({id:p.id,...p.proposed,evidence:p.evidence}))}}});
    return {planSha256:sha256,auditId:audit.id,appliedAt:new Date().toISOString(),orders:after.orders.map(o=>({id:o.id,updatedAt:o.updatedAt})),lots:after.lots.map(o=>({id:o.id,updatedAt:o.updatedAt}))};
  },{isolationLevel:'Serializable',maxWait:10000,timeout:60000});
  fs.writeFileSync(mode==='apply'?receiptFile:path.join(directory,'commercial-links-rollback.json'),JSON.stringify(result,null,2),{flag:'wx'});
  console.log(JSON.stringify({[mode]:true,orders:result.orders.length,lots:result.lots.length}));
}
(mode==='preview'?preview():applyOrRollback()).catch(e=>{console.error(e.name,e.meta?.message || e.message.split('\n').slice(-1)[0]);process.exitCode=1;}).finally(()=>prisma.$disconnect());
