import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const formulas = await prisma.formulaMaster.findMany({
    include: {
      detalles: {
        include: { insumo: true },
      },
      variants: {
        include: { cliente: true },
      },
    },
  });

  console.log(`Total FormulaMaster en BD: ${formulas.length}`);
  for (const f of formulas.slice(0, 5)) {
    console.log(`- [${f.codigoFormula}] "${f.nombreProducto}" -> ${f.detalles.length} ingredientes, ${f.variants.length} variantes`);
  }

  const totalDetalles = await prisma.formulaDetalle.count();
  console.log(`\nTotal FormulaDetalle en BD: ${totalDetalles}`);
}

main().finally(() => prisma.$disconnect());
