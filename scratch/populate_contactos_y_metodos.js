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
  console.log('🚀 POBLANDO CONTACTOS, DUEÑOS Y MÉTODOS DE ENVÍO...');

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['DATA PROVEEDORES'];
  const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  for (let i = 2; i < jsonRows.length; i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0) continue;

    const rucRaw = row[1] ? row[1].toString().trim() : '';
    const clienteNombreRaw = row[2] ? row[2].toString().trim() : '';
    const direccionRaw = row[3] ? row[3].toString().trim() : '';
    const contactoRaw = row[4] ? row[4].toString().trim() : '';
    const telefonoRaw = row[5] ? row[5].toString().trim() : '';
    const metodoEnvioRaw = row[6] ? row[6].toString().trim() : '';

    if (clienteNombreRaw) {
      const rucClean = rucRaw.replace(/[^0-9]/g, '');
      const razonSocial = clienteNombreRaw.trim().toUpperCase();

      const existing = await prisma.cliente.findFirst({
        where: {
          OR: [
            ...(rucClean ? [{ ruc: rucClean }] : []),
            { razonSocial: { equals: razonSocial, mode: 'insensitive' } }
          ]
        }
      });

      if (existing) {
        await prisma.cliente.update({
          where: { id: existing.id },
          data: {
            contacto: contactoRaw || existing.contacto || null,
            metodoEnvio: metodoEnvioRaw || existing.metodoEnvio || null,
            telefono: telefonoRaw ? telefonoRaw.replace(/[^0-9]/g, '') : existing.telefono,
            direccion: direccionRaw || existing.direccion
          }
        });
        console.log(`✅ Actualizado: ${razonSocial} | Contacto: ${contactoRaw || 'N/A'} | Envío: ${metodoEnvioRaw || 'N/A'}`);
      }
    }
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
