const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public'
    }
  }
});

async function main() {
  const users = await prisma.usuario.findMany();
  console.log('Usuarios encontrados en la BD:', users.length);
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  prisma.$disconnect();
});
