import { PrismaClient, UnidadMedida, EstadoGenerico } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial chemical inventory data...');

  // Create families
  const solventes = await prisma.familiaInsumo.upsert({
    where: { nombre: 'Solventes y Alcoholes' },
    update: {},
    create: { nombre: 'Solventes y Alcoholes', descripcion: 'Solventes industriales y alcoholes puros' },
  });

  const acidos = await prisma.familiaInsumo.upsert({
    where: { nombre: 'Ácidos y Álcalis' },
    update: {},
    create: { nombre: 'Ácidos y Álcalis', descripcion: 'Reactivos corrosivos e hidróxidos' },
  });

  const polimeros = await prisma.familiaInsumo.upsert({
    where: { nombre: 'Polímeros y Resinas' },
    update: {},
    create: { nombre: 'Polímeros y Resinas', descripcion: 'Resinas sintéticas y aglutinantes' },
  });

  const aditivos = await prisma.familiaInsumo.upsert({
    where: { nombre: 'Aditivos y Surfactantes' },
    update: {},
    create: { nombre: 'Aditivos y Surfactantes', descripcion: 'Tensioactivos, espumantes y conservantes' },
  });

  // Create Insumos
  const insumosData = [
    {
      codigo: 'INS-001',
      nombre: 'Soda Cautica 50% (NaOH)',
      familiaId: acidos.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 4500,
      stockReal: 1200, // Critical alert! (stockMinimo 2500)
      stockMinimo: 2500,
      costoUnitario: 4.80,
    },
    {
      codigo: 'INS-002',
      nombre: 'Formaldehído 37%',
      familiaId: acidos.id,
      unidadMedida: UnidadMedida.L,
      stockTeorico: 3000,
      stockReal: 850, // Critical alert! (stockMinimo 1500)
      stockMinimo: 1500,
      costoUnitario: 6.20,
    },
    {
      codigo: 'INS-003',
      nombre: 'Alcohol Isopropílico 99.9%',
      familiaId: solventes.id,
      unidadMedida: UnidadMedida.L,
      stockTeorico: 12000,
      stockReal: 14500,
      stockMinimo: 4000,
      costoUnitario: 8.50,
    },
    {
      codigo: 'INS-004',
      nombre: 'Ácido Sulfórico 98%',
      familiaId: acidos.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 8000,
      stockReal: 7200,
      stockMinimo: 3000,
      costoUnitario: 3.90,
    },
    {
      codigo: 'INS-005',
      nombre: 'Resina Poliéster Ortoftálica',
      familiaId: polimeros.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 18000,
      stockReal: 16800,
      stockMinimo: 5000,
      costoUnitario: 12.40,
    },
    {
      codigo: 'INS-006',
      nombre: 'Lauril Éter Sulfato de Sodio (LESS 70%)',
      familiaId: aditivos.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 9500,
      stockReal: 8900,
      stockMinimo: 2000,
      costoUnitario: 7.10,
    },
    {
      codigo: 'INS-007',
      nombre: 'Glicerina USP 99.5%',
      familiaId: solventes.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 6000,
      stockReal: 5200,
      stockMinimo: 1800,
      costoUnitario: 9.80,
    },
    {
      codigo: 'INS-008',
      nombre: 'Dióxido de Titanio Rutilo',
      familiaId: aditivos.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 3500,
      stockReal: 600, // Critical alert! (stockMinimo 1000)
      stockMinimo: 1000,
      costoUnitario: 18.50,
    },
  ];

  for (const item of insumosData) {
    await prisma.insumo.upsert({
      where: { codigo: item.codigo },
      update: item,
      create: item,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
