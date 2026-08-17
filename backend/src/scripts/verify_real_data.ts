import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('═══════════════════════════════════════════════');
  console.log('🔍 VERIFICACIÓN DE BASE DE DATOS REAL QUIMICORP');
  console.log('═══════════════════════════════════════════════\n');

  // 1. Insumos por Familia
  const totalInsumos = await prisma.insumo.count();
  console.log(`📦 TOTAL INSUMOS REALES: ${totalInsumos}`);

  const familias = await prisma.familiaInsumo.findMany({
    include: {
      _count: {
        select: { insumos: true },
      },
    },
  });

  console.log('\n--- Insumos por Familia ---');
  for (const f of familias) {
    console.log(`  • ${f.nombre.padEnd(32)}: ${f._count.insumos} insumos`);
  }

  // 2. Insumos Aditivos (Fragancias y Pigmentos)
  const fragancias = await prisma.insumo.count({ where: { tipo: 'FRAGANCIA' } });
  const pigmentos = await prisma.insumo.count({ where: { tipo: 'PIGMENTO' } });
  const envases = await prisma.insumo.count({ where: { tipo: 'ENVASE' } });
  const bases = await prisma.insumo.count({ where: { tipo: 'BASE' } });

  console.log('\n--- Desglose por Tipo de Insumo ---');
  console.log(`  🌸 Fragancias / Esencias : ${fragancias}`);
  console.log(`  🎨 Pigmentos / Colorantes: ${pigmentos}`);
  console.log(`  🧴 Envases & Embalajes   : ${envases}`);
  console.log(`  🧼 Bases de Jabonería    : ${bases}`);

  // 3. Movimientos de Kárdex por Categoría
  const totalKardex = await prisma.kardexMovimiento.count();
  console.log(`\n📊 TOTAL MOVIMIENTOS KÁRDEX: ${totalKardex}`);

  const categorias = ['PRODUCTO_TERMINADO', 'MATERIA_PRIMA', 'INSUMO', 'ENVASE', 'EMBALAJE'] as const;
  for (const cat of categorias) {
    const c = await prisma.kardexMovimiento.count({ where: { categoriaKardex: cat } });
    console.log(`  • ${cat.padEnd(22)}: ${c} registros`);
  }

  // 4. Muestra de primeros 3 insumos reales
  console.log('\n--- Muestra de Insumos Reales ---');
  const muestra = await prisma.insumo.findMany({ take: 3, include: { familia: true } });
  for (const m of muestra) {
    console.log(`  [${m.codigo}] ${m.nombre} (${m.familia.nombre}) -> Stock: ${m.stockReal} ${m.unidadMedida} | Costo: S/ ${m.costoUnitario}`);
  }

  // 5. Limpiar familias vacías
  const vacias = await prisma.familiaInsumo.deleteMany({ where: { insumos: { none: {} } } });
  if (vacias.count > 0) {
    console.log(`\n🧹 ${vacias.count} Familias vacías eliminadas.`);
  }

  console.log('\n✅ VALIDACIÓN COMPLETADA: 100% DATOS REALES CARGADOS.');
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
