import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clientes = await prisma.cliente.findMany();
  console.log(`Total clientes en tabla 'clientes': ${clientes.length}`);

  const cuentas = await prisma.cuentaCobrar.findMany();
  console.log(`Total cuentas por cobrar en 'cuentas_cobrar': ${cuentas.length}`);

  const vinculadas = cuentas.filter((c) => c.clienteId !== null);
  const noVinculadas = cuentas.filter((c) => c.clienteId === null);

  console.log(`Cuentas vinculadas a un cliente: ${vinculadas.length}`);
  console.log(`Cuentas sin vincular: ${noVinculadas.length}`);

  if (noVinculadas.length > 0) {
    const faltantes = new Map<string, string>();
    for (const c of noVinculadas) {
      faltantes.set(c.clienteRuc, c.clienteNombre);
    }
    console.log('\nClientes presentes en el Excel de Cobranzas que no estaban en la Cartera:');
    for (const [ruc, nombre] of faltantes.entries()) {
      console.log(`- RUC: ${ruc} -> ${nombre}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
