import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.insumo.count();
  console.log(`📦 TOTAL INSUMOS EN BD: ${count}`);

  const porFamilia = await prisma.familiaInsumo.findMany({
    include: { _count: { select: { insumos: true } } },
  });

  console.log('\n--- Insumos por Categoría/Familia ---');
  for (const f of porFamilia) {
    console.log(`  • ${f.nombre.padEnd(25)}: ${f._count.insumos} insumos`);
  }

  // Limpiar familias vacías
  await prisma.familiaInsumo.deleteMany({ where: { insumos: { none: {} } } });
  const sample = await prisma.insumo.findMany({ take: 5, orderBy: { codigo: 'asc' } });
  for (const s of sample) {
    console.log(`  [${s.codigo}] ${s.nombre.padEnd(28)} | Stock Mínimo Calc: ${s.stockReal} GR (Visual: ${s.unidadMedidaVisual}) | Prov: ${s.proveedorHistorico || 'N/A'}`);
  }

  console.log('\n--- Últimos 3 Insumos (con SKU, Unidad Visual y Proveedor) ---');
  const last = await prisma.insumo.findMany({ take: 3, orderBy: { codigo: 'desc' } });
  for (const s of last) {
    console.log(`  [${s.codigo}] ${s.nombre.padEnd(28)} | Stock Mínimo Calc: ${s.stockReal} GR (Visual: ${s.unidadMedidaVisual}) | Prov: ${s.proveedorHistorico || 'N/A'}`);
  }
}

main().finally(() => prisma.$disconnect());
