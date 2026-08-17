import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function vaciar() {
  console.log('🧹 Vaciando completamente las tablas de Inventario y Kárdex...');

  const results = await prisma.$transaction([
    prisma.kardexMovimiento.deleteMany({}),
    prisma.kardexInmutable.deleteMany({}),
    prisma.ajusteFino.deleteMany({}),
    prisma.subAlmacenSobrante.deleteMany({}),
    prisma.pedidoAditivo.deleteMany({}),
    prisma.formulaDetalle.deleteMany({}),
    prisma.insumo.deleteMany({}),
  ]);

  console.log(`✅ kardex_movimientos eliminados : ${results[0].count}`);
  console.log(`✅ kardex_inmutable eliminados   : ${results[1].count}`);
  console.log(`✅ ajustes_finos eliminados      : ${results[2].count}`);
  console.log(`✅ sub_almacen eliminados        : ${results[3].count}`);
  console.log(`✅ pedido_aditivos eliminados    : ${results[4].count}`);
  console.log(`✅ formula_detalles eliminados   : ${results[5].count}`);
  console.log(`✅ insumos eliminados            : ${results[6].count}`);

  const totalInsumos = await prisma.insumo.count();
  const totalKardex = await prisma.kardexMovimiento.count();

  console.log(`\n📦 Total Insumos en BD: ${totalInsumos}`);
  console.log(`📊 Total Kárdex en BD : ${totalKardex}`);
  console.log('✨ Base de datos 100% limpia y lista para recibir los datos reales definitivos.');
}

vaciar()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
