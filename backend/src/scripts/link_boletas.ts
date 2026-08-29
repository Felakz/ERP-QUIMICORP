import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clienteGenerico = await prisma.cliente.upsert({
    where: { ruc: '00000000' },
    create: {
      razonSocial: 'VENTAS MOSTRADOR / BOLETAS DNI',
      ruc: '00000000',
      condicionPago: 'Contado',
      direccion: 'Ventas de mostrador',
      contacto: 'Público General',
    },
    update: {},
  });

  const res = await prisma.cuentaCobrar.updateMany({
    where: { clienteId: null },
    data: {
      clienteId: clienteGenerico.id,
      clienteNombre: 'VENTAS MOSTRADOR / BOLETAS DNI',
      clienteRuc: '00000000',
    },
  });

  console.log(`✅ ${res.count} boletas de mostrador vinculadas al cliente ${clienteGenerico.razonSocial}`);
}

main().finally(() => prisma.$disconnect());
