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
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['DATA PROVEEDORES'];
  const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const excelClients = [];
  for (let i = 2; i < jsonRows.length; i++) {
    const row = jsonRows[i];
    if (!row || row.length === 0) continue;
    const rucRaw = row[1] ? row[1].toString().trim() : '';
    const clienteNombreRaw = row[2] ? row[2].toString().trim() : '';
    const contactoRaw = row[4] ? row[4].toString().trim() : '';

    if (clienteNombreRaw) {
      excelClients.push({
        ruc: rucRaw.replace(/[^0-9]/g, ''),
        empresa: clienteNombreRaw.trim().toUpperCase(),
        contacto: contactoRaw ? contactoRaw.trim().toUpperCase() : 'NO ESPECIFICADO'
      });
    }
  }

  // Obtener fórmulas y variantes registradas en la BD
  const dbFormulas = await prisma.formulaMaster.findMany({
    include: {
      variants: {
        include: { cliente: true }
      }
    }
  });

  const formulaVariantsList = [];
  dbFormulas.forEach(f => {
    f.variants.forEach(v => {
      formulaVariantsList.push({
        formulaCodigo: f.codigoFormula,
        formulaNombre: f.nombreProducto,
        varianteNombre: v.nombre,
        clienteAsociado: v.cliente ? v.cliente.razonSocial : (v.notas || 'Sin Cliente Asociado')
      });
    });
  });

  console.log('=== LISTA DE CLIENTES DEL EXCEL ===');
  excelClients.forEach((item, idx) => {
    console.log(`${idx + 1}. [RUC: ${item.ruc || 'S/N'}] ${item.empresa} (Contacto: ${item.contacto})`);
  });

  console.log('\n=== LISTA DE NOMBRES Y VARIANTES PROVENIENTES DE LAS FÓRMULAS ===');
  if (formulaVariantsList.length === 0) {
    console.log('No hay variantes registradas en las fórmulas maestro.');
  } else {
    formulaVariantsList.forEach((v, idx) => {
      console.log(`${idx + 1}. Variante: "${v.varianteNombre}" | Fórmula: [${v.formulaCodigo}] ${v.formulaNombre} | Cliente/Notas: ${v.clienteAsociado}`);
    });
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
