const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public'
    }
  }
});

async function main() {
  const ordenes = await prisma.ordenProduccion.findMany({ select: { clienteNombre: true } });
  const pedidos = await prisma.pedidoComercial.findMany({ select: { clienteNombre: true, clienteRuc: true, contactoNombre: true } });

  const clientesEnOrdenes = [...new Set(ordenes.map(o => o.clienteNombre).filter(Boolean))];
  const clientesEnPedidos = [...new Set(pedidos.map(p => p.clienteNombre).filter(Boolean))];
  const contactosEnPedidos = [...new Set(pedidos.map(p => p.contactoNombre).filter(Boolean))];

  console.log('📌 CLIENTES QUE APARECEN EN ÓRDENES DE PRODUCCIÓN EN BD:');
  clientesEnOrdenes.forEach(c => console.log(`   - ${c}`));

  console.log('\n📌 CLIENTES QUE APARECEN EN PEDIDOS COMERCIALES EN BD:');
  clientesEnPedidos.forEach(c => console.log(`   - ${c}`));

  console.log('\n📌 CONTACTOS QUE APARECEN EN PEDIDOS COMERCIALES EN BD:');
  contactosEnPedidos.forEach(c => console.log(`   - ${c}`));

  await prisma.$disconnect();
}

main().catch(err => console.error(err));
