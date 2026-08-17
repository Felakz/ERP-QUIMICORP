import { PrismaClient, TipoInsumo, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function backfill() {
  console.log('🔄 Iniciando backfill de clientes y aditivos desde pedidos históricos...');

  // 1. Backfill de Clientes
  const pedidos = await prisma.pedidoComercial.findMany({
    include: { aditivos: true },
  });

  console.log(`📦 Procesando ${pedidos.length} pedidos comerciales...`);

  // Insumos aditivos para mapeo aproximado
  const fragancias = await prisma.insumo.findMany({ where: { tipo: TipoInsumo.FRAGANCIA } });
  const pigmentos = await prisma.insumo.findMany({ where: { tipo: TipoInsumo.PIGMENTO } });

  let clientesCreados = 0;
  let aditivosCreados = 0;

  for (const p of pedidos) {
    // 1.1 Asegurar clienteId
    if (!p.clienteId && p.clienteRuc) {
      let c = await prisma.cliente.findUnique({ where: { ruc: p.clienteRuc } });
      if (!c) {
        c = await prisma.cliente.create({
          data: {
            razonSocial: p.clienteNombre || 'Cliente Comercial',
            ruc: p.clienteRuc,
            telefono: p.contactoTelefono,
            direccion: p.direccionDespacho,
            condicionPago: p.condicionPago || 'Contado',
          },
        });
        clientesCreados++;
      }
      await prisma.pedidoComercial.update({
        where: { id: p.id },
        data: { clienteId: c.id },
      });
    }

    // 1.2 Backfill aroma -> aromaText & PedidoAditivo
    const aromaVal = p.aroma || p.aromaText;
    if (aromaVal && p.aditivos.filter((a) => a.tipo === TipoInsumo.FRAGANCIA).length === 0) {
      // Buscar fragancia coincidente o usar la primera por defecto
      const matchFrag =
        fragancias.find((f) => f.nombre.toLowerCase().includes(aromaVal.toLowerCase())) ||
        fragancias[0];

      if (matchFrag) {
        const kg = Number(p.cantidadSolicitada) || 100;
        const pct = 1.0; // 1%
        const gramos = kg * 1000 * (pct / 100);

        await prisma.pedidoAditivo.create({
          data: {
            pedidoId: p.id,
            insumoId: matchFrag.id,
            tipo: TipoInsumo.FRAGANCIA,
            porcentaje: new Prisma.Decimal(pct),
            gramosCalculados: new Prisma.Decimal(gramos),
          },
        });
        aditivosCreados++;
      }

      await prisma.pedidoComercial.update({
        where: { id: p.id },
        data: { aromaText: aromaVal },
      });
    }

    // 1.3 Backfill color -> colorText & PedidoAditivo
    const colorVal = p.color || p.colorText;
    if (colorVal && p.aditivos.filter((a) => a.tipo === TipoInsumo.PIGMENTO).length === 0) {
      const matchPigm =
        pigmentos.find((pig) => pig.nombre.toLowerCase().includes(colorVal.toLowerCase())) ||
        pigmentos[0];

      if (matchPigm) {
        const kg = Number(p.cantidadSolicitada) || 100;
        const pct = 0.5; // 0.5%
        const gramos = kg * 1000 * (pct / 100);

        await prisma.pedidoAditivo.create({
          data: {
            pedidoId: p.id,
            insumoId: matchPigm.id,
            tipo: TipoInsumo.PIGMENTO,
            porcentaje: new Prisma.Decimal(pct),
            gramosCalculados: new Prisma.Decimal(gramos),
          },
        });
        aditivosCreados++;
      }

      await prisma.pedidoComercial.update({
        where: { id: p.id },
        data: { colorText: colorVal },
      });
    }
  }

  console.log(`✅ Backfill finalizado: ${clientesCreados} clientes vinculados, ${aditivosCreados} aditivos generados.`);
}

backfill()
  .catch((e) => {
    console.error('Error en backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
