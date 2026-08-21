const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public'
    }
  }
});

function normalize(str) {
  if (!str) return '';
  return str.toString().trim().toUpperCase().replace(/\s+/g, ' ');
}

async function main() {
  console.log('🕵️ AUDITORÍA DE SEGURIDAD COMERCIAL: BÚSQUEDA DE CLIENTES OCULTOS O NO REGISTRADOS EN EL SISTEMA');

  // 1. Obtener la lista de los 26 clientes registrados oficialmente en la tabla `clientes`
  const clientesOficiales = await prisma.cliente.findMany();
  const oficialesSet = new Set();
  clientesOficiales.forEach(c => {
    oficialesSet.add(normalize(c.razonSocial));
    if (c.ruc) oficialesSet.add(normalize(c.ruc));
    if (c.contacto) oficialesSet.add(normalize(c.contacto));
  });

  // 2. Revisar Órdenes de Producción (`ordenes_produccion`)
  const ordenes = await prisma.ordenProduccion.findMany();
  const clientesEnOrdenes = new Map();
  ordenes.forEach(o => {
    if (o.clienteNombre) {
      const norm = normalize(o.clienteNombre);
      clientesEnOrdenes.set(norm, (clientesEnOrdenes.get(norm) || 0) + 1);
    }
  });

  // 3. Revisar Pedidos Comerciales (`pedidos_comerciales`)
  const pedidos = await prisma.pedidoComercial.findMany();
  const clientesEnPedidos = new Map();
  pedidos.forEach(p => {
    if (p.clienteNombre) {
      const norm = normalize(p.clienteNombre);
      clientesEnPedidos.set(norm, (clientesEnPedidos.get(norm) || 0) + 1);
    }
    if (p.contactoNombre) {
      const normC = normalize(p.contactoNombre);
      clientesEnPedidos.set(normC, (clientesEnPedidos.get(normC) || 0) + 1);
    }
  });

  // 4. Revisar Variantes de Fórmulas (`formula_variants`)
  const variantes = await prisma.formulaVariant.findMany();
  const clientesEnVariantes = new Map();
  variantes.forEach(v => {
    if (v.nombre) {
      const norm = normalize(v.nombre);
      clientesEnVariantes.set(norm, (clientesEnVariantes.get(norm) || 0) + 1);
    }
    if (v.notas) {
      const normN = normalize(v.notas);
      clientesEnVariantes.set(normN, (clientesEnVariantes.get(normN) || 0) + 1);
    }
  });

  console.log('\n--- 1. AUDITORÍA EN ÓRDENES DE PRODUCCIÓN ---');
  let ocultosOrdenes = 0;
  clientesEnOrdenes.forEach((count, nombre) => {
    const registrado = Array.from(oficialesSet).some(o => o.includes(nombre) || nombre.includes(o));
    if (!registrado && nombre !== 'CLIENTE QUIMICORP SAC') {
      console.log(`⚠️ ALERTA: Cliente en Orden de Producción "${nombre}" (Aparece en ${count} órdenes) -> NO ESTÁ EN EL DIRECTORIO OFICIAL DE CLIENTES!`);
      ocultosOrdenes++;
    }
  });
  if (ocultosOrdenes === 0) console.log('✅ Todas las Órdenes de Producción pertenecen a clientes registrados oficialmente.');

  console.log('\n--- 2. AUDITORÍA EN PEDIDOS COMERCIALES ---');
  let ocultosPedidos = 0;
  clientesEnPedidos.forEach((count, nombre) => {
    const registrado = Array.from(oficialesSet).some(o => o.includes(nombre) || nombre.includes(o));
    if (!registrado) {
      console.log(`⚠️ ALERTA: Cliente/Contacto en Pedido Comercial "${nombre}" (Aparece en ${count} pedidos) -> NO ESTÁ EN EL DIRECTORIO OFICIAL DE CLIENTES!`);
      ocultosPedidos++;
    }
  });
  if (ocultosPedidos === 0) console.log('✅ Todos los Pedidos Comerciales corresponden a clientes oficiales.');

  console.log('\n--- 3. AUDITORÍA EN VARIANTES Y RECETAS DE FÓRMULAS ---');
  let variantesMenciones = 0;
  clientesEnVariantes.forEach((count, nombre) => {
    // Si contiene guión o mención de cliente (ej: "CREMA - KARSELL" o "SPRAY - TRINNIDROP")
    if (nombre.includes('-') || nombre.includes('DEL') || nombre.includes('PARA')) {
      variantesMenciones++;
    }
  });
  console.log(`ℹ️ Hay ${variantesMenciones} nombres de marcas/variantes asociadas a fórmulas en catálogo.`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
