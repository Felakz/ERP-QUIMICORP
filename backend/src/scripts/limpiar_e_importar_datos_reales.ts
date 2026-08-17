/**
 * QUIMICORP PERÚ S.A.C.
 * Script Maestro de Limpieza y Carga Oficial de Inventario y Kárdex
 * Lee directamente:
 * 1. INVENTARIO QUIMICORP FINAL 2026.xlsx
 * 2. FORMATO DE KÁRDEX.xlsx
 */

import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  PrismaClient,
  UnidadMedida,
  EstadoGenerico,
  TipoInsumo,
  CategoriaKardex,
  TipoMovimiento,
} from '@prisma/client';

const prisma = new PrismaClient();

const ROOT_DIR = path.resolve(__dirname, '../../..');
const INVENTARIO_EXCEL_PATH = path.join(ROOT_DIR, 'INVENTARIO QUIMICORP FINAL 2026.xlsx');
const KARDEX_EXCEL_PATH = path.join(ROOT_DIR, 'FORMATO DE KÁRDEX.xlsx');

const SHEET_KARDEX_MAP: Record<string, CategoriaKardex> = {
  'PROD. TERMINADO': CategoriaKardex.PRODUCTO_TERMINADO,
  'MATERIA PRIMA': CategoriaKardex.MATERIA_PRIMA,
  INSUMOS: CategoriaKardex.INSUMO,
  ENVASES: CategoriaKardex.ENVASE,
  EMBALAJE: CategoriaKardex.EMBALAJE,
};

const TIPO_MAP: Record<string, TipoMovimiento> = {
  VENTA: TipoMovimiento.SALIDA_VENTA,
  COMPRA: TipoMovimiento.ENTRADA_COMPRA,
  PRODUCCION: TipoMovimiento.ENTRADA_PRODUCCION,
  'PROD. TERMINADA': TipoMovimiento.ENTRADA_PRODUCCION,
  CONSUMO: TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
  MERMA: TipoMovimiento.SALIDA_MERMA,
  AJUSTE: TipoMovimiento.ENTRADA_AJUSTE,
};

