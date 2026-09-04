import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MasterClientDef {
  codigo: string;
  razonSocial: string;
  ruc: string;
  direccion?: string;
  metodoEnvio?: string;
  condicionPago?: string;
  contactos: {
    nombre: string;
    cargo: string;
    telefono?: string;
    esPrincipal: boolean;
  }[];
  aliasVariantes?: string[];
}

const MASTER_CLIENTES: MasterClientDef[] = [
  {
    codigo: 'CLI-001',
    razonSocial: 'ALFALION INVESTMENT S.A.C.',
    ruc: '20612434124',
    direccion: 'CALLE MOCHICAS 175 - SAN MIGUEL',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Angie', cargo: 'Pedidos', telefono: '951166256', esPrincipal: true },
      { nombre: 'Miguel Enríquez', cargo: 'Supervisión', telefono: '955361128', esPrincipal: false },
      { nombre: 'Miguel Marcos', cargo: 'Dueño 1', telefono: '944245458', esPrincipal: false },
      { nombre: 'Daniel Espinoza', cargo: 'Dueño 2', telefono: '937283433', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-ALFALION'],
  },
  {
    codigo: 'CLI-002',
    razonSocial: 'FENIX G EXPRESS S.A.C.',
    ruc: '20613316184',
    direccion: 'AV LA PAZ 506',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Credito 07 dias',
    contactos: [
      { nombre: 'Luis Marín', cargo: 'Dueño', telefono: '949348085', esPrincipal: true },
      { nombre: 'Jhosep', cargo: 'Asistente', telefono: '912195363', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-LUIS_MARIN'],
  },
  {
    codigo: 'CLI-003',
    razonSocial: 'IMPORT MERAKI HOGAR S.A.C.',
    ruc: '20614181444',
    direccion: 'PJ NEPTUNO 192 - RIMAC',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Jairo Ochoa', cargo: 'Titular / Compras', telefono: '948124738', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-JAIRO_OCHOA'],
  },
  // --- GRUPO GEYMA NOVILLO (5 EMPRESAS ASOCIADAS) ---
  {
    codigo: 'CLI-004',
    razonSocial: 'MULTIPLAZA PERU S.A.C.',
    ruc: '20611510315',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras', telefono: '939353078', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-GEYMA___LUIS_G'],
  },
  {
    codigo: 'CLI-005',
    razonSocial: 'SHOPPERANG GROUP S.A.C.',
    ruc: '20614915189',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras', telefono: '939353078', esPrincipal: true },
    ],
  },
  {
    codigo: 'CLI-006',
    razonSocial: 'LUCIAALEXANDRA SERNAQUE BAYONA',
    ruc: '10719389533',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras', telefono: '939353078', esPrincipal: true },
    ],
  },
  {
    codigo: 'CLI-007',
    razonSocial: 'GARABITO SAMANIEGO JONATAN MARTIN',
    ruc: '10751305511',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Credito 07 dias',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras', telefono: '939353078', esPrincipal: true },
    ],
  },
  {
    codigo: 'CLI-008',
    razonSocial: 'GARB CORP PERU S.A.C.',
    ruc: '20613225995',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Credito 15 dias',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras', telefono: '939353078', esPrincipal: true },
    ],
  },
  // ----------------------------------------------------
  {
    codigo: 'CLI-009',
    razonSocial: 'JHON ROBERT CCANTO PEREZ',
    ruc: '73940637',
    direccion: 'AV. FERROCARRIL CON LAS CASCADAS (DELIFRUT,WAFFLES, CREPES Y JUGOS) - SANTA ANITA',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Credito 07 dias',
    contactos: [
      { nombre: 'Jhon Ccanto', cargo: 'Titular', telefono: '910425618', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-JHON_CANTO'],
  },
  {
    codigo: 'CLI-010',
    razonSocial: 'DANIEL MEZA',
    ruc: 'CLI-010',
    direccion: 'BODEGA - YUVA - ATE',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Daniel Meza', cargo: 'Dueño', telefono: '994663345', esPrincipal: true },
      { nombre: 'Alexis', cargo: 'Asistente', telefono: '955475499', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-DANIEL_MEZA'],
  },
  {
    codigo: 'CLI-011',
    razonSocial: 'DAVID JUNIOR SARMIENTO CARDENAS',
    ruc: '77231684',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'David Sarmiento', cargo: 'Titular', telefono: '900955714', esPrincipal: true },
      { nombre: 'Diego', cargo: 'Asistente', telefono: '972645769', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-DAVID_SARMIENTO'],
  },
  {
    codigo: 'CLI-012',
    razonSocial: 'RORY ALFREDO SERPA FLORES',
    ruc: '48558440',
    direccion: 'AV MICHEL FORT 172 - SMP',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Austin Santos', cargo: 'Titular / Compras', telefono: '965371878', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-AUSTIN_SANTOS'],
  },
  {
    codigo: 'CLI-013',
    razonSocial: 'NEXARA CORP S.A.C.',
    ruc: '20615778207',
    direccion: 'URB. SANTA MARINA DEL PINAR 4 E MZA. B LOTE 04 - PIURA',
    metodoEnvio: 'SHALOM',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Nicol', cargo: 'Compras', telefono: '950186349', esPrincipal: true },
      { nombre: 'José Gerardo', cargo: 'Dueño', telefono: '947602825', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-NEXARA_SAC'],
  },
  {
    codigo: 'CLI-014',
    razonSocial: 'JHON ERIC AVILA RAMIREZ',
    ruc: '75129824',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Jhon Ávila', cargo: 'Titular', telefono: '999999999', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-JHON_AVILA'],
  },
  {
    codigo: 'CLI-015',
    razonSocial: 'BRYAN FIESTAS',
    ruc: 'CLI-015',
    direccion: 'Lima, Perú',
    metodoEnvio: 'MOVILIDAD PROPIA',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Bryan Fiestas', cargo: 'Titular', telefono: '945741365', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-FIESTAS'],
  },
  {
    codigo: 'CLI-016',
    razonSocial: 'RENZO MARCELO SALSAVILCA ESTRADA',
    ruc: '70042804',
    direccion: 'CALLE SANTA MARIA AL FRENTE DE LA LOZA DEPORTIVA TG. ZAVALETA - SANTA ANITA',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Renzo Salsavilca', cargo: 'Dueño', telefono: '958483996', esPrincipal: true },
      { nombre: 'Laura', cargo: 'Asistente', telefono: '902608957', esPrincipal: false },
      { nombre: 'Roberto', cargo: 'Recepción', telefono: '952896929', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-RENZO'],
  },
  {
    codigo: 'CLI-017',
    razonSocial: 'EDSON ÑAUPARI',
    ruc: 'CLI-017',
    direccion: 'AV. PACTO ANDINO 684 - VILLA EL SALVADOR',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Edson Ñaupari', cargo: 'Titular', telefono: '943595898', esPrincipal: true },
      { nombre: 'Luz', cargo: 'Asistente', telefono: '960817853', esPrincipal: false },
    ],
    aliasVariantes: ['CLI-_AUPARI'],
  },
  {
    codigo: 'CLI-018',
    razonSocial: 'LEO HIDALGO',
    ruc: 'CLI-018',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Leo Hidalgo', cargo: 'Titular', telefono: '924091032', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-LEO_HIDALGO'],
  },
  {
    codigo: 'CLI-019',
    razonSocial: 'ALONSO CHUNGA',
    ruc: 'CLI-019',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Alonso Chunga', cargo: 'Titular', telefono: '901495303', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-ALONSO_CHUNGA'],
  },
  {
    codigo: 'CLI-020',
    razonSocial: 'ERICK CHAVEZ',
    ruc: 'CLI-020',
    direccion: 'MZ B LOTE 28 URB CABO LINARES - SMP',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Erick Chávez', cargo: 'Titular', telefono: '9958835633', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-ERICK_CHAVEZ'],
  },
  {
    codigo: 'CLI-021',
    razonSocial: 'ANGIE CRUZ (CHAVEZ)',
    ruc: 'CLI-021',
    direccion: 'JR JUPITER MZ F LOTE 24 - SMP',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Angie Cruz', cargo: 'Titular', telefono: '914727861', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-ANGIE_CRUZ'],
  },
  {
    codigo: 'CLI-022',
    razonSocial: 'MARLEX',
    ruc: 'CLI-022',
    direccion: 'Lima, Perú',
    metodoEnvio: 'MOVILIDAD PROPIA',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Katherin', cargo: 'Titular / Compras', telefono: '955282478', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-MARLEX'],
  },
  {
    codigo: 'CLI-023',
    razonSocial: 'JUANA VASQUEZ',
    ruc: 'CLI-023',
    direccion: 'AV. HUARA MZ B2 LOTE 18 MI PERU - VENTANILLA',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Juana Vásquez', cargo: 'Titular', telefono: '961273061', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-JUANA_VASQUEZ'],
  },
  {
    codigo: 'CLI-024',
    razonSocial: 'LUIS JURADO',
    ruc: 'CLI-024',
    direccion: 'CALLE PADRE IZAGUIRRE 290 -Ñ RIMAC',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Luis Jurado', cargo: 'Titular', telefono: '970368128', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-LUIS_JURADO'],
  },
  {
    codigo: 'CLI-025',
    razonSocial: 'TAINTY CORPORACION',
    ruc: 'CLI-025',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Carlos Esparza', cargo: 'Titular / Compras', telefono: '932491316', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-CARLOS_ESPARZA', 'CLI-TAINTY_CORPORAC'],
  },
  {
    codigo: 'CLI-026',
    razonSocial: 'STARHOME PERU S.A.C.',
    ruc: '20612436062',
    direccion: 'JR JORGE CHAVEZ 460 URB. CHACRA COLORADA - BREÑA',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Credito 07 dias',
    contactos: [
      { nombre: 'Daniel Espinoza', cargo: 'Dueño / Compras', telefono: '937283433', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-DANIEL_ESPINOZA'],
  },
  {
    codigo: 'CLI-027',
    razonSocial: 'GRUPO DEUS S.A.C.',
    ruc: '20612838489',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Área de Compras / Administración', cargo: 'Compras', telefono: '999999999', esPrincipal: true },
    ],
  },
  {
    codigo: 'CLI-028',
    razonSocial: 'CARLA PATRICIA RIVERA RAMOS',
    ruc: '10711935725',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Carla Rivera', cargo: 'Titular', telefono: '999999999', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-CARLA_RIVERA'],
  },
  {
    codigo: 'CLI-029',
    razonSocial: 'JUAN PABLO CASSANA RAMON',
    ruc: '42816216',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Juan Pablo Cassana', cargo: 'Titular', telefono: '999999999', esPrincipal: true },
    ],
  },
  {
    codigo: 'CLI-030',
    razonSocial: 'KELLY PEÑA',
    ruc: 'CLI-030',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Kelly Peña', cargo: 'Titular', telefono: '999999999', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-KELLY_PE_A'],
  },
  {
    codigo: 'CLI-031',
    razonSocial: 'JEAN',
    ruc: 'CLI-031',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Jean', cargo: 'Titular', telefono: '999999999', esPrincipal: true },
    ],
    aliasVariantes: ['CLI-JEAN'],
  },
  {
    codigo: 'CLI-032',
    razonSocial: 'VENTAS MOSTRADOR / BOLETAS DNI',
    ruc: '00000000',
    direccion: 'Planta / Tienda Quimicorp - Lima',
    metodoEnvio: 'ENTREGA EN PLANTA',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Atención al Cliente', cargo: 'Ventas Directas', telefono: '999999999', esPrincipal: true },
    ],
  },
  {
    codigo: 'CLI-033',
    razonSocial: 'RENZO ADRIAN AVILA GUTIERREZ',
    ruc: '72768719',
    direccion: 'Lima, Perú',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Renzo Adrián Ávila Gutiérrez', cargo: 'Titular', telefono: undefined, esPrincipal: true },
    ],
  },
];

