if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public";
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = "postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public";
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Insertando 1 pedido de prueba...');

  let formula = await prisma.formulaMaster.findFirst();
  if (!formula) {
    formula = await prisma.formulaMaster.create({
      data: {
        codigoFormula: 'FM-8128-v2',
        nombreProducto: 'Crema Muscular Mentolada v2',
        densidadTeorica: 1.05,
        estado: 'ACTIVA',
      },
    });
  }

  console.log('PRISMA CLIENT KEYS:', Object.keys(prisma).filter(k => !k.startsWith('$')));
  const model = (prisma as any).pedidoComercial || (prisma as any).PedidoComercial;
  if (!model) {
    console.error('No se encontró el modelo pedidoComercial en el PrismaClient generado.');
    return;
  }
  const todosPedidos = await (prisma as any).pedidoComercial.findMany();
  console.log('📦 TOTAL PEDIDOS EN POSTGRESQL:', todosPedidos.length);
  console.log('DATOS:', JSON.stringify(todosPedidos, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
