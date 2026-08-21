const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public'
    }
  }
});

// Estructura Jerárquica Oficial (26 Empresas y sus Representantes/Contactos)
const CLIENTES_JERARQUICOS = [
  {
    razonSocial: 'ALFALION INVESTMENT SAC',
    ruc: '20612434124',
    telefono: '944245458',
    direccion: 'CALLE MOCHICAS 175 - SAN MIGUEL',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Miguel Marcos', cargo: 'Dueño 1', telefono: '944245458', esPrincipal: true },
      { nombre: 'Daniel Espinoza', cargo: 'Dueño 2', telefono: '937283433', esPrincipal: false },
      { nombre: 'Miguel Enriquez', cargo: 'Supervisión', telefono: '955361128', esPrincipal: false },
      { nombre: 'Angie', cargo: 'Pedidos', telefono: '944245458', esPrincipal: false }
    ]
  },
  {
    razonSocial: 'ALONSO CHUNGA',
    ruc: '20438552976',
    telefono: '987654321',
    direccion: 'AV. PRINCIPAL 123 - LIMA',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Alonso Chunga', cargo: 'Dueño', telefono: '987654321', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'ANGIE CHAVEZ',
    ruc: '20703179024',
    telefono: '912345678',
    direccion: 'JR JUPITER MZ F LOTE 24 - SMP',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Angie Cruz', cargo: 'Representante', telefono: '912345678', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'BRYAN FIESTAS',
    ruc: '20521367750',
    telefono: '998877665',
    direccion: 'AV. PERÚ 456 - LIMA',
    metodoEnvio: 'MOVILIDAD PROPIA',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Bryan Fiestas', cargo: 'Dueño', telefono: '998877665', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'DANIEL MEZA',
    ruc: '20746046740',
    telefono: '955112233',
    direccion: 'BODEGA - YUVA - ATE',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Daniel Meza', cargo: 'Dueño', telefono: '955112233', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'DAVID SARMIENTO',
    ruc: '20855870362',
    telefono: '944332211',
    direccion: 'AV. AREQUIPA 789 - LIMA',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'David Sarmiento', cargo: 'Dueño', telefono: '944332211', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'EDSON ÑAUPARI',
    ruc: '20433002256',
    telefono: '933445566',
    direccion: 'AV. PACTO ANDINO 684 - VILLA EL SALVADOR',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Edson Ñaupari', cargo: 'Dueño', telefono: '933445566', esPrincipal: true },
      { nombre: 'Luz', cargo: 'Asistente Compras', telefono: '933445567', esPrincipal: false }
    ]
  },
  {
    razonSocial: 'ERICK CHAVEZ',
    ruc: '20295395505',
    telefono: '922334455',
    direccion: 'MZ B LOTE 28 URB CABO LINARES - SMP',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Erick Chavez', cargo: 'Dueño', telefono: '922334455', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'FENIX G EXPRESSN SAC',
    ruc: '20613316184',
    telefono: '911223344',
    direccion: 'AV LA PAZ 506',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Luis Marin', cargo: 'Dueño', telefono: '911223344', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'GARB CORP PERU SAC',
    ruc: '20613225995',
    telefono: '939353078',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras (Grupo San Luis)', telefono: '939353078', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'IMPORT MERAKI HOGAR SAC',
    ruc: '20614181444',
    telefono: '977889900',
    direccion: 'PJ NEPTUNO 192 - RIMAC',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Jairo Ochoa', cargo: 'Encargado Compras', telefono: '977889900', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'JHON ERIC AVILA RAMIREZ',
    ruc: '75129824',
    telefono: '966778899',
    direccion: 'AV. GRAU 321 - LIMA',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Jhon Avila', cargo: 'Dueño', telefono: '966778899', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'JHON ROBERT CCANTO PEREZ',
    ruc: '73940637',
    telefono: '955667788',
    direccion: 'AV. FERROCARRIL CON LAS CASCADAS - SANTA ANITA',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Jhon Ccanto', cargo: 'Dueño', telefono: '955667788', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'JHONATAN GARABITO SAMANIEGO',
    ruc: '10751305511',
    telefono: '939353078',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras (Grupo San Luis)', telefono: '939353078', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'JUANA VASQUEZ',
    ruc: '20579896934',
    telefono: '944556677',
    direccion: 'AV. HUARA MZ B2 LOTE 18 MI PERU - VENTANILLA',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Juana Vazques', cargo: 'Representante', telefono: '944556677', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'LEO HIDALGO',
    ruc: '20368149167',
    telefono: '933221100',
    direccion: 'AV. BRASIL 550 - LIMA',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Leo Hidalgo', cargo: 'Dueño', telefono: '933221100', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'LUCIAALEXANDRA SERNAQUE BAYONA',
    ruc: '10719389533',
    telefono: '939353078',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras (Grupo San Luis)', telefono: '939353078', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'LUIS JURADO',
    ruc: '20261741720',
    telefono: '922110099',
    direccion: 'CALLE PADRE IZAGUIRRE 290 - RIMAC',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Luis Jurado', cargo: 'Dueño', telefono: '922110099', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'MARLEX',
    ruc: '20764031495',
    telefono: '911009988',
    direccion: 'AV. COLÓN 100 - LIMA',
    metodoEnvio: 'MOVILIDAD PROPIA',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Katherin', cargo: 'Jefa de Compras', telefono: '911009988', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'MULTIPLAZA PERU S.A.C.',
    ruc: '20611510315',
    telefono: '939353078',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Encargada de Compras', telefono: '939353078', esPrincipal: true },
      { nombre: 'Luis G.', cargo: 'Representante Logística', telefono: '939353079', esPrincipal: false }
    ]
  },
  {
    razonSocial: 'NEXARA CORP SAC',
    ruc: '20615778207',
    telefono: '988776655',
    direccion: 'URB. SANTA MARINA DEL PINAR MZA. B LOTE 04 - PIURA',
    metodoEnvio: 'SHALOM',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Nicol', cargo: 'Jefa de Compras', telefono: '988776655', esPrincipal: true },
      { nombre: 'Recepcion Shalom Piura', cargo: 'Despacho Provincia', telefono: '988776656', esPrincipal: false }
    ]
  },
  {
    razonSocial: 'RENZO',
    ruc: '70042804',
    telefono: '977665544',
    direccion: 'CALLE SANTA MARIA AL FRENTE DE LA LOZA DEPORTIVA - SANTA ANITA',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Renzo', cargo: 'Dueño', telefono: '977665544', esPrincipal: true },
      { nombre: 'Laura', cargo: 'Asistente de Pedidos', telefono: '977665545', esPrincipal: false },
      { nombre: 'Roberto', cargo: 'Recepción Almacén', telefono: '977665546', esPrincipal: false }
    ]
  },
  {
    razonSocial: 'RORY ALFREDO SERPA FLORES',
    ruc: '48558440',
    telefono: '966554433',
    direccion: 'AV MICHEL FORT 172 - SMP',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Austin Santos', cargo: 'Representante', telefono: '966554433', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'SHOPPERANG GROUP S.A.C.',
    ruc: '20614915189',
    telefono: '939353078',
    direccion: 'AV. CANADA 3721 - SAN LUIS',
    metodoEnvio: 'SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Geyma Novillo', cargo: 'Compras (Grupo San Luis)', telefono: '939353078', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'STARHOME PERU SAC',
    ruc: '20612436062',
    telefono: '955443322',
    direccion: 'JR JORGE CHAVEZ 460 URB. CHACRA COLORADA - BREÑA',
    metodoEnvio: 'INDRIVER Y SR CESAR',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Daniel Espinoza', cargo: 'Dueño / Gerente', telefono: '955443322', esPrincipal: true }
    ]
  },
  {
    razonSocial: 'TAINTY CORPORACION',
    ruc: '20531182893',
    telefono: '944332211',
    direccion: 'AV. LA ALBORADA 550 - PUEBLO LIBRE',
    metodoEnvio: 'INDRIVER',
    condicionPago: 'Contado',
    contactos: [
      { nombre: 'Carlos Esparza', cargo: 'Dueño / Compras', telefono: '944332211', esPrincipal: true }
    ]
  }
];