async function seedMasterClientes() {
  console.log('================================================================');
  console.log('🏛️ SEED DEFINITIVO: 32 CLIENTES CANÓNICOS BLINDADOS — QUIMICORP');
  console.log('================================================================\n');

  // 1. Limpiar o migrar aliases y variantes de formulas a sus clientes definitivos
  for (const item of MASTER_CLIENTES) {
    console.log(`➡️ Procesando [${item.codigo}] ${item.razonSocial} (RUC: ${item.ruc})`);

    // Buscar o crear el cliente canónico
    let canonical = await prisma.cliente.findFirst({
      where: {
        OR: [
          { ruc: item.ruc },
          { razonSocial: item.razonSocial },
        ],
      },
    });

    if (!canonical) {
      canonical = await prisma.cliente.create({
        data: {
          razonSocial: item.razonSocial,
          ruc: item.ruc,
          direccion: item.direccion,
          metodoEnvio: item.metodoEnvio,
          condicionPago: item.condicionPago || 'Contado',
          telefono: item.contactos.find(c => c.esPrincipal)?.telefono || item.contactos[0]?.telefono,
          contacto: item.contactos.find(c => c.esPrincipal)?.nombre || item.contactos[0]?.nombre,
        },
      });
      console.log(`   🆕 Cliente canónico creado: ${canonical.id}`);
    } else {
      canonical = await prisma.cliente.update({
        where: { id: canonical.id },
        data: {
          razonSocial: item.razonSocial,
          ruc: item.ruc,
          direccion: item.direccion,
          metodoEnvio: item.metodoEnvio,
          condicionPago: item.condicionPago || canonical.condicionPago,
          telefono: item.contactos.find(c => c.esPrincipal)?.telefono || item.contactos[0]?.telefono,
          contacto: item.contactos.find(c => c.esPrincipal)?.nombre || item.contactos[0]?.nombre,
        },
      });
      console.log(`   🔄 Cliente canónico actualizado: ${canonical.id}`);
    }

    // 2. Re-asociar variantes si tenía aliases provisionales
    if (item.aliasVariantes && item.aliasVariantes.length > 0) {
      for (const alias of item.aliasVariantes) {
        const dummyClient = await prisma.cliente.findUnique({ where: { ruc: alias } });
        if (dummyClient && dummyClient.id !== canonical.id) {
          await prisma.formulaVariant.updateMany({
            where: { clienteId: dummyClient.id },
            data: { clienteId: canonical.id },
          });
          await prisma.cliente.delete({ where: { id: dummyClient.id } }).catch(() => {});
          console.log(`   🔀 Variantes migradas y alias [${alias}] depurado.`);
        }
      }
    }

    // 3. Crear los contactos oficiales
    await prisma.contactoRepresentante.deleteMany({
      where: { clienteId: canonical.id },
    });

    for (const cont of item.contactos) {
      await prisma.contactoRepresentante.create({
        data: {
          clienteId: canonical.id,
          nombre: cont.nombre,
          cargo: cont.cargo,
          telefono: cont.telefono,
          esPrincipal: cont.esPrincipal,
        },
      });
    }
  }

  // 4. Depurar clientes residuales que no estén en el catálogo de los 32
  const allowedRucs = MASTER_CLIENTES.map(c => c.ruc);
  const leftoverClients = await prisma.cliente.findMany({
    where: {
      ruc: { notIn: allowedRucs },
    },
    include: { variantes: true, cuentasCobrar: true },
  });

  console.log(`\n🧹 Depurando ${leftoverClients.length} registros no autorizados / fantasmas...`);
  for (const leftover of leftoverClients) {
    if (leftover.cuentasCobrar.length === 0) {
      await prisma.formulaVariant.updateMany({
        where: { clienteId: leftover.id },
        data: { clienteId: null },
      });
      await prisma.contactoRepresentante.deleteMany({ where: { clienteId: leftover.id } });
      await prisma.cliente.delete({ where: { id: leftover.id } });
      console.log(`   🗑️ Registro fantasma eliminado: [${leftover.razonSocial}] (${leftover.ruc})`);
    } else {
      console.log(`   ⚠️ Cliente [${leftover.razonSocial}] mantenido porque tiene cuentas por cobrar activas.`);
    }
  }

  // 5. Estadísticas Finales
  const totalFinal = await prisma.cliente.count();
  const totalContactos = await prisma.contactoRepresentante.count();
  const totalVariantes = await prisma.formulaVariant.count();
  const totalCobranzas = await prisma.cuentaCobrar.count();

  console.log('\n================================================================');
  console.log('🏁 CATÁLOGO DE CLIENTES 100% CANÓNICO, BLINDADO Y SIN DUPLICADOS');
  console.log(`👥 Total Clientes Oficiales: ${totalFinal}`);
  console.log(`📞 Total Contactos / Celulares: ${totalContactos}`);
  console.log(`🧪 Total Fórmulas Variantes: ${totalVariantes}`);
  console.log(`💰 Total Cuentas por Cobrar: ${totalCobranzas}`);
  console.log('================================================================\n');
}

seedMasterClientes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
