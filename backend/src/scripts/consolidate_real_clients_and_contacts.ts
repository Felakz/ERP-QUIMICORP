import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

interface ExcelClientBlock {
  num?: string;
  rucOrDni?: string;
  clienteNombre?: string;
  direccion?: string;
  envio?: string;
  contactos: {
    nombre: string;
    cargo: string;
    telefono?: string;
    esPrincipal: boolean;
  }[];
}

async function consolidateClients() {
  console.log('================================================================');
  console.log('🚀 CONSOLIDACIÓN DE CLIENTES REALES Y CONTACTOS — QUIMICORP ERP');
  console.log('================================================================\n');

  // 1. Leer el Excel de Clientes
  const fs = require('fs');
  let filePath = path.resolve(__dirname, '../../../CLIENTES QUIMICORP PERU SAC (1).xlsx');
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(__dirname, '../../../../CLIENTES QUIMICORP PERU SAC (1).xlsx');
  }
  if (!fs.existsSync(filePath)) {
    filePath = '/app/clientes.xlsx';
  }
  if (!fs.existsSync(filePath)) {
    filePath = 'clientes.xlsx';
  }
  console.log(`📂 Leyendo archivo desde: ${filePath}`);
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets['DATA PROVEEDORES'];
  const rawRows = xlsx.utils.sheet_to_json<any[]>(ws, { header: 1 });

  // 2. Parsear los bloques de clientes con contactos múltiples
  const blocks: ExcelClientBlock[] = [];
  let currentBlock: ExcelClientBlock | null = null;

  for (let i = 2; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const [num, rucDni, cliente, direccion, contactoRaw, telefonoRaw, envio] = row;

    if (num || rucDni || cliente) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        num: num ? String(num).trim() : undefined,
        rucOrDni: rucDni ? String(rucDni).trim() : undefined,
        clienteNombre: cliente ? String(cliente).trim() : undefined,
        direccion: direccion ? String(direccion).trim() : undefined,
        envio: envio ? String(envio).trim() : undefined,
        contactos: [],
      };
    }

    if (contactoRaw && currentBlock) {
      const fullContactStr = String(contactoRaw).trim();
      let nombre = fullContactStr;
      let cargo = 'Representante';

      if (fullContactStr.includes('-')) {
        const parts = fullContactStr.split('-');
        nombre = parts[0].trim();
        cargo = parts.slice(1).join('-').trim();
      }

      const tel = telefonoRaw ? String(telefonoRaw).replace(/\D/g, '') : undefined;
      const esPrincipal = currentBlock.contactos.length === 0 || cargo.toLowerCase().includes('dueño') || cargo.toLowerCase().includes('compras');

      currentBlock.contactos.push({
        nombre,
        cargo,
        telefono: tel,
        esPrincipal,
      });
    }
  }
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  console.log(`📋 Total de bloques de clientes identificados en Excel: ${blocks.length}\n`);

  // 3. Mapeo Canónico de Unificación (Slug Dummy -> RUC / Razón Social Canónica)
  const mergeAliases: Record<string, string> = {
    // Slug Dummy de Receta -> RUC Canónico Real
    'CLI-CARLA_RIVERA': '10711935725',
    'CLI-DAVID_SARMIENTO': '77231684',
    'CLI-JHON_CANTO': '73940637',
    'CLI-JHON_AVILA': '75129824',
    'CLI-RENZO': '70042804',
    'CLI-NEXARA_SAC': '20615778207',
    'CLI-ALFALION': '20612434124',
    'CLI-DANIEL_ESPINOZA': '20612436062', // STARHOME
    'CLI-JAIRO_OCHOA': '20614181444',    // IMPORT MERAKI
    'CLI-LUIS_MARIN': '20613316184',     // FENIX G EXPRESS
    'CLI-GEYMA___LUIS_G': '20611510315', // MULTIPLAZA
    'CLI-AUSTIN_SANTOS': '48558440',     // RORY ALFREDO SERPA
  };

  // Mapeo por coincidencia de texto para los que no tienen RUC en Excel
  const directNameMatches: Record<string, string> = {
    'DANIEL MEZA': 'CLI-DANIEL_MEZA',
    'BRYAN FIESTAS': 'CLI-FIESTAS',
    'EDSON ÑAUPARI': 'CLI-_AUPARI',
    'LEO HIDALGO': 'CLI-LEO_HIDALGO',
    'ALONSO CHUNGA': 'CLI-ALONSO_CHUNGA',
    'ERICK CHAVEZ': 'CLI-ERICK_CHAVEZ',
    'ANGIE CHAVEZ': 'CLI-ANGIE_CRUZ',
  };

  // 4. Procesar y Actualizar Clientes Oficiales en DB
  for (const b of blocks) {
    console.log(`➡️ Procesando: ${b.clienteNombre} (RUC: ${b.rucOrDni || 'S/R'})`);

    // Buscar cliente existente por RUC o por Nombre
    let canonicalClient = null;

    if (b.rucOrDni) {
      canonicalClient = await prisma.cliente.findFirst({
        where: {
          OR: [
            { ruc: b.rucOrDni },
            { ruc: `CLI-${b.rucOrDni}` },
          ],
        },
      });
    }

    if (!canonicalClient && b.clienteNombre) {
      const matchSlug = directNameMatches[b.clienteNombre.toUpperCase().trim()];
      if (matchSlug) {
        canonicalClient = await prisma.cliente.findUnique({ where: { ruc: matchSlug } });
      }
      if (!canonicalClient) {
        canonicalClient = await prisma.cliente.findFirst({
          where: {
            razonSocial: { contains: b.clienteNombre, mode: 'insensitive' },
          },
        });
      }
    }

    if (canonicalClient) {
      // Actualizar datos del cliente canónico
      await prisma.cliente.update({
        where: { id: canonicalClient.id },
        data: {
          direccion: b.direccion || canonicalClient.direccion,
          metodoEnvio: b.envio || canonicalClient.metodoEnvio,
          telefono: b.contactos.find(c => c.esPrincipal)?.telefono || b.contactos[0]?.telefono || canonicalClient.telefono,
          contacto: b.contactos.find(c => c.esPrincipal)?.nombre || b.contactos[0]?.nombre || canonicalClient.contacto,
        },
      });

      // Crear / Actualizar Representantes de Contacto
      await prisma.contactoRepresentante.deleteMany({
        where: { clienteId: canonicalClient.id },
      });

      for (const cont of b.contactos) {
        await prisma.contactoRepresentante.create({
          data: {
            clienteId: canonicalClient.id,
            nombre: cont.nombre,
            cargo: cont.cargo,
            telefono: cont.telefono,
            esPrincipal: cont.esPrincipal,
          },
        });
      }
      console.log(`   ✅ Actualizado con ${b.contactos.length} contactos y logística.`);
    } else {
      // Si es un cliente nuevo no registrado
      const newRuc = b.rucOrDni || `CLI-${(b.clienteNombre || 'S_N').replace(/[^A-Z0-9]/gi, '_').toUpperCase().slice(0, 15)}`;
      const created = await prisma.cliente.create({
        data: {
          razonSocial: b.clienteNombre || 'Cliente S/N',
          ruc: newRuc,
          direccion: b.direccion,
          metodoEnvio: b.envio,
          telefono: b.contactos[0]?.telefono,
          contacto: b.contactos[0]?.nombre,
          condicionPago: 'Contado',
          contactos: {
            create: b.contactos.map(c => ({
              nombre: c.nombre,
              cargo: c.cargo,
              telefono: c.telefono,
              esPrincipal: c.esPrincipal,
            })),
          },
        },
      });
      console.log(`   🆕 Creado cliente nuevo con ID ${created.id}`);
    }
  }

  // 5. Unificar las variantes de recetas de los clientes slug duplicados hacia su entidad canónica
  console.log('\n🔄 Unificando recetas de variantes desde slugs duplicados...');
  for (const [dummySlug, canonicalRuc] of Object.entries(mergeAliases)) {
    const dummyClient = await prisma.cliente.findUnique({
      where: { ruc: dummySlug },
      include: { variantes: true },
    });

    const targetClient = await prisma.cliente.findUnique({
      where: { ruc: canonicalRuc },
    });

    if (dummyClient && targetClient && dummyClient.id !== targetClient.id) {
      if (dummyClient.variantes.length > 0) {
        console.log(`   🔀 Moviendo ${dummyClient.variantes.length} recetas de [${dummyClient.razonSocial}] -> [${targetClient.razonSocial}]`);
        await prisma.formulaVariant.updateMany({
          where: { clienteId: dummyClient.id },
          data: { clienteId: targetClient.id },
        });
      }
      // Eliminar el cliente dummy duplicado
      await prisma.cliente.delete({ where: { id: dummyClient.id } });
      console.log(`   🗑️ Registro dummy duplicado [${dummySlug}] eliminado con éxito.`);
    }
  }

  // 6. Resumen Final
  const totalFinal = await prisma.cliente.count();
  const totalContactos = await prisma.contactoRepresentante.count();
  const totalVariantes = await prisma.formulaVariant.count();
  const totalCobranzas = await prisma.cuentaCobrar.count();

  console.log('\n================================================================');
  console.log('🎉 CONSOLIDACIÓN COMPLETADA SIN DUPLICADOS');
  console.log(`👥 Total Clientes Únicos: ${totalFinal}`);
  console.log(`📞 Total Contactos / Celulares Registrados: ${totalContactos}`);
  console.log(`🧪 Total Recetas Variantes Vinculadas: ${totalVariantes}`);
  console.log(`💰 Total Cuentas por Cobrar Intactas: ${totalCobranzas}`);
  console.log('================================================================\n');
}

consolidateClients()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
