import { PrismaClient, UnidadMedida, EstadoGenerico, CategoriaKardex, TipoMovimiento } from '@prisma/client';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

const INVENTARIO_EXCEL_PATH = 'C:\\Users\\JUANA CASSANA\\OneDrive\\Documentos\\ERP QUIMICORP\\ERP-QUIMICORP\\INVENTARIO QUIMICORP FINAL 2026.xlsx';

async function main() {
  console.log('🚀 Iniciando Carga Real del Inventario Quimicorp Perú S.A.C. hacia PostgreSQL...');

  const adminUser = await prisma.usuario.findFirst();
  const adminUserId = adminUser ? adminUser.id : undefined;

  // 1. Crear Familias Base
  const familiasNombres = [
    'Aceites Esenciales',
    'Polvos & Minerales',
    'Colorantes & Pigmentos',
    'Fragancias & Aromas',
    'Extractos Naturales',
    'Insumos Químicos General',
    'Bases de Glicerina & Jabonería',
    'Envases & Embalajes',
    'Productos Terminados',
    'Activos & Equipos de Laboratorio',
  ];

  const familiaMap: Record<string, string> = {};

  for (const nombreFam of familiasNombres) {
    let fam = await prisma.familiaInsumo.findUnique({ where: { nombre: nombreFam } });
    if (!fam) {
      fam = await prisma.familiaInsumo.create({
        data: { nombre: nombreFam, descripcion: `Familia Oficial Quimicorp: ${nombreFam}` },
      });
    }
    familiaMap[nombreFam] = fam.id;
  }

  // 2. Procesar "INVENTARIO QUIMICORP FINAL 2026.xlsx"
  if (fs.existsSync(INVENTARIO_EXCEL_PATH)) {
    console.log('📄 Procesando:', INVENTARIO_EXCEL_PATH);
    const wb = XLSX.readFile(INVENTARIO_EXCEL_PATH);

    // HOJA 1: INSUMOS PRODUCCION (233 filas)
    if (wb.Sheets['INSUMOS PRODUCCION']) {
      const sheet = wb.Sheets['INSUMOS PRODUCCION'];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`📦 Importando INSUMOS PRODUCCION (${rows.length} filas)...`);

      let contador = 1;
      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[1]) continue;

        const nombre = String(row[1]).trim();
        const categoriaTxt = String(row[2] || '').trim().toUpperCase();
        const proveedor = String(row[4] || row[3] || 'INSUQUIMICA').trim();
        const pesoVal = parseFloat(row[5]) || 0;
        const unidadTxt = String(row[6] || 'KG').trim().toUpperCase();

        let familiaId = familiaMap['Insumos Químicos General'];
        if (categoriaTxt.includes('ACEITE') || nombre.startsWith('A.E')) {
          familiaId = familiaMap['Aceites Esenciales'];
        } else if (categoriaTxt.includes('POLVO')) {
          familiaId = familiaMap['Polvos & Minerales'];
        }

        const codigo = `MP-REAL-${String(contador).padStart(4, '0')}`;
        contador++;

        let um: UnidadMedida = UnidadMedida.KG;
        if (unidadTxt === 'GR') um = UnidadMedida.GR;
        else if (unidadTxt === 'LT' || unidadTxt === 'L') um = UnidadMedida.L;

        const insumo = await prisma.insumo.upsert({
          where: { codigo },
          update: {
            nombre,
            stockTeorico: pesoVal,
            stockReal: pesoVal,
            unidadMedida: um,
          },
          create: {
            codigo,
            nombre,
            familiaId,
            unidadMedida: um,
            stockTeorico: pesoVal,
            stockReal: pesoVal,
            stockMinimo: 5,
            costoUnitario: 25.0,
            estado: EstadoGenerico.ACTIVO,
          },
        });

        // Registrar entrada inicial en KardexMovimiento
        await prisma.kardexMovimiento.create({
          data: {
            categoriaKardex: CategoriaKardex.MATERIA_PRIMA,
            productoNombre: nombre,
            familia: 'Materia Prima Real',
            categoriaNombre: 'Control Físico Planta',
            proveedorCliente: proveedor,
            unidadMedida: um,
            tipoDoc: 'INVENTARIO',
            serie: 'INV2026',
            numero: `INV-${codigo}`,
            tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
            cantidadEntrada: pesoVal,
            cantidadSalida: 0,
            saldoFinal: pesoVal,
            insumoId: insumo.id,
            usuarioId: adminUserId,
          },
        });
      }
    }

    // HOJA 2: INSUMOS JABONERIA
    if (wb.Sheets['INSUMOS JABONERIA']) {
      const sheet = wb.Sheets['INSUMOS JABONERIA'];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`🧼 Importando INSUMOS JABONERIA (${rows.length} filas)...`);

      let contador = 1;
      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;

        const nombre = String(row[0]).trim();
        const catCode = String(row[1] || 'I').trim().toUpperCase();
        const marca = String(row[2] || row[3] || 'LA CASA DE LOS JABONES').trim();
        const pesoVal = parseFloat(row[4]) || 0;
        const unidadTxt = String(row[5] || 'GR').trim().toUpperCase();

        let familiaId = familiaMap['Bases de Glicerina & Jabonería'];
        let catKardex: CategoriaKardex = CategoriaKardex.INSUMO;

        if (catCode === 'A.E') {
          familiaId = familiaMap['Aceites Esenciales'];
          catKardex = CategoriaKardex.MATERIA_PRIMA;
        } else if (catCode === 'P') {
          familiaId = familiaMap['Polvos & Minerales'];
          catKardex = CategoriaKardex.MATERIA_PRIMA;
        } else if (catCode === 'C') {
          familiaId = familiaMap['Colorantes & Pigmentos'];
        } else if (catCode === 'F') {
          familiaId = familiaMap['Fragancias & Aromas'];
        } else if (catCode === 'EX') {
          familiaId = familiaMap['Extractos Naturales'];
        }

        const codigo = `JAB-REAL-${String(contador).padStart(4, '0')}`;
        contador++;

        let um: UnidadMedida = UnidadMedida.GR;
        if (unidadTxt === 'KG') um = UnidadMedida.KG;
        else if (unidadTxt === 'LT' || unidadTxt === 'L') um = UnidadMedida.L;

        const insumo = await prisma.insumo.upsert({
          where: { codigo },
          update: { nombre, stockTeorico: pesoVal, stockReal: pesoVal, unidadMedida: um },
          create: {
            codigo,
            nombre,
            familiaId,
            unidadMedida: um,
            stockTeorico: pesoVal,
            stockReal: pesoVal,
            stockMinimo: 2,
            costoUnitario: 18.0,
            estado: EstadoGenerico.ACTIVO,
          },
        });

        await prisma.kardexMovimiento.create({
          data: {
            categoriaKardex: catKardex,
            productoNombre: nombre,
            familia: 'Insumos Jabonería Real',
            categoriaNombre: 'Stock Físico Jabonería',
            proveedorCliente: marca,
            unidadMedida: um,
            tipoDoc: 'INVENTARIO',
            serie: 'JAB2026',
            numero: `INV-${codigo}`,
            tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
            cantidadEntrada: pesoVal,
            cantidadSalida: 0,
            saldoFinal: pesoVal,
            insumoId: insumo.id,
            usuarioId: adminUserId,
          },
        });
      }
    }

    // HOJA 3: ENVASES JABONERIA
    if (wb.Sheets['ENVASES JABONERIA ']) {
      const sheet = wb.Sheets['ENVASES JABONERIA '];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`📦 Importando ENVASES JABONERIA (${rows.length} filas)...`);

      let contador = 1;
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;

        const tipoEnvas = String(row[0]).trim();
        const capacidad = String(row[1] || '').trim();
        const cant = parseFloat(row[2]) || 0;
        const nombre = capacityName(tipoEnvas, capacidad);

        const codigo = `ENV-REAL-${String(contador).padStart(4, '0')}`;
        contador++;

        const insumo = await prisma.insumo.upsert({
          where: { codigo },
          update: { nombre, stockTeorico: cant, stockReal: cant },
          create: {
            codigo,
            nombre,
            familiaId: familiaMap['Envases & Embalajes'],
            unidadMedida: UnidadMedida.UN,
            stockTeorico: cant,
            stockReal: cant,
            stockMinimo: 50,
            costoUnitario: 1.5,
            estado: EstadoGenerico.ACTIVO,
          },
        });
      }
    }

    // HOJA 4: PRODUCTOS TERMINADOS STOCK
    if (wb.Sheets['PRODUCTOS TERMINADOS STOCK']) {
      const sheet = wb.Sheets['PRODUCTOS TERMINADOS STOCK'];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`🏆 Importando PRODUCTOS TERMINADOS STOCK (${rows.length} filas)...`);

      let contador = 1;
      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;

        const prodNombre = String(row[0]).trim();
        const cliente = String(row[1] || 'Quimicorp SAC').trim();
        const color = String(row[2] || 'ESTÁNDAR').trim();
        const pesoVal = parseFloat(row[3]) || (typeof row[3] === 'string' ? parseFloat(row[3].replace(/[^0-9.]/g, '')) : 0) || 10;
        const fragancia = String(row[4] || 'SIN FRAGANCIA').trim();

        const codigo = `PT-REAL-${String(contador).padStart(4, '0')}`;
        contador++;

        await prisma.insumo.upsert({
          where: { codigo },
          update: { nombre: prodNombre, stockTeorico: pesoVal, stockReal: pesoVal },
          create: {
            codigo,
            nombre: prodNombre,
            familiaId: familiaMap['Productos Terminados'],
            unidadMedida: UnidadMedida.KG,
            stockTeorico: pesoVal,
            stockReal: pesoVal,
            stockMinimo: 10,
            costoUnitario: 45.0,
            estado: EstadoGenerico.ACTIVO,
          },
        });
      }
    }
  }

  console.log('✅ ¡Carga Real del Inventario Finalizada con Éxito!');
}

function capacityName(base: string, cap: string) {
  if (!cap) return base;
  return `${base} ${cap}`;
}

main()
  .catch((e) => {
    console.error('❌ Error cargando inventario real:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