async function seedJerarquico() {
  console.log('🔄 Iniciando sembrado jerárquico 1:N (Empresas y Representantes)...');

  // Limpiar primero contactos existentes
  await prisma.contactoRepresentante.deleteMany();

  for (const empData of CLIENTES_JERARQUICOS) {
    const { contactos, ...empresaFields } = empData;

    // Buscar si ya existe la empresa por RUC
    const existing = await prisma.cliente.findUnique({ where: { ruc: empresaFields.ruc } });

    let cliente;
    if (existing) {
      cliente = await prisma.cliente.update({
        where: { id: existing.id },
        data: {
          razonSocial: empresaFields.razonSocial,
          telefono: empresaFields.telefono,
          direccion: empresaFields.direccion,
          metodoEnvio: empresaFields.metodoEnvio,
          condicionPago: empresaFields.condicionPago,
          contacto: contactos.find(c => c.esPrincipal)?.nombre || contactos[0]?.nombre || null
        }
      });
    } else {
      cliente = await prisma.cliente.create({
        data: {
          ...empresaFields,
          contacto: contactos.find(c => c.esPrincipal)?.nombre || contactos[0]?.nombre || null
        }
      });
    }

    // Crear sus contactos anidados
    for (const c of contactos) {
      await prisma.contactoRepresentante.create({
        data: {
          clienteId: cliente.id,
          nombre: c.nombre,
          cargo: c.cargo,
          telefono: c.telefono,
          esPrincipal: c.esPrincipal
        }
      });
    }
  }

  const totalEmpresas = await prisma.cliente.count();
  const totalContactos = await prisma.contactoRepresentante.count();
  console.log(`\n✅ MIGRACIÓN EXITOSA:`);
  console.log(`🏢 Total Empresas / RUCs en BD: ${totalEmpresas}`);
  console.log(`👤 Total Contactos y Representantes vinculados (1:N): ${totalContactos}`);

  await prisma.$disconnect();
}

seedJerarquico().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
