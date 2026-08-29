import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clientes = await prisma.cliente.findMany({
    include: { contactos: true, cuentasCobrar: true },
    orderBy: { razonSocial: 'asc' },
  });

  console.log(`TOTAL CLIENTES EN BD: ${clientes.length}\n`);
  for (const c of clientes) {
    console.log(`- ID: ${c.id}`);
    console.log(`  Nombre: ${c.razonSocial}`);
    console.log(`  RUC: ${c.ruc}`);
    console.log(`  Dirección: ${c.direccion || '(sin dirección)'}`);
    console.log(`  Contacto: ${c.contacto || '(sin contacto)'}`);
    console.log(`  Contactos relacionales: ${c.contactos.length}`);
    console.log(`  Cuentas por cobrar asociadas: ${c.cuentasCobrar.length}`);
    console.log('');
  }
}

main().finally(() => prisma.$disconnect());
