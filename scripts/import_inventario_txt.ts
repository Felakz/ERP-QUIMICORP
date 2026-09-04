import { PrismaClient, UnidadMedida, TipoInsumo, EstadoGenerico, TipoMovimiento, CategoriaKardex } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const TXT_PATH = process.env.TXT_PATH || path.resolve(__dirname, '..', 'INVENTARIO_FISICO_MANUAL_02_09_2026.txt');
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('-d');

interface ParsedItem {
  nombre: string;
  stock: number;          // en gramos para masa, en ml para volumétricos
  unidadMedida: UnidadMedida;
  tipoFisico: string;
  familiaId: string;
  tipo: TipoInsumo;
}

const FAMILIAS = {
  FRAGANCIAS_Y_ACEITES: '074d0183-07b8-4990-8831-099afe6e58e7',
  MATERIAS_PRIMAS_FORMULACION: 'e7ad66ee-0383-41bb-b71e-6c7a98a72b8e',
  MATERIA_PRIMA_BASE: '4fe85d88-3899-4cf2-b739-972e941f3379',
  PIGMENTOS_Y_COLORANTES: 'c3b864c3-585c-403e-b7b7-b0392e7d7b46',
  ADITIVOS_Y_AUXILIARES: '762b11c4-ec62-4e9a-862a-57edcb227583',
};

const VOLUMETRICOS_ML: Record<string, number> = {
  'ALCOHOL EXTRA NEUTRO 96%': 200000,
  'ALCOHOL ISOPROPILICO': 60903,
  'BENCINA': 31528,
  'VARSOL': 25860,
};

