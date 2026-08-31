const { PrismaClient } = require('./backend/node_modules/.prisma/client');
const prisma = new PrismaClient();
(async () => {
  const detalles = await prisma.formulaDetalle.findMany({ where: { insumoId: null } });
  console.log('Detalles huerfanos:', detalles.length);
  const insumos = await prisma.insumo.findMany();
  const byCodigo = new Map(insumos.map(i => [String(i.codigo||'').trim().toUpperCase(), i]));
  const byNombre = new Map(insumos.map(i => [String(i.nombre||'').trim().toLowerCase(), i]));
  let fixed = 0;
  for (const d of detalles) {
    const sku = String(d.skuComponente || '').trim().toUpperCase();
    const nom = String(d.nombreComponente || '').trim().toLowerCase();
    let ins = byCodigo.get(sku) || byNombre.get(nom);
    if (!ins && d.nombreComponente) {
      const norm = nom.replace(/\s+/g,' ');
      ins = insumos.find(i => {
        const iname = String(i.nombre||'').toLowerCase();
        return iname.includes(norm) || norm.includes(iname);
      });
    }
    if (ins) {
      await prisma.formulaDetalle.update({ where: { id: d.id }, data: { insumoId: ins.id } });
      fixed++;
    } else {
      console.log('No match para', d.id, d.skuComponente, d.nombreComponente);
    }
  }
  console.log('Revinculados:', fixed);
  await prisma.$disconnect();
})();
