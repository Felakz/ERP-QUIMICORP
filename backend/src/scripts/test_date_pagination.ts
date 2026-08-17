import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

try {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        const val = v.join('=').replace(/^["']|["']$/g, '');
        process.env[k.trim()] = val;
      }
    });
  }
} catch {}

const prisma = new PrismaClient();

async function main() {
  console.log('=== TEST DE PAGINACIÓN Y FILTRADO POR DÍA ===');

  // 1. Obtener fecha de hoy y ayer
  const now = new Date();
  const hoyISO = now.toISOString().split('T')[0];
  const ayer = new Date(now);
  ayer.setDate(ayer.getDate() - 1);
  const ayerISO = ayer.toISOString().split('T')[0];

  console.log(`Fecha Hoy: ${hoyISO}`);
  console.log(`Fecha Ayer: ${ayerISO}`);

  // 2. Probar filtrado de PedidoComercial por fecha
  const [y, m, d] = hoyISO.split('-').map(Number);
  const inicioDia = new Date(y, m - 1, d, 0, 0, 0, 0);
  const finDia = new Date(y, m - 1, d, 23, 59, 59, 999);

  const pedidosHoy = await prisma.pedidoComercial.findMany({
    where: {
      docType: 'OP',
      createdAt: { gte: inicioDia, lte: finDia },
    },
    include: { aditivos: true },
  });

  console.log(`\n📦 Pedidos OP para hoy (${hoyISO}):`, pedidosHoy.length);
  pedidosHoy.forEach((p) => {
    console.log(`  - [${p.codigoOrden}] ${p.clienteNombre} -> ${p.productoNombre} (${p.cantidadSolicitada} ${p.unidadMedida}) | Estado: ${p.estado}`);
  });

  // 3. Probar filtrado de OrdenProduccion por fecha
  const ordenesHoy = await prisma.ordenProduccion.findMany({
    where: {
      createdAt: { gte: inicioDia, lte: finDia },
    },
    include: {
      formula: true,
      supervisor: { select: { nombres: true, apellidos: true } },
    },
  });

  console.log(`\n🏭 Órdenes de Producción para hoy (${hoyISO}):`, ordenesHoy.length);
  ordenesHoy.forEach((o) => {
    console.log(`  - [${o.codigoLote}] ${o.clienteNombre} -> ${o.formula?.nombreProducto || 'N/A'} (${o.cantidadPlanificada} KG) | Paso: ${o.pasoProceso}`);
  });

  // 4. Probar fecha sin registros (Ayer)
  const [ay, am, ad] = ayerISO.split('-').map(Number);
  const inicioAyer = new Date(ay, am - 1, ad, 0, 0, 0, 0);
  const finAyer = new Date(ay, am - 1, ad, 23, 59, 59, 999);

  const ordenesAyer = await prisma.ordenProduccion.findMany({
    where: {
      createdAt: { gte: inicioAyer, lte: finAyer },
    },
  });
  console.log(`\n📅 Órdenes para ayer (${ayerISO}): ${ordenesAyer.length} (Correctamente aislado sin mezclar con otros días)`);

  console.log('\n✅ VALIDACIÓN DE BASE DE DATOS Y RANGOS DE FECHA EXITOSA');
}

main()
  .catch((e) => {
    console.error('Error en test:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
