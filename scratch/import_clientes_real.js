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
  console.log('🚀 IMPORTANDO CARTERA OFICIAL DE CLIENTES QUIMICORP PERÚ S.A.C.');
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['DATA PROVEEDORES'];
  const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  let creados = 0;
  let actualizados = 0;
  let ultimoCliente = null;

  // Empezar desde la fila 2 (índice 2) ya que la fila 1 son los encabezados
  for (let i = 2; i < jsonRows.length; i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0) continue;

    const num = row[0] ? row[0].toString().trim() : '';
    const rucRaw = row[1] ? row[1].toString().trim() : '';
    const clienteNombreRaw = row[2] ? row[2].toString().trim() : '';
    const direccionRaw = row[3] ? row[3].toString().trim() : '';
    const contactoRaw = row[4] ? row[4].toString().trim() : '';
    const telefonoRaw = row[5] ? row[5].toString().trim() : '';

    if (clienteNombreRaw) {
      const razonSocial = clienteNombreRaw.toUpperCase();
      const ruc = rucRaw ? rucRaw.replace(/[^0-9]/g, '') : `20${Math.floor(100000000 + Math.random() * 900000000)}`;
      const telefono = telefonoRaw ? telefonoRaw.replace(/[^0-9]/g, '') : '999999999';
      const direccion = direccionRaw || null;

      // Buscar si el cliente ya existe por RUC o Razón Social aproximada
      let existing = await prisma.cliente.findFirst({
        where: {
          OR: [
            { ruc: ruc },
            { razonSocial: { equals: razonSocial, mode: 'insensitive' } }
          ]
        }
      });

      if (existing) {
        await prisma.cliente.update({
          where: { id: existing.id },
          data: {
            razonSocial,
            ruc,
            telefono: telefono !== '999999999' ? telefono : existing.telefono,
            direccion: direccion || existing.direccion,
            condicionPago: existing.condicionPago || 'Contado'
          }
        });
        actualizados++;
        ultimoCliente = existing.id;
      } else {
        const nuevo = await prisma.cliente.create({
          data: {
            razonSocial,
            ruc,
            telefono,
            direccion,
            condicionPago: 'Contado'
          }
        });
        creados++;
        ultimoCliente = nuevo.id;
      }
    }
  }

  const total = await prisma.cliente.count();
  console.log(`\n✅ CLIENTES OFICIALES IMPORTADOS EXITOSAMENTE:`);
  console.log(`   - Nuevos Creados: ${creados}`);
  console.log(`   - Registros Actualizados: ${actualizados}`);
  console.log(`   - Total Clientes en Base de Datos: ${total}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error importando cartera oficial:', err);
  prisma.$disconnect();
});
