const { PrismaClient } = require('./backend/node_modules/.prisma/client');
const prisma = new PrismaClient();
(async () => {
  const fam = await prisma.familiaInsumo.findFirst({ where: { nombre: 'FRAGANCIAS_Y_ACEITES' } });
  const familiaId = fam.id;
  const toCreate = [
    { codigo: 'INS-999', nombre: 'FRAGANCIA', familiaId, unidadMedida: 'KG', tipo: 'FRAGANCIA' },
    { codigo: 'INS-998', nombre: 'ACEITE DE ARGAN', familiaId, unidadMedida: 'KG', tipo: 'OTRO' },
    { codigo: 'INS-997', nombre: 'ACEITE ESENCIAL DE ROMERO', familiaId, unidadMedida: 'KG', tipo: 'OTRO' },
  ];
  for (const d of toCreate) {
    const exists = await prisma.insumo.findUnique({ where: { codigo: d.codigo } });
    if (!exists) {
      await prisma.insumo.create({ data: { codigo: d.codigo, nombre: d.nombre, familiaId: d.familiaId, unidadMedida: d.unidadMedida, tipo: d.tipo, stockReal: 1000 } });
      console.log('Creado', d.codigo);
    } else console.log('Ya existe', d.codigo);
  }
  // Revincular los 5 de BATANA especificamente
  const batanaFormula = await prisma.formulaMaster.findFirst({ where: { nombreProducto: { contains: 'BATANA', mode: 'insensitive' } } });
  console.log('Batana formula', batanaFormula.id, batanaFormula.nombreProducto);
  const detalles = await prisma.formulaDetalle.findMany({ where: { formulaId: batanaFormula.id } });
  console.log('Detalles', detalles.length);
  for (const det of detalles) {
    const sku = det.skuComponente;
    const nom = det.nombreComponente;
    let ins = null;
    if (sku) ins = await prisma.insumo.findUnique({ where: { codigo: sku } });
    if (!ins && nom) ins = await prisma.insumo.findFirst({ where: { nombre: { equals: nom, mode: 'insensitive' } } });
    if (!ins && nom === 'FRAGANCIA') ins = await prisma.insumo.findFirst({ where: { codigo: 'INS-999' } });
    if (!ins && nom === 'ACEITE DE ARGAN') ins = await prisma.insumo.findFirst({ where: { codigo: 'INS-998' } });
    if (!ins && nom === 'ACEITE ESENCIAL DE ROMERO') ins = await prisma.insumo.findFirst({ where: { codigo: 'INS-997' } });
    if (ins) {
      await prisma.formulaDetalle.update({ where: { id: det.id }, data: { insumoId: ins.id } });
      console.log('Vinculado', det.id, nom || sku, '->', ins.codigo);
    } else console.log('No insumo para', det.id, nom, sku);
  }
  await prisma.$disconnect();
})();
