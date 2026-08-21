const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public'
    }
  }
});

async function main() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { razonSocial: 'asc' }
  });

  console.log(`\n📋 CARTERA OFICIAL FINAL EN BASE DE DATOS (${clientes.length} CLIENTES):`);
  clientes.forEach((c, idx) => {
    console.log(`${idx + 1}. [RUC: ${c.ruc}] ${c.razonSocial} | Tel: ${c.telefono || 'N/A'} | Dir: ${c.direccion || 'N/A'}`);
  });

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
