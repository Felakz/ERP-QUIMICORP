import { PrismaClient, TipoInsumo, UnidadMedida, EstadoGenerico } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Semillando Familias e Insumos Aditivos (Fragancias & Pigmentos)...');

  // 1. Asegurar familias
  const famFragancias = await prisma.familiaInsumo.upsert({
    where: { nombre: 'Fragancias y Esencias' },
    update: {},
    create: {
      nombre: 'Fragancias y Esencias',
      descripcion: 'Esencias aromáticas industriales grado cosmético y hogar',
    },
  });

  const famPigmentos = await prisma.familiaInsumo.upsert({
    where: { nombre: 'Pigmentos y Colorantes' },
    update: {},
    create: {
      nombre: 'Pigmentos y Colorantes',
      descripcion: 'Colorantes y pigmentos líquidos y polvos grado cosmético',
    },
  });

  // 2. Lista de Fragancias
  const fragancias = [
    { codigo: 'AD-FRAG-001', nombre: 'Fragancia Lavanda Francesa', costo: 65.0 },
    { codigo: 'AD-FRAG-002', nombre: 'Fragancia Cítrico Herbal', costo: 58.0 },
    { codigo: 'AD-FRAG-003', nombre: 'Fragancia Frutos Rojos / Berries', costo: 62.0 },
    { codigo: 'AD-FRAG-004', nombre: 'Fragancia Menta Glacial & Eucalipto', costo: 70.0 },
    { codigo: 'AD-FRAG-005', nombre: 'Fragancia Vainilla Dulce Bourbon', costo: 60.0 },
    { codigo: 'AD-FRAG-006', nombre: 'Fragancia Coco Tropical & Almendras', costo: 64.0 },
    { codigo: 'AD-FRAG-007', nombre: 'Fragancia Floral Jazmín & Rosas', costo: 68.0 },
    { codigo: 'AD-FRAG-008', nombre: 'Fragancia Manzanilla & Avena', costo: 55.0 },
    { codigo: 'AD-FRAG-009', nombre: 'Fragancia Aloe Vera & Té Verde', costo: 59.0 },
    { codigo: 'AD-FRAG-010', nombre: 'Fragancia Aqua Marina Fresh', costo: 63.0 },
  ];

  for (const f of fragancias) {
    await prisma.insumo.upsert({
      where: { codigo: f.codigo },
      update: {
        tipo: TipoInsumo.FRAGANCIA,
        nombre: f.nombre,
        familiaId: famFragancias.id,
      },
      create: {
        codigo: f.codigo,
        nombre: f.nombre,
        familiaId: famFragancias.id,
        unidadMedida: UnidadMedida.KG,
        tipo: TipoInsumo.FRAGANCIA,
        stockTeorico: 150.0,
        stockReal: 150.0,
        stockMinimo: 20.0,
        costoUnitario: f.costo,
        estado: EstadoGenerico.ACTIVO,
      },
    });
  }

  // 3. Lista de Pigmentos
  const pigmentos = [
    { codigo: 'AD-PIGM-001', nombre: 'Pigmento Azul Ultramar Líquido', costo: 42.0 },
    { codigo: 'AD-PIGM-002', nombre: 'Pigmento Verde Esmeralda', costo: 45.0 },
    { codigo: 'AD-PIGM-003', nombre: 'Pigmento Rosa Neón / Magenta', costo: 48.0 },
    { codigo: 'AD-PIGM-004', nombre: 'Pigmento Amarillo Sol / Tartrazina', costo: 38.0 },
    { codigo: 'AD-PIGM-005', nombre: 'Pigmento Violeta Amatista', costo: 46.0 },
    { codigo: 'AD-PIGM-006', nombre: 'Pigmento Naranja Intenso', costo: 40.0 },
    { codigo: 'AD-PIGM-007', nombre: 'Pigmento Blanco Dióxido Opacificante', costo: 35.0 },
    { codigo: 'AD-PIGM-008', nombre: 'Pigmento Rojo Carmín Rubí', costo: 50.0 },
    { codigo: 'AD-PIGM-009', nombre: 'Pigmento Turquesa Glaciar', costo: 44.0 },
    { codigo: 'AD-PIGM-010', nombre: 'Pigmento Ámbar Dorado / Caramelo', costo: 39.0 },
  ];

  for (const p of pigmentos) {
    await prisma.insumo.upsert({
      where: { codigo: p.codigo },
      update: {
        tipo: TipoInsumo.PIGMENTO,
        nombre: p.nombre,
        familiaId: famPigmentos.id,
      },
      create: {
        codigo: p.codigo,
        nombre: p.nombre,
        familiaId: famPigmentos.id,
        unidadMedida: UnidadMedida.KG,
        tipo: TipoInsumo.PIGMENTO,
        stockTeorico: 200.0,
        stockReal: 200.0,
        stockMinimo: 25.0,
        costoUnitario: p.costo,
        estado: EstadoGenerico.ACTIVO,
      },
    });
  }

  console.log(`✅ ${fragancias.length} Fragancias y ${pigmentos.length} Pigmentos semillados exitosamente.`);
}

main()
  .catch((e) => {
    console.error('Error semillando aditivos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
