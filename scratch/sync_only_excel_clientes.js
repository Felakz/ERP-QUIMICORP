const path = require('path');
const XLSX = require('xlsx');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public'
    }
  }
});

const EXCEL_PATH = path.join(__dirname, '../CLIENTES QUIMICORP PERU SAC (1).xlsx');

function normalizeStr(str) {
  if (!str) return '';
  return str.toString().trim().toUpperCase().replace(/\s+/g, ' ');
}

async function main() {
  console.log('🧹 PURGANDO CLIENTES NO PERTENECIENTES AL EXCEL OFICIAL...');

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['DATA PROVEEDORES'];
  const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // 1. Obtener la lista de RUCs y Razones Sociales del Excel
  const excelClients = [];
  for (let i = 2; i < jsonRows.length; i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0) continue;

    const rucRaw = row[1] ? row[1].toString().trim() : '';
    const clienteNombreRaw = row[2] ? row[2].toString().trim() : '';
    const direccionRaw = row[3] ? row[3].toString().trim() : '';
    const contactoRaw = row[4] ? row[4].toString().trim() : '';
    const telefonoRaw = row[5] ? row[5].toString().trim() : '';

    if (clienteNombreRaw) {
      const razonSocial = normalizeStr(clienteNombreRaw);
      const rucClean = rucRaw ? rucRaw.replace(/[^0-9]/g, '') : '';
      excelClients.push({
        razonSocial,
        rucClean,
        direccion: direccionRaw,
        contacto: contactoRaw,
        telefono: telefonoRaw ? telefonoRaw.replace(/[^0-9]/g, '') : '',
      });
    }
  }

  console.log(`📋 Total de clientes identificados en Excel: ${excelClients.length}`);

  // 2. Primero Upsert de todos los clientes del Excel para asegurar que estén al día
  for (const c of excelClients) {
    const rucToUse = c.rucClean || `20${Math.floor(100000000 + Math.random() * 900000000)}`;
    const existing = await prisma.cliente.findFirst({
      where: {
        OR: [
          ...(c.rucClean ? [{ ruc: c.rucClean }] : []),
          { razonSocial: { equals: c.razonSocial, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      await prisma.cliente.update({
        where: { id: existing.id },
        data: {
          razonSocial: c.razonSocial,
          ruc: c.rucClean || existing.ruc,
          direccion: c.direccion || existing.direccion,
          telefono: c.telefono || existing.telefono,
        }
      });
    } else {
      await prisma.cliente.create({
        data: {
          razonSocial: c.razonSocial,
          ruc: rucToUse,
          direccion: c.direccion || null,
          telefono: c.telefono || '999999999',
          condicionPago: 'Contado',
        }
      });
    }
  }

  // 3. Obtener todos los clientes de la BD
  const dbClients = await prisma.cliente.findMany();
  console.log(`📦 Total de clientes en BD antes de la purga: ${dbClients.length}`);

  let eliminados = 0;
  const listaEliminados = [];

  for (const dbC of dbClients) {
    const dbRazon = normalizeStr(dbC.razonSocial);
    const dbRuc = dbC.ruc ? dbC.ruc.replace(/[^0-9]/g, '') : '';

    // Verificar si coincide con alguno del Excel
    const match = excelClients.some(exC => {
      const matchRazon = exC.razonSocial === dbRazon || dbRazon.includes(exC.razonSocial) || exC.razonSocial.includes(dbRazon);
      const matchRuc = exC.rucClean && dbRuc && exC.rucClean === dbRuc;
      return matchRazon || matchRuc;
    });

    if (!match) {
      listaEliminados.push(`[${dbC.ruc || 'SIN RUC'}] ${dbC.razonSocial}`);

      // Desvincular de variantes o pedidos si existen referencias para evitar crash FK
      if (prisma.formulaVariant) {
        await prisma.formulaVariant.updateMany({
          where: { clienteId: dbC.id },
          data: { clienteId: null }
        }).catch(() => null);
      }

      if (prisma.pedidoComercial) {
        await prisma.pedidoComercial.updateMany({
          where: { clienteId: dbC.id },
          data: { clienteId: null }
        }).catch(() => null);
      }

      await prisma.cliente.delete({
        where: { id: dbC.id }
      });
      eliminados++;
    }
  }

  const finalCount = await prisma.cliente.count();

  console.log(`\n✨ LIMPIEZA FINALIZADA CON ÉXITO:`);
  console.log(`   - Clientes eliminados (no estaban en el Excel): ${eliminados}`);
  console.log(`   - Lista de clientes removidos:\n     * ${listaEliminados.join('\n     * ')}`);
  console.log(`   - Total final de clientes oficiales en BD: ${finalCount}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error durante la purga de clientes:', err);
  prisma.$disconnect();
});