function normalizeNombre(n: string): string {
  return n
    .replace(/[ÁÉÍÓÚÑ]/g, c => ({ Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ñ: 'N' }[c] || c))
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTXT(filePath: string): ParsedItem[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const items: Map<string, { nombreOriginal: string; stock: number; unidadMedida: UnidadMedida; tipoFisico: string }> = new Map();
  let currentSection = '';

  for (const line of lines) {
    if (line.includes('LISTA 2') || line.includes('CONTEO ADICIONAL')) currentSection = 'L2';
    else if (line.includes('LISTA 3') || line.includes('ESTANTES')) currentSection = 'L3';
    else if (line.includes('LISTA 4') || line.includes('COLORANTES')) currentSection = 'L4';
    else if (line.includes('EXCLUIDOS') || line.includes('REGISTRO TOTAL')) currentSection = 'EXCLUIDOS';

    if (currentSection === 'EXCLUIDOS') continue;

    const match = line.match(/^\s*(?:EXTRA|\d{1,4}|COL\d{2})\s*\|\s*([^|]+?)\s*\|\s*([\d.,]+)\s*(L|g)?\s*\|\s*([^|]+?)\s*\|/);
    if (!match) continue;

    const [, nombreRaw, stockRaw, unidadRaw, tipoFisicoRaw] = match;
    const nombre = nombreRaw.trim();
    const stockStr = stockRaw.replace(/,/g, '');
    const stock = parseFloat(stockStr);
    if (isNaN(stock)) continue;

    const tipoFisico = tipoFisicoRaw.trim().toUpperCase();
    const key = normalizeNombre(nombre);

    const esVolumetrico = Object.keys(VOLUMETRICOS_ML).some(v => normalizeNombre(v) === key);
    let stockFinal = stock;
    let unidadMedida: UnidadMedida = UnidadMedida.GR;

    if (esVolumetrico) {
      stockFinal = VOLUMETRICOS_ML[Object.keys(VOLUMETRICOS_ML).find(v => normalizeNombre(v) === key)!];
      unidadMedida = UnidadMedida.ML;
    } else if (unidadRaw && unidadRaw.toUpperCase() === 'L') {
      unidadMedida = UnidadMedida.ML;
      stockFinal = stock * 1000;
    }

    if (items.has(key)) {
      const existing = items.get(key)!;
      existing.stock += stockFinal;
    } else {
      items.set(key, { nombreOriginal: nombre, stock: stockFinal, unidadMedida, tipoFisico });
    }
  }

  const result: ParsedItem[] = [];
  let idx = 1;
  for (const [key, data] of items) {
    const { nombreOriginal, stock, unidadMedida, tipoFisico } = data;

    let familiaId = FAMILIAS.MATERIAS_PRIMAS_FORMULACION;
    let tipo = TipoInsumo.BASE;

    const tf = tipoFisico;
    const nombreUpper = key;

    if (tf.includes('FRAGANCIA') || tf.includes('ACEITE ESENCIAL') || tf.includes('ESENCIA') || nombreUpper.startsWith('FRAG.')) {
      familiaId = FAMILIAS.FRAGANCIAS_Y_ACEITES;
      tipo = TipoInsumo.FRAGANCIA;
    } else if (tf.includes('COLORANTE') || tf.includes('PIGMENTO') || nombreUpper.startsWith('COL')) {
      familiaId = FAMILIAS.PIGMENTOS_Y_COLORANTES;
      tipo = TipoInsumo.PIGMENTO;
    } else if (
      tf.includes('EXTRACTO') ||
      ['EDTA', 'SORBATO', 'BENZOATO', 'CONSERVANTE', 'POLISORBATO', 'PROCIDE', 'SACARINA'].some(t => nombreUpper.includes(t))
    ) {
      familiaId = FAMILIAS.ADITIVOS_Y_AUXILIARES;
      tipo = TipoInsumo.OTRO;
    } else if (['GLICERINA', 'PROPILENGLICOL', 'BETAINA', 'CARBOPOL', 'TEXAPON'].some(t => nombreUpper.includes(t))) {
      familiaId = FAMILIAS.MATERIA_PRIMA_BASE;
      tipo = TipoInsumo.BASE;
    }

    result.push({
      nombre: nombreOriginal,
      stock,
      unidadMedida,
      tipoFisico: tf.replace(/\([^)]*\)/g, '').trim(),
      familiaId,
      tipo,
    });
    idx++;
  }

  return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

async function main() {
  console.log('📥 Importador de Inventario TXT QUIMICORP');
  console.log('==========================================\n');
  console.log(`Archivo: ${TXT_PATH}`);
  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN (sin insertar)' : 'APLICAR'}\n`);

  const items = parseTXT(TXT_PATH);
  console.log(`Productos únicos a importar: ${items.length}\n`);

  console.log('Distribución por familia:');
  const porFamilia = new Map<string, number>();
  for (const item of items) {
    const fam = Object.entries(FAMILIAS).find(([, v]) => v === item.familiaId)?.[0] || 'DESCONOCIDA';
    porFamilia.set(fam, (porFamilia.get(fam) || 0) + 1);
  }
  for (const [fam, cnt] of porFamilia) console.log(`  ${fam}: ${cnt}`);

  console.log('\nDistribución por unidad:');
  const porUnidad = new Map<string, number>();
  for (const item of items) porUnidad.set(item.unidadMedida, (porUnidad.get(item.unidadMedida) || 0) + 1);
  for (const [uni, cnt] of porUnidad) console.log(`  ${uni}: ${cnt}`);

  console.log('\nDistribución por tipo:');
  const porTipo = new Map<string, number>();
  for (const item of items) porTipo.set(item.tipo, (porTipo.get(item.tipo) || 0) + 1);
  for (const [tip, cnt] of porTipo) console.log(`  ${tip}: ${cnt}`);

  console.log('\n--- Muestra de items (primeros 10) ---');
  for (const item of items.slice(0, 10)) {
    console.log(`  ${item.nombre.padEnd(40)} | ${item.stock.toLocaleString().padStart(8)} ${item.unidadMedida} | ${item.tipoFisico.padEnd(18)} | ${item.tipo}`);
  }

  if (DRY_RUN) {
    console.log('\n✅ DRY-RUN completado. No se insertó nada en la BD.');
    return;
  }

  console.log('\n🔄 Insertando en la base de datos...');

  const adminUser = await prisma.usuario.findFirst();
  const adminUserId = adminUser?.id ?? null;

  for (const item of items) {
    const codigo = `MP-${String(items.indexOf(item) + 1).padStart(4, '0')}`;
    const insumo = await prisma.insumo.create({
      data: {
        codigo,
        nombre: item.nombre,
        familiaId: item.familiaId,
        unidadMedida: item.unidadMedida,
        stockTeorico: item.stock,
        stockReal: item.stock,
        stockMinimo: 0,
        costoUnitario: 0,
        estado: EstadoGenerico.ACTIVO,
        tipo: item.tipo,
        estadoFisico: item.tipoFisico,
      },
    });

    await prisma.kardexMovimiento.create({
      data: {
        categoriaKardex: CategoriaKardex.MATERIA_PRIMA,
        productoNombre: insumo.nombre,
        familia: item.familiaId,
        categoriaNombre: 'Inventario Inicial TXT 02/09/2026',
        proveedorCliente: 'INVENTARIO_FISICO',
        unidadMedida: insumo.unidadMedida,
        tipoDoc: 'INVENTARIO',
        serie: 'INV2026',
        numero: `INV-${codigo}`,
        tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
        cantidadEntrada: item.stock,
        cantidadSalida: 0,
        saldoFinal: item.stock,
        insumoId: insumo.id,
        usuarioId: adminUserId ?? undefined,
      },
    });
  }

  console.log(`\n✅ ${items.length} insumos importados con éxito.`);
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });