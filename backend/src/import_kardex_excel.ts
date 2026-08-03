/**
 * QUIMICORP — Import Kardex desde FORMATO DE KÁRDEX.xlsx → kardex_movimientos (BD)
 * Ejecutar: npx ts-node src/import_kardex_excel.ts
 */

import * as path from 'path';
import * as XLSX from 'xlsx';
import { PrismaClient, CategoriaKardex, TipoMovimiento } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public';
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public';
}

const prisma = new PrismaClient();

const EXCEL_PATH = path.resolve(
  __dirname,
  '../../../FORMATO DE KÁRDEX.xlsx',
);

const SHEET_MAP: Record<string, CategoriaKardex> = {
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
  // Excel date serial → JS Date (days since 1899-12-30)
  const ms = (n - 25569) * 86400 * 1000;
  return new Date(ms).toISOString();
}

interface KardexRow {
  categoriaKardex: CategoriaKardex;
  productoNombre: string;
  familia: string;
  categoriaNombre: string;
  proveedorCliente: string;
  unidadMedida: string;
  fecha: string;
  tipoDoc: string;
  serie: string;
  numero: string;
  otp: string;
  tipoOperacion: TipoMovimiento;
  cantidadEntrada: number;
  cantidadSalida: number;
  saldoFinal: number;
}

async function main() {
  console.log('📂 Leyendo:', EXCEL_PATH);
  const wb = XLSX.readFile(EXCEL_PATH);

  const allRows: KardexRow[] = [];

  for (const [sheetName, categoria] of Object.entries(SHEET_MAP)) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) {
      console.warn(`⚠️  Hoja "${sheetName}" no encontrada.`);
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

    for (let i = 5; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const col0 = row[0]; // FAMILIA
      const col1 = row[1]; // CATEGORIA / (puede ser '' en movimientos)
      const col2 = row[2]; // PROVEEDOR
      const col3 = row[3]; // PRODUCTO
      const col4 = row[4]; // UNID MED
      const col5 = row[5]; // STOCK INICIAL (número)
      const col6 = row[6]; // FECHA (número serial)
      const col7 = row[7]; // TIPO DOC
      const col8 = row[8]; // SERIE
      const col9 = row[9]; // NUMERO
      const col10 = row[10]; // OTRO/OTP
      const col11 = row[11]; // OPERACION o "SALDO FINAL"
      const col12 = row[12]; // ENTRADAS
      const col13 = row[13]; // SALIDAS
      const col14 = row[14]; // SALDO

      // Saltar fila "SALDO FINAL" (resumen interno del Excel)
      if (col11 === 'SALDO FINAL') continue;

      // Detectar fila cabecera de producto:
      // col0 = FAMILIA (string no vacío), col3 = PRODUCTO, col5 = STOCK INICIAL (número)
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
        continue;
      }

      // Detectar fila de movimiento: tiene fecha serial y operación
      if (
        currentProduct &&
        col6 &&
        typeof col6 === 'number' &&
        col11 &&
        typeof col11 === 'string' &&
        col11.trim() !== ''
      ) {
        const operacionKey = col11.trim().toUpperCase();
        const tipoOperacion: TipoMovimiento =
          TIPO_MAP[operacionKey] ?? TipoMovimiento.ENTRADA_COMPRA;

        const entrada = col12 !== undefined && col12 !== null ? Number(col12) : 0;
        const salida = col13 !== undefined && col13 !== null ? Number(col13) : 0;
        const saldo = col14 !== undefined && col14 !== null ? Number(col14) : 0;

        allRows.push({
          categoriaKardex: categoria,
          productoNombre: currentProduct.productoNombre,
          familia: currentProduct.familia,
          categoriaNombre: currentProduct.categoriaNombre,
          proveedorCliente: currentProduct.proveedorCliente,
          unidadMedida: currentProduct.unidadMedida,
          fecha: excelDateToISO(col6),
          tipoDoc: col7 ? String(col7).trim() : 'OP',
          serie: col8 !== undefined && col8 !== null ? String(col8).trim() : '',
          numero: col9 !== undefined && col9 !== null ? String(col9).trim() : '',
          otp: col10 !== undefined && col10 !== null ? String(col10).trim() : '',
          tipoOperacion,
          cantidadEntrada: isNaN(entrada) ? 0 : entrada,
          cantidadSalida: isNaN(salida) ? 0 : salida,
          saldoFinal: isNaN(saldo) ? 0 : saldo,
        });
      }
    }

    console.log(`✅ ${sheetName}: ${allRows.filter((r) => r.categoriaKardex === categoria).length} movimientos`);
  }

  console.log(`\n📊 Total movimientos a importar: ${allRows.length}`);

  // Limpiar movimientos previos del Excel (solo los que no tienen insumoId = generados manualmente)
  // para no afectar los movimientos reales de producción
  const deleted = await prisma.kardexMovimiento.deleteMany({
    where: { insumoId: null },
  });
  console.log(`🗑️  Eliminados ${deleted.count} movimientos anteriores (sin insumoId)`);

  // Insertar en lotes de 50
  let inserted = 0;
  const BATCH = 50;
  for (let i = 0; i < allRows.length; i += BATCH) {
    const batch = allRows.slice(i, i + BATCH);
    await prisma.kardexMovimiento.createMany({ data: batch });
    inserted += batch.length;
    process.stdout.write(`\r   Insertando... ${inserted}/${allRows.length}`);
  }

  console.log(`\n✅ Importación completada: ${inserted} movimientos cargados en la BD.`);
  console.log('   Categorías:', [...new Set(allRows.map((r) => r.categoriaKardex))].join(', '));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
