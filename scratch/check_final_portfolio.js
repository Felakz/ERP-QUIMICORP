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

  console.log(`\n✅ REVISIÓN FINAL DEL DIRECTORIO COMERCIAL (${clientes.length} CLIENTES EN TOTAL):`);
  console.log('----------------------------------------------------------------------------------');
  clientes.forEach((c, idx) => {
    console.log(`${(idx + 1).toString().padStart(2, '0')}. Razón Social : ${c.razonSocial}`);
    console.log(`    RUC          : ${c.ruc}`);
    console.log(`    Contacto/Dueño: ${c.contacto || 'N/A'}`);
    console.log(`    Transporte   : ${c.metodoEnvio || 'N/A'}`);
    console.log(`    Dirección    : ${c.direccion || 'N/A'}`);
    console.log('----------------------------------------------------------------------------------');
  });

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
