import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Iniciando sincronización de Color y Fragancia en Órdenes de Producción...');

  const ordenes = await prisma.ordenProduccion.findMany({
    include: {
      formula: true,
    },
  });

  const pedidos = await (prisma as any).pedidoComercial.findMany({
    include: {
      aditivos: {
        include: { insumo: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log(`📦 Órdenes encontradas: ${ordenes.length}, Pedidos encontrados: ${pedidos.length}`);

  let updatedCount = 0;

  for (const orden of ordenes) {
    const numPart = orden.codigoLote.replace(/\D/g, '');

    const matchingPedido = pedidos.find((p: any) => {
      const pNum = (p.codigoOrden || '').replace(/\D/g, '');
      if (numPart && pNum && (numPart.includes(pNum) || pNum.includes(numPart))) return true;
      return p.clienteNombre === orden.clienteNombre && p.formulaId === orden.formulaId;
    });

    let newColor = orden.colorEspecificado;
    let newFragancia = orden.fraganciaEspecificada;

    if (matchingPedido) {
      const fragAdit = matchingPedido.aditivos?.find(
        (a: any) => a.tipo === 'FRAGANCIA' || a.insumo?.tipo === 'FRAGANCIA' || a.insumo?.nombre?.toLowerCase().includes('fragancia')
      );
      const pigmAdit = matchingPedido.aditivos?.find(
        (a: any) => a.tipo === 'PIGMENTO' || a.insumo?.tipo === 'PIGMENTO' || a.insumo?.nombre?.toLowerCase().includes('pigmento')
      );

      if (!newColor || newColor === 'TRANSPARENTE' || newColor === 'SIN COLOR') {
        newColor = matchingPedido.colorText || matchingPedido.color || pigmAdit?.insumo?.nombre || 'TRANSPARENTE';
      }
      if (!newFragancia || newFragancia === 'SIN FRAGANCIA' || newFragancia === 'SIN AROMA') {
        newFragancia = matchingPedido.aromaText || matchingPedido.aroma || fragAdit?.insumo?.nombre || 'SIN FRAGANCIA';
      }
    }

    if (!newColor) newColor = 'Azul Turquesa Industrial';
    if (!newFragancia) newFragancia = 'Fragancia Lavanda Francesa';

    if (newColor !== orden.colorEspecificado || newFragancia !== orden.fraganciaEspecificada) {
      await prisma.ordenProduccion.update({
        where: { id: orden.id },
        data: {
          colorEspecificado: newColor,
          fraganciaEspecificada: newFragancia,
        },
      });
      console.log(`✅ Lote ${orden.codigoLote} actualizado -> Color: ${newColor} | Fragancia: ${newFragancia}`);
      updatedCount++;
    }
  }

  console.log(`✨ Sincronización completada. ${updatedCount} órdenes actualizadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
