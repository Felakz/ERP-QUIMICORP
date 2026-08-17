import { PrismaClient, TipoInsumo } from '@prisma/client';

const prisma = new PrismaClient();

async function testFlow() {
  console.log('🧪 Verificando flujo de aditivos en base de datos...');

  // 1. Verificar insumos por tipo
  const fragancias = await prisma.insumo.findMany({
    where: { tipo: TipoInsumo.FRAGANCIA },
  });
  console.log(`✅ Fragancias registradas: ${fragancias.length}`);

  const pigmentos = await prisma.insumo.findMany({
    where: { tipo: TipoInsumo.PIGMENTO },
  });
  console.log(`✅ Pigmentos registrados: ${pigmentos.length}`);

  // 2. Crear un pedido comercial de prueba con aditivos
  const pedidoTest = await prisma.pedidoComercial.create({
    data: {
      codigoOrden: 'OP-TEST-ADITIVOS',
      clienteNombre: 'EMPRESA INDUSTRIAL QUÍMICA TEST',
      clienteRuc: '20123456789',
      productoNombre: 'Detergente Industrial Líquido Desengrasante',
      cantidadSolicitada: 500, // 500 KG
      unidadMedida: 'KG',
      montoTotal: 1500.0,
      fechaPrometida: new Date(),
      docType: 'OP',
      aromaText: fragancias[0]?.nombre || 'Fragancia Lavanda Francesa',
      colorText: pigmentos[0]?.nombre || 'Pigmento Azul Ultramar Líquido',
      aditivos: {
        create: [
          {
            insumoId: fragancias[0].id,
            tipo: TipoInsumo.FRAGANCIA,
            porcentaje: 1.0, // 1%
            gramosCalculados: 500 * 1000 * 0.01, // 5000 gramos
          },
          {
            insumoId: pigmentos[0].id,
            tipo: TipoInsumo.PIGMENTO,
            porcentaje: 0.5, // 0.5%
            gramosCalculados: 500 * 1000 * 0.005, // 2500 gramos
          },
        ],
      },
    },
    include: {
      aditivos: {
        include: { insumo: true },
      },
    },
  });

  console.log('✅ Pedido con aditivos creado exitosamente:');
  console.log({
    id: pedidoTest.id,
    codigo: pedidoTest.codigoOrden,
    cantidadKg: pedidoTest.cantidadSolicitada,
    aditivos: pedidoTest.aditivos.map((a) => ({
      tipo: a.tipo,
      insumo: a.insumo.nombre,
      porcentaje: `${a.porcentaje}%`,
      gramos: `${a.gramosCalculados} g`,
    })),
  });

  // Limpiar pedido de prueba
  await prisma.pedidoComercial.delete({ where: { id: pedidoTest.id } });
  console.log('🧹 Pedido de prueba eliminado limpiamente.');
}

testFlow()
  .catch((e) => {
    console.error('❌ Error en test de aditivos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
