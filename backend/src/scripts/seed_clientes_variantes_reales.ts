import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📑 IMPORTACIÓN OFICIAL DE CLIENTES REALES Y VARIANTES DESDE EXCEL');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const excelPath = path.resolve(__dirname, '../../../FORMULACIONES CLIENTES- DARIO.xlsx');
  const workbook = xlsx.readFile(excelPath);

  // 1. Limpiar variantes anteriores
  console.log('1. Limpiando variantes anteriores...');
  await prisma.formulaVariant.deleteMany({});

  // 2. Cachear todas las Fórmulas Maestras existentes en BD
  const formulasMaster = await prisma.formulaMaster.findMany();
  console.log(`   🔬 Fórmulas Maestras disponibles en BD: ${formulasMaster.length}`);

  // Normalizador para búsqueda de mejor coincidencia
  function cleanText(t: string) {
    return t
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findBestFormulaMatch(tituloReceta: string): any {
    const cleanTitle = cleanText(tituloReceta);

    // 1. Match exacto o inclusión directa
    for (const fm of formulasMaster) {
      const cleanFmName = cleanText(fm.nombreProducto);
      if (cleanTitle.includes(cleanFmName) || cleanFmName.includes(cleanTitle)) {
        return fm;
      }
    }

    // 2. Match por palabras clave clave
    const words = cleanTitle
      .split(' ')
      .filter((w) => w.length > 3 && !['PARA', 'KILOS', 'LITROS', 'GRAMOS', 'FORMULA', 'COLOR', 'LOTE'].includes(w));

    let bestMatch: any = null;
    let maxMatches = 0;

    for (const fm of formulasMaster) {
      const cleanFmName = cleanText(fm.nombreProducto);
      let matchCount = 0;
      for (const w of words) {
        if (cleanFmName.includes(w)) matchCount++;
      }
      if (matchCount > maxMatches && matchCount >= 2) {
        maxMatches = matchCount;
        bestMatch = fm;
      }
    }

    return bestMatch;
  }

  let totalClientesCreados = 0;
  let totalVariantesCreadas = 0;

  console.log('\n2. Procesando las 31 hojas de clientes...');

  for (const sheetName of workbook.SheetNames) {
    const cleanSheetName = sheetName.trim();
    if (!cleanSheetName || cleanSheetName.toLowerCase() === 'hoja1') continue;

    // Crear o actualizar Cliente con el nombre exacto de la pestaña
    const cliente = await prisma.cliente.upsert({
      where: { ruc: `CLI-${cleanSheetName.replace(/[^A-Z0-9]/gi, '_').toUpperCase().slice(0, 15)}` },
      update: {
        razonSocial: cleanSheetName,
      },
      create: {
        razonSocial: cleanSheetName,
        ruc: `CLI-${cleanSheetName.replace(/[^A-Z0-9]/gi, '_').toUpperCase().slice(0, 15)}`,
        telefono: '999999999',
        condicionPago: 'Contado',
      },
    });
    totalClientesCreados++;

    const ws = workbook.Sheets[sheetName];
    const rawRows = xlsx.utils.sheet_to_json<any[]>(ws, { header: 1 });

    const recetasEncontradas: { titulo: string; fila: number }[] = [];

    // Recorrer filas para encontrar títulos de recetas
    for (let r = 0; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const firstCell = String(row[0] || '').trim();
      const secondCell = String(row[1] || '').trim();

      // Detectar encabezado de tabla de insumos en la fila siguiente
      const nextRow = rawRows[r + 1] || [];
      const nextRowStr = nextRow.join(' ').toUpperCase();

      const isHeaderFollowedByTable =
        nextRowStr.includes('PRODUCTO') ||
        nextRowStr.includes('CANTIDAD') ||
        nextRowStr.includes('1 KILO') ||
        nextRowStr.includes('1 LITRO') ||
        nextRowStr.includes('PRECIO');

      if (isHeaderFollowedByTable && (firstCell || secondCell)) {
        const tituloCandidato = (firstCell.length > secondCell.length ? firstCell : secondCell || firstCell).trim();
        // Evitar falsos positivos como números puros o palabras cortas
        if (
          tituloCandidato.length >= 4 &&
          !tituloCandidato.toUpperCase().startsWith('PRODUCTO') &&
          !tituloCandidato.toUpperCase().startsWith('ITEM')
        ) {
          recetasEncontradas.push({ titulo: tituloCandidato, fila: r + 1 });
        }
      }
    }

    // Vincular cada receta encontrada a su Fórmula Maestra correspondiente
    for (const rec of recetasEncontradas) {
      const matchedFm = findBestFormulaMatch(rec.titulo);
      if (matchedFm) {
        try {
          await prisma.formulaVariant.create({
            data: {
              formulaId: matchedFm.id,
              clienteId: cliente.id,
              nombre: rec.titulo,
              notas: `Extraído de la pestaña "${cleanSheetName}" (Fila ${rec.fila})`,
            },
          });
          totalVariantesCreadas++;
        } catch (err) {
          // Ignorar duplicados
        }
      }
    }
  }

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`✨ IMPORTACIÓN OFICIAL DE CLIENTES & VARIANTES COMPLETADA`);
  console.log(`   👥 Clientes Reales Registrados (Pestañas Excel): ${totalClientesCreados}`);
  console.log(`   🏷️  Variantes de Clientes Vinculadas a Fórmulas: ${totalVariantesCreadas}`);
  console.log(`═══════════════════════════════════════════════════════════════`);

  // Mostrar muestra de variantes vinculadas
  const sampleVariantes = await prisma.formulaVariant.findMany({
    take: 10,
    include: { cliente: true, formula: true },
  });

  console.log('\n--- MUESTRA DE VARIANTES REGISTRADAS ---');
  sampleVariantes.forEach((v) => {
    console.log(`  • [${v.formula.codigoFormula}] ${v.cliente?.razonSocial}: "${v.nombre}"`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
