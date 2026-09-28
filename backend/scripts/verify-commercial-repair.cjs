const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto');
const {PrismaClient}=require('@prisma/client');
if(!process.env.DATABASE_URL)process.loadEnvFile(path.resolve(__dirname,'../.env'));
const directory=process.argv[2];
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(directory,'public-database-before.json.gz'))));
const plan=JSON.parse(fs.readFileSync(path.join(directory,'commercial-links-plan.json')));
const receipt=JSON.parse(fs.readFileSync(path.join(directory,'commercial-links-receipt.json')));
const db=new PrismaClient(); const results=[];
const canonical=value=>JSON.stringify(Object.fromEntries(Object.keys(value).sort().map(k=>[k,value[k]])));
async function main(){
 const checks=await db.$transaction(async tx=>{
  await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
  for(const table of ['insumos','kardex_movimientos','kardex_inmutable','cuentas_cobrar','pagos_abonos','ordenes_compra','orden_compra_items']){
   const before=JSON.parse(snapshot.tables[table]); const cols=snapshot.columns.filter(c=>c.table_name===table).map(c=>'"'+c.column_name+'"').join(',');
   const [{payload}]=await tx.$queryRawUnsafe(`SELECT coalesce(json_agg(t)::text,'[]') AS payload FROM (SELECT ${cols} FROM "${table}") t`);
   const after=JSON.parse(payload); const byId=new Map(after.map(r=>[r.id,r]));
   const altered=before.filter(r=>canonical(r)!==canonical(byId.get(r.id)||{})).map(r=>r.id);
   const added=after.filter(r=>!before.some(b=>b.id===r.id)).map(r=>r.id);
   results.push({table,originalRows:before.length,currentRows:after.length,alteredOriginalRows:altered,rowsAddedSinceBackup:added});
  }
  const orders=await tx.pedidoComercial.findMany({where:{id:{in:plan.orderPlans.map(p=>p.id)}},include:{items:true}});
  const lots=await tx.ordenProduccion.findMany({where:{id:{in:plan.lotPlans.map(p=>p.id)}}});
  const failures=[];
  for(const p of plan.orderPlans){const row=orders.find(o=>o.id===p.id);if(!row||row.items.length!==p.lines.length||row.origenRegistro!==p.proposed.origenRegistro)failures.push(p.code);}
  for(const p of plan.lotPlans){const row=lots.find(l=>l.id===p.id);if(!row||Object.entries(p.proposed).some(([k,v])=>row[k]!==v))failures.push(p.code);}
  const audit=await tx.auditLog.findUnique({where:{id:receipt.auditId}});
  return {failures,auditRecorded:!!audit,orders:orders.length,lines:orders.reduce((s,p)=>s+p.items.length,0),lots:lots.length,
   formalClientLinks:plan.lotPlans.filter(p=>p.proposed.clienteId).length,commercialLineLinks:plan.lotPlans.filter(p=>p.proposed.pedidoItemId).length,
   documentedImportUnits:plan.lotPlans.filter(p=>p.evidence?.source==='fase2_pedidos_sept.sql').length,
   pendingCommercialOrders:plan.pending.filter(p=>p.kind==='VINCULO_COMERCIAL').length,pendingMonetaryValidation:plan.pending.filter(p=>p.kind==='IMPORTE').length};
 },{isolationLevel:'RepeatableRead',timeout:60000});
 const report={verifiedAt:new Date().toISOString(),backupCapturedAt:snapshot.capturedAt,repairPlanSha256:plan.sha256,receiptAppliedAt:receipt.appliedAt,summary:checks,protectedTables:results,
  note:'Any concurrent business activity is reported separately. No protected table is written by the repair script. Monetary checks establish arithmetic agreement, not documentary proof of a sale; missing evidence remains pending.'};
 fs.writeFileSync(path.resolve(__dirname,'../../reports/order-registration-audit/repair-verification.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({summary:checks,protectedTables:results.map(r=>({table:r.table,altered:r.alteredOriginalRows.length,added:r.rowsAddedSinceBackup.length}))}));
 if(checks.failures.length||!checks.auditRecorded)throw Error('Repair verification failed.');
}
main().catch(e=>{console.error(e.name,e.message.split('\n').slice(-1)[0]);process.exitCode=1;}).finally(()=>db.$disconnect());
