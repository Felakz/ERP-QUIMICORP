import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sinVincular = await prisma.cuentaCobrar.findMany({
    where: { clienteId: null },
  });
  console.log(`Cuentas sin clienteId (${sinVincular.length}):`);
  for (const c of sinVincular) {
    console.log(`Doc: ${c.codigoDoc} | Cliente: '${c.clienteNombre}' | RUC: '${c.clienteRuc}' | Total: S/ ${c.montoTotal}`);
  }
}

main().finally(() => prisma.$disconnect());
