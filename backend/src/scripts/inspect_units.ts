import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pedidos = await prisma.pedidoComercial.findMany({
    take: 5,
    select: {
      id: true,
      codigoOrden: true,
      productoNombre: true,
      cantidadSolicitada: true,
      unidadMedida: true,
      lotesRequeridos: true,
      clienteNombre: true,
      clienteRuc: true,
      montoTotal: true,
    }
  });
  console.log('PEDIDOS:', JSON.stringify(pedidos, null, 2));

  const cuentas = await prisma.cuentaCobrar.findMany({
    take: 20,
    select: {
      codigoDoc: true,
      ordenProd: true,
      producto: true,
      montoTotal: true,
      clienteNombre: true,
    }
  });
  console.log('CUENTAS COBRAR:', JSON.stringify(cuentas, null, 2));


  // Let's inspect formulas to see if formulas have default unit of measure
  const formulasSample = await prisma.formulaMaster.findMany({
    take: 5,
    select: {
      codigoFormula: true,
      nombreProducto: true,
      densidadTeorica: true,
    }
  });
  console.log('FORMULAS:', JSON.stringify(formulasSample, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

