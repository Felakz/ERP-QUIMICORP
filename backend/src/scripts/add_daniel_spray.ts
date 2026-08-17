import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addDaniel() {
  const master = await prisma.formulaMaster.findFirst({
    where: { nombreProducto: { contains: 'SPRAY DE OIDOS' } },
  });

  const daniel = await prisma.cliente.findFirst({ where: { razonSocial: { contains: 'DANIEL' } } });

  if (master && daniel) {
    const ya = await prisma.formulaVariant.findFirst({
      where: { formulaId: master.id, clienteId: daniel.id },
    });
    if (!ya) {
      await prisma.formulaVariant.create({
        data: {
          formulaId: master.id,
          clienteId: daniel.id,
          nombre: 'SPRAY DE OIDOS - TRINNIDROP',
          notas: '5 insumos específicos',
          ajustesJson: [
            { sku: 'QC-LIQ-001', componente: 'PEROXIDO DE HIDROGENO', porcentaje: 2.91, pesoTeorico: 30.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-002', componente: 'AGUA DESIONIZADA', porcentaje: 93.95, pesoTeorico: 970.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-003', componente: 'GLICERINA', porcentaje: 2.91, pesoTeorico: 30.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-004', componente: 'CLORURO DE BENZALCONIO', porcentaje: 0.19, pesoTeorico: 2.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-005', componente: 'ACIDO LACTICO', porcentaje: 0.05, pesoTeorico: 0.5, tipo: 'BASE' },
          ],
        },
      });
      console.log('✅ Variante de Daniel Espinoza agregada con sus 5 insumos.');
    }
  }

  const spray = await prisma.formulaMaster.findFirst({
    where: { nombreProducto: { contains: 'SPRAY DE OIDOS' } },
    include: { variants: { include: { cliente: true } } },
  });

  console.log('\n--- VARIANTES EN SPRAY DE OIDOS ---');
  spray?.variants.forEach(v => {
    console.log(`  • [${v.cliente?.razonSocial}] "${v.nombre}" -> ${Array.isArray(v.ajustesJson) ? v.ajustesJson.length : 0} insumos`);
  });
}

addDaniel().finally(() => prisma.$disconnect());
