import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Unificación y Depuración de Clientes en PostgreSQL ---');

  // =========================================================================
  // 1. UNIFICAR RORY ALFREDO SERPA FLORES (DNI: 48558440)
  // =========================================================================
  const roryOriginal = await prisma.cliente.findUnique({
    where: { ruc: '48558440' },
  });
  const roryDuplicado = await prisma.cliente.findUnique({
    where: { ruc: '48558540' },
  });

  if (roryOriginal && roryDuplicado) {
    console.log('Unificando RORY ALFREDO SERPA FLORES...');
    // Reasignar cuentas por cobrar
    await prisma.cuentaCobrar.updateMany({
      where: { clienteId: roryDuplicado.id },
      data: {
        clienteId: roryOriginal.id,
        clienteNombre: roryOriginal.razonSocial,
        clienteRuc: roryOriginal.ruc,
      },
    });

    // Reasignar pedidos si hubiera
    await prisma.pedidoComercial.updateMany({
      where: { clienteId: roryDuplicado.id },
      data: { clienteId: roryOriginal.id },
    });

    // Eliminar duplicado
    await prisma.cliente.delete({ where: { id: roryDuplicado.id } });
    console.log('✅ Rory Alfredo Serpa Flores unificado en DNI 48558440.');
  }

  // =========================================================================
  // 2. UNIFICAR ALFALION INVESTMENT S.A.C. (RUC termina en 24: 20612434124)
  // =========================================================================
  const alfalionOriginal = await prisma.cliente.findUnique({
    where: { ruc: '20612434124' },
  });
  const alfalionDuplicado = await prisma.cliente.findUnique({
    where: { ruc: '20612434125' },
  });

  if (alfalionOriginal && alfalionDuplicado) {
    console.log('Unificando ALFALION INVESTMENT S.A.C....');
    await prisma.cuentaCobrar.updateMany({
      where: { clienteId: alfalionDuplicado.id },
      data: {
        clienteId: alfalionOriginal.id,
        clienteNombre: alfalionOriginal.razonSocial,
        clienteRuc: alfalionOriginal.ruc,
      },
    });

    await prisma.pedidoComercial.updateMany({
      where: { clienteId: alfalionDuplicado.id },
      data: { clienteId: alfalionOriginal.id },
    });

    await prisma.cliente.delete({ where: { id: alfalionDuplicado.id } });
    console.log('✅ Alfalion Investment S.A.C. unificado en RUC 20612434124.');
  }

  // =========================================================================
  // 3. UNIFICAR DAVID SARMIENTO -> DAVID JUNIOR SARMIENTO CARDENAS (DNI: 77231684)
  // =========================================================================
  const davidConDni = await prisma.cliente.findUnique({
    where: { ruc: '77231684' },
  });
  const davidSinRuc = await prisma.cliente.findFirst({
    where: {
      razonSocial: 'DAVID SARMIENTO',
      ruc: { startsWith: 'SIN-RUC' },
    },
    include: { contactos: true },
  });

  if (davidConDni && davidSinRuc) {
    console.log('Unificando DAVID JUNIOR SARMIENTO CARDENAS...');
    // Migrar contactos
    await prisma.contactoRepresentante.updateMany({
      where: { clienteId: davidSinRuc.id },
      data: { clienteId: davidConDni.id },
    });

    // Migrar pedidos
    await prisma.pedidoComercial.updateMany({
      where: { clienteId: davidSinRuc.id },
      data: { clienteId: davidConDni.id },
    });

    // Actualizar nombre limpio en davidConDni
    await prisma.cliente.update({
      where: { id: davidConDni.id },
      data: {
        razonSocial: 'DAVID JUNIOR SARMIENTO CARDENAS',
        direccion: davidSinRuc.direccion || 'Lima, Perú',
        contacto: davidSinRuc.contacto || 'David Sarmiento',
      },
    });

    await prisma.cliente.delete({ where: { id: davidSinRuc.id } });
    console.log('✅ David Junior Sarmiento Cárdenas unificado en DNI 77231684.');
  }

  // =========================================================================
  // 4. UNIFICAR FENIX G EXPRESS S.A.C. (RUC: 20613316184)
  // =========================================================================
  const fenixOriginal = await prisma.cliente.findUnique({
    where: { ruc: '20613316184' },
  });
  const fenixDuplicado = await prisma.cliente.findUnique({
    where: { ruc: '26133161840000000000' },
  });

  if (fenixOriginal) {
    console.log('Unificando FENIX G EXPRESS S.A.C....');
    if (fenixDuplicado) {
      await prisma.cuentaCobrar.updateMany({
        where: { clienteId: fenixDuplicado.id },
        data: {
          clienteId: fenixOriginal.id,
          clienteNombre: 'FENIX G EXPRESS S.A.C.',
          clienteRuc: fenixOriginal.ruc,
        },
      });

      await prisma.pedidoComercial.updateMany({
        where: { clienteId: fenixDuplicado.id },
        data: { clienteId: fenixOriginal.id },
      });

      await prisma.cliente.delete({ where: { id: fenixDuplicado.id } });
    }

    await prisma.cliente.update({
      where: { id: fenixOriginal.id },
      data: {
        razonSocial: 'FENIX G EXPRESS S.A.C.',
      },
    });
    console.log('✅ Fenix G Express S.A.C. unificado en RUC 20613316184.');
  }

  // =========================================================================
  // 5. UNIFICAR RENZO -> RENZO ADRIAN AVILA GUTIERREZ (Santa Anita)
  // =========================================================================
  const renzoSantaAnita = await prisma.cliente.findUnique({
    where: { ruc: '70042804' },
    include: { contactos: true },
  });
  const renzoAvila = await prisma.cliente.findUnique({
    where: { ruc: '72768719' },
  });

  if (renzoSantaAnita && renzoAvila) {
    console.log('Unificando RENZO ADRIAN AVILA GUTIERREZ...');
    // Pasar cuentas por cobrar de renzoAvila a renzoSantaAnita
    await prisma.cuentaCobrar.updateMany({
      where: { clienteId: renzoAvila.id },
      data: {
        clienteId: renzoSantaAnita.id,
        clienteNombre: 'RENZO ADRIAN AVILA GUTIERREZ',
        clienteRuc: renzoSantaAnita.ruc,
      },
    });

    await prisma.pedidoComercial.updateMany({
      where: { clienteId: renzoAvila.id },
      data: { clienteId: renzoSantaAnita.id },
    });

    // Actualizar nombre a su razón social completa
    await prisma.cliente.update({
      where: { id: renzoSantaAnita.id },
      data: {
        razonSocial: 'RENZO ADRIAN AVILA GUTIERREZ',
      },
    });

    await prisma.cliente.delete({ where: { id: renzoAvila.id } });
    console.log('✅ Renzo Adrián Ávila Gutiérrez unificado (Santa Anita, DNI 70042804).');
  }

  console.log('\n--- Unificación finalizada con éxito ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
