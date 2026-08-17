import { PrismaClient, UnidadMedida, TipoInsumo } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 INICIANDO INYECCIÓN ETL: SOLO HOJA "INSUMOS PRODUCCION"');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 0. Lectura Segura del Archivo
  const excelPath = path.resolve(__dirname, '../../../INVENTARIO QUIMICORP FINAL 2026.xlsx');
  const workbook = xlsx.readFile(excelPath);
  const sheetName = 'INSUMOS PRODUCCION';
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`❌ No se encontró la hoja "${sheetName}" en el archivo Excel.`);
  }

  // Tomamos a partir de la fila 2 (índice 1) para las cabeceras reales
  const rawRows = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  const headerRow = rawRows[1] || [];
  const dataRows = rawRows.slice(2);

  console.log(`📄 Hoja "${sheetName}" leída.`);
  console.log(`   Encabezados detectados:`, headerRow.filter(Boolean));
  console.log(`   Filas en bruto detectadas: ${dataRows.length}`);

  // Asegurar las 4 familias maestras requeridas
  const familiasConfig = [
    { nombre: 'MATERIA_PRIMA_BASE', descripcion: 'Materia Prima Base e Insumos Principales' },
    { nombre: 'FRAGANCIAS_Y_ACEITES', descripcion: 'Fragancias, Esencias y Aceites Esenciales' },
    { nombre: 'PIGMENTOS_Y_COLORANTES', descripcion: 'Pigmentos, Colorantes y Anilinas' },
    { nombre: 'ADITIVOS_Y_AUXILIARES', descripcion: 'Extractos, Saborizantes y Aditivos Auxiliares' },
  ];

  const familiaMap = new Map<string, string>();
  for (const fam of familiasConfig) {
    const record = await prisma.familiaInsumo.upsert({
      where: { nombre: fam.nombre },
      update: { descripcion: fam.descripcion },
      create: { nombre: fam.nombre, descripcion: fam.descripcion },
    });
    familiaMap.set(fam.nombre, record.id);
  }

  const insumosParaInsertar: any[] = [];
  let contadorCorrelativo = 1;

  for (const row of dataRows) {
    const productoRaw = row[1];
    // Filtro de Basura: Ignorar si PRODUCTO es nulo o vacío
    if (!productoRaw || String(productoRaw).trim() === '') {
      continue;
    }

    const nombreProducto = String(productoRaw).trim().toUpperCase();
    const categoriaRaw = String(row[2] || '').trim().toUpperCase();
    const proveedorActual = row[4] ? String(row[4]).trim().toUpperCase() : null;

    // 1. La Maña de las Unidades (Regla de Oro Matemático)
    let unidadStr = String(row[6] || '').trim().toUpperCase();
    if (!unidadStr) {
      unidadStr = 'GR';
    }

    const rawPeso = row[5];
    let pesoNum = typeof rawPeso === 'number' ? rawPeso : parseFloat(String(rawPeso));
    if (isNaN(pesoNum) || pesoNum < 0) {
      pesoNum = 0;
    }

    let stockCalculado = 0;
    let unidadVisual = 'GR';
    let enumUnidad: UnidadMedida = UnidadMedida.GR;

    if (unidadStr === 'KG') {
      stockCalculado = pesoNum * 1000;
      unidadVisual = 'KG';
      enumUnidad = UnidadMedida.KG;
    } else if (unidadStr === 'LT' || unidadStr === 'L') {
      stockCalculado = pesoNum * 1000;
      unidadVisual = 'LT';
      enumUnidad = UnidadMedida.L;
    } else {
      // Por defecto o si es 'GR'
      stockCalculado = pesoNum;
      unidadVisual = 'GR';
      enumUnidad = UnidadMedida.GR;
    }

    // 2. La Maña de las Categorías Ocultas
    let categoriaFinal = 'MATERIA_PRIMA_BASE';
    let tipoFinal: TipoInsumo = TipoInsumo.BASE;

    if (categoriaRaw.includes('ACEITE') || categoriaRaw.includes('FRAGANCIA')) {
      categoriaFinal = 'FRAGANCIAS_Y_ACEITES';
      tipoFinal = TipoInsumo.FRAGANCIA;
    } else if (categoriaRaw.includes('COLORANTE')) {
      categoriaFinal = 'PIGMENTOS_Y_COLORANTES';
      tipoFinal = TipoInsumo.PIGMENTO;
    } else if (categoriaRaw.includes('EXTRACTO') || categoriaRaw.includes('SABORIZANTE')) {
      categoriaFinal = 'ADITIVOS_Y_AUXILIARES';
      tipoFinal = TipoInsumo.OTRO;
    } else {
      // Insumos generales o null/vacío
      categoriaFinal = 'MATERIA_PRIMA_BASE';
      tipoFinal = TipoInsumo.BASE;
    }

    // 3. El Proveedor Histórico
    const proveedorHistorico = proveedorActual;

    // 4. Generación de Código SKU
    const codigoSKU = `INS-${String(contadorCorrelativo).padStart(3, '0')}`;
    contadorCorrelativo++;

    const familiaId = familiaMap.get(categoriaFinal)!;

    insumosParaInsertar.push({
      codigo: codigoSKU,
      nombre: nombreProducto,
      familiaId: familiaId,
      categoria: categoriaFinal,
      unidadMedida: enumUnidad,
      unidadMedidaVisual: unidadVisual,
      proveedorHistorico: proveedorHistorico,
      stockReal: stockCalculado,
      stockTeorico: stockCalculado,
      stockMinimo: 10,
      costoUnitario: 0,
      tipo: tipoFinal,
    });
  }

  console.log(`📦 Preparados ${insumosParaInsertar.length} insumos listos para inserción masiva.`);

  // Inserción en Prisma
  const insertResult = await prisma.insumo.createMany({
    data: insumosParaInsertar,
    skipDuplicates: true,
  });

  console.log(`\n✅ Se insertaron ${insertResult.count} insumos correctamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en ejecución:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
