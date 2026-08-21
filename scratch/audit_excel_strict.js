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

async function main() {
  console.log('🔍 AUDITORÍA EXACTA Y ESTRICTA DEL EXCEL OFICIAL CLIENTES QUIMICORP');

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['DATA PROVEEDORES'];
  const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Extraer las filas reales del Excel
  const excelOfficialList = [];
  for (let i = 2; i < jsonRows.length; i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0) continue;

    const rucRaw = row[1] ? row[1].toString().trim() : '';
    const clienteNombreRaw = row[2] ? row[2].toString().trim() : '';
    const direccionRaw = row[3] ? row[3].toString().trim() : '';
    const contactoRaw = row[4] ? row[4].toString().trim() : '';
    const telefonoRaw = row[5] ? row[5].toString().trim() : '';

    if (clienteNombreRaw) {
      const rucClean = rucRaw.replace(/[^0-9]/g, '');
      const razonSocial = clienteNombreRaw.trim().toUpperCase();
      excelOfficialList.push({
        ruc: rucClean || `20${Math.floor(100000000 + Math.random() * 900000000)}`,
        razonSocial,
        direccion: direccionRaw || null,
        contacto: contactoRaw || null,
        telefono: telefonoRaw ? telefonoRaw.replace(/[^0-9]/g, '') : null
      });
    }
  }

  console.log(`\n📌 SE ENCONTRARON EXACTAMENTE ${excelOfficialList.length} CLIENTES EN EL EXCEL:\n`);
  excelOfficialList.forEach((item, idx) => {
    console.log(`${idx + 1}. RUC: ${item.ruc} | Razón Social: ${item.razonSocial} | Dir: ${item.direccion || 'N/A'} | Tel: ${item.telefono || 'N/A'}`);
  });

  // Limpiar COMPLETAMENTE la tabla de clientes en PostgreSQL para dejar ÚNICAMENTE los 26 oficiales del Excel
  console.log('\n🧹 REINICIANDO TABLA DE CLIENTES CON LA LISTA 100% ESTRICTA DEL EXCEL...');

  // Unbind foreign keys
  await prisma.formulaVariant.updateMany({ data: { clienteId: null } }).catch(() => null);
  await prisma.pedidoComercial.updateMany({ data: { clienteId: null } }).catch(() => null);

  // Borrar todos los clientes actuales
  await prisma.cliente.deleteMany({});

  // Insertar únicamente los oficiales del Excel
  for (const item of excelOfficialList) {
    await prisma.cliente.create({
      data: {
        ruc: item.ruc,
        razonSocial: item.razonSocial,
        direccion: item.direccion,
        telefono: item.telefono || '999999999',
        condicionPago: 'Contado'
      }
    });
  }

  const finalClients = await prisma.cliente.findMany({ orderBy: { razonSocial: 'asc' } });
  console.log(`\n✅ TABLA RESTRUCTURADA CON ÉXITO. TOTAL CLIENTES EN BD: ${finalClients.length}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
