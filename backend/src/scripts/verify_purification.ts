import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  const countInsumos = await prisma.insumo.count();
  const countFormulas = await prisma.formulaMaster.count();
  const countDetalles = await prisma.formulaDetalle.count();
  const countKardex = await prisma.kardexMovimiento.count();

  console.log('--- ESTADO DE BASE DE DATOS TRAS PURIFICACIÓN ---');
  console.log(`📦 Insumos en Inventario: ${countInsumos}`);
  console.log(`🔬 Fórmulas Maestras: ${countFormulas}`);
  console.log(`🧪 Componentes de Recetas: ${countDetalles}`);
  console.log(`📊 Movimientos de Kárdex: ${countKardex}`);

  const sampleInsumos = await prisma.insumo.findMany({
    take: 5,
    orderBy: { codigo: 'desc' },
  });
  console.log('\nÚltimos 5 insumos en catálogo:');
  sampleInsumos.forEach(i => console.log(`  [${i.codigo}] "${i.nombre}" | Stock: ${i.stockReal} ${i.unidadMedidaVisual || i.unidadMedida}`));
}

verify().finally(() => prisma.$disconnect());
