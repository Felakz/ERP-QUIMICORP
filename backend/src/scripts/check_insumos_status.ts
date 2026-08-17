import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInsumos() {
  const total = await prisma.insumo.count();
  const oficiales = await prisma.insumo.findMany({
    where: { codigo: { lte: 'INS-231' } },
  });
  const extras = await prisma.insumo.findMany({
    where: { codigo: { gt: 'INS-231' } },
  });

  console.log(`Total insumos en BD: ${total}`);
  console.log(`Insumos oficiales de la hoja (INS-001 a INS-231): ${oficiales.length}`);
  console.log(`Insumos adicionales creados automáticamente por sync_formulas: ${extras.length}`);
  if (extras.length > 0) {
    console.log('Muestra de insumos adicionales:');
    extras.slice(0, 10).forEach(e => console.log(`  [${e.codigo}] ${e.nombre}`));
  }
}

checkInsumos().finally(() => prisma.$disconnect());
