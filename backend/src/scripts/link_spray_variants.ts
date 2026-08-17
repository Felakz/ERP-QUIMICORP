import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSpray() {
  const master = await prisma.formulaMaster.findFirst({
    where: { nombreProducto: { contains: 'SPRAY DE OIDOS' } },
    include: { variants: { include: { cliente: true } } },
  });

  console.log('Master:', master?.codigoFormula, master?.nombreProducto);
  console.log('Variants:', master?.variants.map(v => ({ id: v.id, cliente: v.cliente?.razonSocial, nombre: v.nombre })));

  // Buscar si existe cliente David Sarmiento
  const david = await prisma.cliente.findFirst({ where: { razonSocial: { contains: 'DAVID' } } });
  console.log('Cliente David:', david?.razonSocial);

  // Agregar la variante de David Sarmiento si no está
  if (master && david) {
    const yaExiste = master.variants.some(v => v.clienteId === david.id);
    if (!yaExiste) {
      console.log('Agregando variante de David Sarmiento a SPRAY DE OIDOS...');
      await prisma.formulaVariant.create({
        data: {
          formulaId: master.id,
          clienteId: david.id,
          nombre: 'SPRAY DE OIDOS',
          notas: '4 insumos específicos',
          ajustesJson: [
            { sku: 'QC-LIQ-001', componente: 'PEROXIDO DE HIDROGENO', porcentaje: 6.0, pesoTeorico: 60.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-002', componente: 'AGUA DESIONIZADA', porcentaje: 83.5, pesoTeorico: 835.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-003', componente: 'GLICERINA', porcentaje: 10.0, pesoTeorico: 100.0, tipo: 'BASE' },
            { sku: 'QC-LIQ-004', componente: 'CLORURO DE BENZALCONIO', porcentaje: 0.5, pesoTeorico: 5.0, tipo: 'BASE' },
          ],
        },
      });
      console.log('✅ Variante de David Sarmiento agregada con sus 4 insumos limpios.');
    }
  }
}

checkSpray().finally(() => prisma.$disconnect());
