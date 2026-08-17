import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTipos() {
  const fragancias = await prisma.insumo.findMany({
    where: {
      OR: [
        { tipo: 'FRAGANCIA' },
        { categoria: { contains: 'FRAGANCIA' } },
        { nombre: { startsWith: 'FRAG.' } },
        { nombre: { startsWith: 'A.E' } },
        { nombre: { startsWith: 'SAB.' } },
      ],
    },
  });

  const pigmentos = await prisma.insumo.findMany({
    where: {
      OR: [
        { tipo: 'PIGMENTO' },
        { categoria: { contains: 'COLOR' } },
        { nombre: { startsWith: 'COL.' } },
      ],
    },
  });

  console.log(`🌸 Total Fragancias/Aromas/Saborizantes encontrados en los 231 oficiales: ${fragancias.length}`);
  console.log(`🎨 Total Colorantes/Pigmentos encontrados en los 231 oficiales: ${pigmentos.length}`);

  // Asegurar que todos tengan tipo FRAGANCIA o PIGMENTO correcto en Prisma
  for (const f of fragancias) {
    if (f.tipo !== 'FRAGANCIA') {
      await prisma.insumo.update({
        where: { id: f.id },
        data: { tipo: 'FRAGANCIA' },
      });
    }
  }

  for (const p of pigmentos) {
    if (p.tipo !== 'PIGMENTO') {
      await prisma.insumo.update({
        where: { id: p.id },
        data: { tipo: 'PIGMENTO' },
      });
    }
  }

  console.log('✅ Clasificación de tipo en PostgreSQL actualizada.');
}

checkTipos().finally(() => prisma.$disconnect());
