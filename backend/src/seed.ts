import { PrismaClient, UnidadMedida, EstadoGenerico, CategoriaKardex, TipoMovimiento } from '@prisma/client';

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
      nombre: 'Soda Cáustica 50% (NaOH)',
      familiaId: acidos.id,
      unidadMedida: UnidadMedida.KG,
      stockTeorico: 4500,
      stockReal: 1200,
      stockMinimo: 2500,
      costoUnitario: 4.80,
    },
    {
      codigo: 'INS-002',
      nombre: 'Formaldehído 37%',
      familiaId: acidos.id,
      unidadMedida: UnidadMedida.L,
      stockTeorico: 3000,
      stockReal: 850,
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
      nombre: 'Ácido Sulfúrico 98%',
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
      stockReal: 600,
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

  // Seed KardexMovimiento (5 Categorías estandarizadas Quimicorp)
  console.log('Seeding Kardex Categorizado movimientos...');
  await prisma.kardexMovimiento.deleteMany({});

  const kardexSeedData = [
    // 1. PRODUCTO TERMINADO
    {
      categoriaKardex: CategoriaKardex.PRODUCTO_TERMINADO,
      productoNombre: 'Detergente Industrial Quimicorp-40',
      familia: 'Detergentes Industriales',
      categoriaNombre: 'Limpieza Industrial',
      proveedorCliente: 'Químicos del Sur S.A.',
      unidadMedida: 'KG',
      fecha: new Date('2024-08-01T09:30:00Z'),
      tipoDoc: 'OP',
      serie: 'LOTE',
      numero: 'LOTE-000041',
      otp: 'OTP-2024-0891',
      tipoOperacion: TipoMovimiento.ENTRADA_PRODUCCION,
      cantidadEntrada: 1200.0,
      cantidadSalida: 0.0,
      saldoFinal: 1200.0,
    },
    {
      categoriaKardex: CategoriaKardex.PRODUCTO_TERMINADO,
      productoNombre: 'Resina Poliéster Ortoftálica R-10',
      familia: 'Polímeros & Resinas',
      categoriaNombre: 'Resinas Sintéticas',
      proveedorCliente: 'Industria Plástica SAC',
      unidadMedida: 'KG',
      fecha: new Date('2024-07-31T14:20:00Z'),
      tipoDoc: 'FT',
      serie: 'F001',
      numero: '000412',
      otp: 'OTP-2024-0885',
      tipoOperacion: TipoMovimiento.SALIDA_VENTA,
      cantidadEntrada: 0.0,
      cantidadSalida: 500.0,
      saldoFinal: 1800.0,
    },

    // 2. MATERIA PRIMA
    {
      categoriaKardex: CategoriaKardex.MATERIA_PRIMA,
      productoNombre: 'Soda Cáustica 50% (NaOH)',
      familia: 'Ácidos y Álcalis',
      categoriaNombre: 'Reactivos Base',
      proveedorCliente: 'Soluciones Químicas del Perú S.A.',
      unidadMedida: 'KG',
      fecha: new Date('2024-08-01T08:15:00Z'),
      tipoDoc: 'GR',
      serie: 'T001',
      numero: '001928',
      otp: 'OTP-2024-0890',
      tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
      cantidadEntrada: 2500.0,
      cantidadSalida: 0.0,
      saldoFinal: 3700.0,
    },
    {
      categoriaKardex: CategoriaKardex.MATERIA_PRIMA,
      productoNombre: 'Ácido Sulfúrico 98%',
      familia: 'Ácidos y Álcalis',
      categoriaNombre: 'Ácidos Industriales',
      proveedorCliente: 'Consumo Interno - LOTE-000041',
      unidadMedida: 'KG',
      fecha: new Date('2024-07-31T11:00:00Z'),
      tipoDoc: 'OP',
      serie: 'LOTE',
      numero: 'LOTE-000041',
      otp: 'OTP-2024-0891',
      tipoOperacion: TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
      cantidadEntrada: 0.0,
      cantidadSalida: 800.0,
      saldoFinal: 6400.0,
    },

    // 3. INSUMOS
    {
      categoriaKardex: CategoriaKardex.INSUMO,
      productoNombre: 'Lauril Éter Sulfato de Sodio (LESS 70%)',
      familia: 'Aditivos y Surfactantes',
      categoriaNombre: 'Surfactantes Aniónicos',
      proveedorCliente: 'Importaciones Químicas S.A.C.',
      unidadMedida: 'KG',
      fecha: new Date('2024-08-01T07:45:00Z'),
      tipoDoc: 'GR',
      serie: 'T002',
      numero: '003110',
      otp: 'OTP-2024-0888',
      tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
      cantidadEntrada: 1500.0,
      cantidadSalida: 0.0,
      saldoFinal: 8900.0,
    },

    // 4. ENVASES
    {
      categoriaKardex: CategoriaKardex.ENVASE,
      productoNombre: 'Bidón PEAD 5 Galones Azules',
      familia: 'Plásticos & Contenedores',
      categoriaNombre: 'Envases Rígidos',
      proveedorCliente: 'Envases Industriales del Pacífico',
      unidadMedida: 'UNID',
      fecha: new Date('2024-07-30T16:00:00Z'),
      tipoDoc: 'GR',
      serie: 'E001',
      numero: '008920',
      otp: 'OTP-2024-0870',
      tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
      cantidadEntrada: 500.0,
      cantidadSalida: 0.0,
      saldoFinal: 1250.0,
    },
    {
      categoriaKardex: CategoriaKardex.ENVASE,
      productoNombre: 'Bidón PEAD 5 Galones Azules',
      familia: 'Plásticos & Contenedores',
      categoriaNombre: 'Envases Rígidos',
      proveedorCliente: 'Consumo Envasado - LOTE-000041',
      unidadMedida: 'UNID',
      fecha: new Date('2024-08-01T10:00:00Z'),
      tipoDoc: 'OP',
      serie: 'LOTE',
      numero: 'LOTE-000041',
      otp: 'OTP-2024-0891',
      tipoOperacion: TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
      cantidadEntrada: 0.0,
      cantidadSalida: 240.0,
      saldoFinal: 1010.0,
    },

    // 5. EMBALAJES
    {
      categoriaKardex: CategoriaKardex.EMBALAJE,
      productoNombre: 'Parihuela de Madera Estándar (1.2m x 1.0m)',
      familia: 'Maderas & Pallets',
      categoriaNombre: 'Embalaje Pesado',
      proveedorCliente: 'Maderera y Embalajes del Sur',
      unidadMedida: 'UNID',
      fecha: new Date('2024-07-29T09:00:00Z'),
      tipoDoc: 'GR',
      serie: 'M001',
      numero: '001200',
      otp: 'OTP-2024-0865',
      tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
      cantidadEntrada: 100.0,
      cantidadSalida: 0.0,
      saldoFinal: 350.0,
    },
  ];

  for (const km of kardexSeedData) {
    await prisma.kardexMovimiento.create({ data: km });
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