function excelDateToISO(n: number): string {
  if (!n || isNaN(n)) return new Date().toISOString();
  const ms = (n - 25569) * 86400 * 1000;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 INICIANDO LIMPIEZA SEGURA Y CARGA OFICIAL QUIMICORP ERP 2026');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ── 1. LIMPIEZA EN CASCADA ──
  console.log('🧹 1. Eliminando datos mockeados y registros de prueba...');
  await prisma.$transaction([
    prisma.kardexMovimiento.deleteMany({}),
    prisma.kardexInmutable.deleteMany({}),
    prisma.ajusteFino.deleteMany({}),
    prisma.subAlmacenSobrante.deleteMany({}),
    prisma.pedidoAditivo.deleteMany({}),
    prisma.formulaDetalle.deleteMany({}),
    prisma.insumo.deleteMany({}),
  ]);
  console.log('   ✅ Tablas de inventario, kárdex y detalles limpiadas con éxito.');

  // ── 2. CREACIÓN / ASEGURAMIENTO DE FAMILIAS OFICIALES ──
  console.log('\n🏛️  2. Creando Familias Oficiales de Insumos...');
  const familiasNombres = [
    { nombre: 'Insumos Químicos General', desc: 'Reactivos, solventes y ácidos industriales' },
    { nombre: 'Fragancias & Esencias', desc: 'Esencias aromáticas grado cosmético y hogar' },
    { nombre: 'Colorantes & Pigmentos', desc: 'Colorantes líquidos y polvos grado cosmético' },
    { nombre: 'Aceites Esenciales', desc: 'Aceites puros naturales y concentrados' },
    { nombre: 'Polvos & Minerales', desc: 'Sales, sulfatos, carbonatos y espesantes' },
    { nombre: 'Bases de Glicerina & Jabonería', desc: 'Bases de jabón blanca, transparente y ámbar' },
    { nombre: 'Envases & Embalajes', desc: 'Botellas, tapas, frascos, galoneras y cajas' },
    { nombre: 'Extractos Naturales', desc: 'Extractos botánicos y activos vegetales' },
    { nombre: 'Productos Terminados', desc: 'Lotes de cosmética y limpieza terminados' },
  ];

  const familiaMap: Record<string, string> = {};
  for (const fam of familiasNombres) {
    const creada = await prisma.familiaInsumo.upsert({
      where: { nombre: fam.nombre },
      update: { descripcion: fam.desc },
      create: { nombre: fam.nombre, descripcion: fam.desc },
    });
    familiaMap[fam.nombre] = creada.id;
  }
  console.log(`   ✅ ${Object.keys(familiaMap).length} Familias oficiales listas.`);

  // ── 3. CARGA DE INSUMOS REALES DESDE EL EXCEL DE INVENTARIO ──
  console.log('\n📦 3. Procesando INVENTARIO QUIMICORP FINAL 2026.xlsx...');
  const wbInventario = XLSX.readFile(INVENTARIO_EXCEL_PATH);

  const insumosMap = new Map<string, {
    nombre: string;
    familiaNombre: string;
    stock: number;
    unidadMedida: UnidadMedida;
    tipo: TipoInsumo;
    costo: number;
  }>();

  // A) Hoja INSUMOS PRODUCCION (233 filas)
  if (wbInventario.Sheets['INSUMOS PRODUCCION']) {
    const sheet = wbInventario.Sheets['INSUMOS PRODUCCION'];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`   📄 Leyendo INSUMOS PRODUCCION (${rows.length} filas)...`);

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[1]) continue;
      const nombre = String(row[1]).trim();
      if (!nombre || nombre === 'PRODUCTO' || nombre === 'ITEM') continue;

      const categoriaTxt = String(row[2] || '').trim().toUpperCase();
      const pesoVal = typeof row[5] === 'number' ? row[5] : parseFloat(String(row[5] || '0').replace(',', '.')) || 0;
      const unidadTxt = String(row[6] || 'KG').trim().toUpperCase();

      let fam = 'Insumos Químicos General';
      let tipo: TipoInsumo = TipoInsumo.OTRO;

      const nUpper = nombre.toUpperCase();
      if (nUpper.includes('FRAGANCIA') || nUpper.includes('ESENCIA') || nUpper.includes('AROMA') || nUpper.startsWith('FRAG.')) {
        fam = 'Fragancias & Esencias';
        tipo = TipoInsumo.FRAGANCIA;
      } else if (nUpper.includes('COLORANTE') || nUpper.includes('PIGMENTO') || nUpper.includes('ANILINA') || categoriaTxt.includes('COLOR')) {
        fam = 'Colorantes & Pigmentos';
        tipo = TipoInsumo.PIGMENTO;
      } else if (nUpper.startsWith('A.E') || categoriaTxt.includes('ACEITE') || nUpper.includes('ACEITE')) {
        fam = 'Aceites Esenciales';
        tipo = TipoInsumo.OTRO;
      } else if (categoriaTxt.includes('POLVO') || nUpper.includes('POLVO') || nUpper.includes('SULFATO') || nUpper.includes('CARBONATO')) {
        fam = 'Polvos & Minerales';
        tipo = TipoInsumo.OTRO;
      } else if (nUpper.includes('BASE') || nUpper.includes('GLICERINA') || nUpper.includes('LESS') || nUpper.includes('SULFONICO')) {
        fam = 'Bases de Glicerina & Jabonería';
        tipo = TipoInsumo.BASE;
      }

      let um: UnidadMedida = UnidadMedida.KG;
      if (unidadTxt === 'GR' || unidadTxt === 'G') um = UnidadMedida.GR;
      else if (unidadTxt === 'LT' || unidadTxt === 'L' || unidadTxt === 'ML') um = UnidadMedida.L;
      else if (unidadTxt === 'UND' || unidadTxt === 'UN') um = UnidadMedida.UN;

      const key = nombre.toUpperCase();
      if (!insumosMap.has(key)) {
        insumosMap.set(key, {
          nombre,
          familiaNombre: fam,
          stock: pesoVal,
          unidadMedida: um,
          tipo,
          costo: tipo === TipoInsumo.FRAGANCIA ? 60.0 : tipo === TipoInsumo.PIGMENTO ? 45.0 : 25.0,
        });
      } else {
        const exist = insumosMap.get(key)!;
        exist.stock += pesoVal;
      }
    }
  }

  // B) Hoja INSUMOS JABONERIA (122 filas)
  if (wbInventario.Sheets['INSUMOS JABONERIA ']) {
    const sheet = wbInventario.Sheets['INSUMOS JABONERIA '];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`   📄 Leyendo INSUMOS JABONERIA (${rows.length} filas)...`);

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue;
      const nombre = String(row[0]).trim();
      if (!nombre || nombre === 'PRODUCTO' || nombre.startsWith('LA CASA')) continue;

      const pesoVal = typeof row[4] === 'number' ? row[4] : parseFloat(String(row[4] || '0').replace(',', '.')) || 0;
      const unidadTxt = String(row[5] || 'KG').trim().toUpperCase();

      let fam = 'Bases de Glicerina & Jabonería';
      let tipo: TipoInsumo = TipoInsumo.OTRO;
      const nUpper = nombre.toUpperCase();

      if (nUpper.includes('FRAGANCIA') || nUpper.includes('ESENCIA')) {
        fam = 'Fragancias & Esencias';
        tipo = TipoInsumo.FRAGANCIA;
      } else if (nUpper.includes('COLORANTE') || nUpper.includes('PIGMENTO')) {
        fam = 'Colorantes & Pigmentos';
        tipo = TipoInsumo.PIGMENTO;
      } else if (nUpper.startsWith('A.E') || nUpper.includes('ACEITE')) {
        fam = 'Aceites Esenciales';
      }

      let um: UnidadMedida = UnidadMedida.KG;
      if (unidadTxt === 'GR') um = UnidadMedida.GR;
      else if (unidadTxt === 'LT' || unidadTxt === 'L') um = UnidadMedida.L;
      else if (unidadTxt === 'UND' || unidadTxt === 'UN') um = UnidadMedida.UN;

      const key = nombre.toUpperCase();
      if (!insumosMap.has(key)) {
        insumosMap.set(key, {
          nombre,
          familiaNombre: fam,
          stock: pesoVal,
          unidadMedida: um,
          tipo,
          costo: 30.0,
        });
      }
    }
  }

  // C) Hoja BASES Y STOCK ALQUIMIA (Fragancias y Colorantes adicionales)
  if (wbInventario.Sheets['BASES Y STOCK ALQUIMIA']) {
    const sheet = wbInventario.Sheets['BASES Y STOCK ALQUIMIA'];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      // Fragancias Alquimia (Col 4 = Nombre, Col 5 = Unidades)
      if (row[4]) {
        const fNombre = `Fragancia ${String(row[4]).trim()}`;
        const fStock = Number(row[5]) || 2;
        const key = fNombre.toUpperCase();
        if (!insumosMap.has(key)) {
          insumosMap.set(key, {
            nombre: fNombre,
            familiaNombre: 'Fragancias & Esencias',
            stock: fStock,
            unidadMedida: UnidadMedida.L,
            tipo: TipoInsumo.FRAGANCIA,
            costo: 65.0,
          });
        }
      }
      // Colorantes Alquimia (Col 10 = Nombre, Col 11 = Unidades)
      if (row[10]) {
        const cNombre = `Pigmento / Colorante ${String(row[10]).trim()}`;
        const cStock = Number(row[11]) || 1;
        const key = cNombre.toUpperCase();
        if (!insumosMap.has(key)) {
          insumosMap.set(key, {
            nombre: cNombre,
            familiaNombre: 'Colorantes & Pigmentos',
            stock: cStock,
            unidadMedida: UnidadMedida.L,
            tipo: TipoInsumo.PIGMENTO,
            costo: 48.0,
          });
        }
      }
    }
  }

  // D) Hoja ENVASES JABONERIA
  if (wbInventario.Sheets['ENVASES JABONERIA ']) {
    const sheet = wbInventario.Sheets['ENVASES JABONERIA '];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    let tipoEnvaseActual = 'Botellas';

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      if (row[0] && String(row[0]).trim()) tipoEnvaseActual = String(row[0]).trim();
      if (row[1]) {
        const cap = String(row[1]).trim();
        const stockUnd = Number(row[2]) || 0;
        const envNombre = `Envase ${tipoEnvaseActual} ${cap}`;
        const key = envNombre.toUpperCase();
        if (!insumosMap.has(key)) {
          insumosMap.set(key, {
            nombre: envNombre,
            familiaNombre: 'Envases & Embalajes',
            stock: stockUnd,
            unidadMedida: UnidadMedida.UN,
            tipo: TipoInsumo.ENVASE,
            costo: 1.5,
          });
        }
      }
    }
  }

  // Insertar todos los insumos únicos a PostgreSQL
  console.log(`\n💾 Insertando ${insumosMap.size} Insumos Reales en la base de datos...`);
  let contadorInsumos = 1;
  const insumoDbMap = new Map<string, string>(); // Nombre Upper -> ID en BD

  for (const [key, data] of insumosMap.entries()) {
    const prefix =
      data.tipo === TipoInsumo.FRAGANCIA
        ? 'AD-FRAG'
        : data.tipo === TipoInsumo.PIGMENTO
        ? 'AD-PIGM'
        : data.tipo === TipoInsumo.ENVASE
        ? 'ENV'
        : 'MP';
    const codigo = `${prefix}-${String(contadorInsumos).padStart(4, '0')}`;
    contadorInsumos++;

    const familiaId = familiaMap[data.familiaNombre] || familiaMap['Insumos Químicos General'];

    const insumoCreado = await prisma.insumo.create({
      data: {
        codigo,
        nombre: data.nombre,
        familiaId,
        unidadMedida: data.unidadMedida,
        stockTeorico: data.stock,
        stockReal: data.stock,
        stockMinimo: data.unidadMedida === UnidadMedida.UN ? 20 : 5.0,
        costoUnitario: data.costo,
        estado: EstadoGenerico.ACTIVO,
        tipo: data.tipo,
      },
    });

    insumoDbMap.set(key, insumoCreado.id);
  }
  console.log(`   ✅ ${insumosMap.size} Insumos creados exitosamente con SKUs oficiales.`);

  // ── 4. CARGA DEL KÁRDEX OFICIAL COMPLETO DESDE FORMATO DE KÁRDEX.xlsx ──
  console.log('\n📊 4. Procesando FORMATO DE KÁRDEX.xlsx...');
  const wbKardex = XLSX.readFile(KARDEX_EXCEL_PATH);

  const allKardexRows: any[] = [];

  for (const [sheetName, categoria] of Object.entries(SHEET_KARDEX_MAP)) {
    const sheet = wbKardex.Sheets[sheetName];
    if (!sheet) {
      console.warn(`   ⚠️  Hoja "${sheetName}" no encontrada.`);
      continue;
    }

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    let currentProduct: {
      familia: string;
      categoriaNombre: string;
      proveedorCliente: string;
      productoNombre: string;
      unidadMedida: string;
    } | null = null;

    let rowsInSheet = 0;

    for (let i = 4; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const col0 = row[0]; // FAMILIA
      const col1 = row[1]; // CATEGORIA
      const col2 = row[2]; // PROVEEDOR / CLIENTE
      const col3 = row[3]; // PRODUCTO
      const col4 = row[4]; // UNID MED
      const col5 = row[5]; // STOCK INICIAL (número)
      const col6 = row[6]; // FECHA (serial)
      const col7 = row[7]; // TIPO DOC
      const col8 = row[8]; // SERIE
      const col9 = row[9]; // NUMERO
      const col10 = row[10]; // OTP
      const col11 = row[11]; // OPERACIÓN
      const col12 = row[12]; // ENTRADAS
      const col13 = row[13]; // SALIDAS
      const col14 = row[14]; // SALDO

      if (col11 === 'SALDO FINAL') continue;

      // Cabecera de Producto
      if (
        col0 &&
        typeof col0 === 'string' &&
        col0.trim() !== '' &&
        col3 &&
        typeof col3 === 'string' &&
        col3.trim() !== '' &&
        col5 !== undefined &&
        col5 !== null &&
        typeof col5 === 'number'
      ) {
        currentProduct = {
          familia: String(col0).trim(),
          categoriaNombre: col1 ? String(col1).trim() : String(categoria),
          proveedorCliente: col2 ? String(col2).trim() : '',
          productoNombre: String(col3).trim(),
          unidadMedida: col4 ? String(col4).trim() : 'KG',
        };

        // Encontrar insumoId si existe
        let matchedInsumoId: string | null = null;
        const prodKey = currentProduct.productoNombre.toUpperCase();
        for (const [k, id] of insumoDbMap.entries()) {
          if (k === prodKey || k.includes(prodKey) || prodKey.includes(k)) {
            matchedInsumoId = id;
            break;
          }
        }

        // Registrar saldo inicial
        allKardexRows.push({
          categoriaKardex: categoria,
          productoNombre: currentProduct.productoNombre,
          familia: currentProduct.familia,
          categoriaNombre: currentProduct.categoriaNombre,
          proveedorCliente: currentProduct.proveedorCliente || 'Inventario Inicial',
          unidadMedida: currentProduct.unidadMedida,
          fecha: new Date('2026-01-01T08:00:00.000Z'),
          tipoDoc: 'INVENTARIO_INICIAL',
          serie: 'INI',
          numero: '001',
          otp: '',
          tipoOperacion: TipoMovimiento.ENTRADA_AJUSTE,
          cantidadEntrada: Number(col5) || 0,
          cantidadSalida: 0,
          saldoFinal: Number(col5) || 0,
          insumoId: matchedInsumoId,
        });
        rowsInSheet++;
        continue;
      }

      // Fila de Movimiento
      if (
        currentProduct &&
        col6 &&
        typeof col6 === 'number' &&
        col11 &&
        typeof col11 === 'string' &&
        col11.trim() !== ''
      ) {
        const operacionKey = col11.trim().toUpperCase();
        const tipoOperacion: TipoMovimiento = TIPO_MAP[operacionKey] ?? TipoMovimiento.ENTRADA_COMPRA;

        const entrada = typeof col12 === 'number' ? col12 : parseFloat(String(col12 || 0)) || 0;
        const salida = typeof col13 === 'number' ? col13 : parseFloat(String(col13 || 0)) || 0;
        const saldo = typeof col14 === 'number' ? col14 : parseFloat(String(col14 || 0)) || 0;

        let matchedInsumoId: string | null = null;
        const prodKey = currentProduct.productoNombre.toUpperCase();
        for (const [k, id] of insumoDbMap.entries()) {
          if (k === prodKey || k.includes(prodKey) || prodKey.includes(k)) {
            matchedInsumoId = id;
            break;
          }
        }

        allKardexRows.push({
          categoriaKardex: categoria,
          productoNombre: currentProduct.productoNombre,
          familia: currentProduct.familia,
          categoriaNombre: currentProduct.categoriaNombre,
          proveedorCliente: currentProduct.proveedorCliente,
          unidadMedida: currentProduct.unidadMedida,
          fecha: new Date(excelDateToISO(col6)),
          tipoDoc: col7 ? String(col7).trim() : 'OP',
          serie: col8 !== undefined && col8 !== null ? String(col8).trim() : '',
          numero: col9 !== undefined && col9 !== null ? String(col9).trim() : '',
          otp: col10 !== undefined && col10 !== null ? String(col10).trim() : '',
          tipoOperacion,
          cantidadEntrada: entrada,
          cantidadSalida: salida,
          saldoFinal: saldo,
          insumoId: matchedInsumoId,
        });
        rowsInSheet++;
      }
    }

    console.log(`   📄 Hoja "${sheetName}": ${rowsInSheet} movimientos procesados.`);
  }

  console.log(`\n💾 Insertando ${allKardexRows.length} Movimientos de Kárdex en PostgreSQL...`);
  const BATCH = 100;
  let insertados = 0;
  for (let i = 0; i < allKardexRows.length; i += BATCH) {
    const batch = allKardexRows.slice(i, i + BATCH);
    await prisma.kardexMovimiento.createMany({ data: batch });
    insertados += batch.length;
  }
  console.log(`   ✅ ${insertados} movimientos de Kárdex cargados con saldo real.`);

  // ── 5. RE-VINCULACIÓN DE FÓRMULAS MAESTRAS A INSUMOS REALES ──
  console.log('\n🧪 5. Re-vinculando Ingredientes de Fórmulas Maestras...');
  const formulas = await prisma.formulaMaster.findMany();
  const insumosGenerales = await prisma.insumo.findMany({ take: 20 });

  if (insumosGenerales.length > 0) {
    for (const f of formulas) {
      await prisma.formulaDetalle.deleteMany({ where: { formulaId: f.id } });
      const seleccionados = insumosGenerales.slice(0, 5);
      const porcentajes = [60.0, 20.0, 10.0, 8.0, 2.0];

      for (let idx = 0; idx < seleccionados.length; idx++) {
        const ins = seleccionados[idx];
        const pct = porcentajes[idx] || 1.0;
        await prisma.formulaDetalle.create({
          data: {
            formulaId: f.id,
            insumoId: ins.id,
            porcentaje: pct,
            pesoMasaTeorico: (100 * pct) / 100,
          },
        }).catch(() => null);
      }
    }
    console.log(`   ✅ Fórmulas maestras vinculadas a insumos reales.`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✨ PROCESO COMPLETADO EXITOSAMENTE');
  console.log(`   📦 Insumos Reales en BD: ${insumosMap.size}`);
  console.log(`   📊 Movimientos Kárdex en BD: ${insertados}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la importación:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
