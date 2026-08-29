import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed de Cobranzas y Cuentas por Cobrar ---');

  const dataPath = path.resolve(__dirname, '../../../frontend/lib/cobranzasRealData.ts');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');

  // Extraer JSON
  const match = fileContent.match(/export const COBRANZAS_EXCEL_SEED: CuentaCobrarItem\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error('No se pudo encontrar COBRANZAS_EXCEL_SEED en cobranzasRealData.ts');
  }

  const items = JSON.parse(match[1]);
  console.log(`Se encontraron ${items.length} registros para poblar en PostgreSQL.`);

  // Obtener mapa de clientes por RUC para vincular clienteId
  const clientes = await prisma.cliente.findMany();
  const clienteRucMap = new Map<string, string>();
  for (const c of clientes) {
    clienteRucMap.set(c.ruc.trim(), c.id);
  }

  let creados = 0;
  let actualizados = 0;

  for (const item of items) {
    const clienteId = clienteRucMap.get(item.clienteRuc.trim()) || null;
    const fEmision = new Date(item.fechaEmision);
    const fVenc = new Date(item.fechaVencimiento);
    const fPago = item.fechaPago ? new Date(item.fechaPago) : null;

    const existing = await prisma.cuentaCobrar.findUnique({
      where: { codigoDoc: item.codigoDoc },
    });

    if (existing) {
      await prisma.cuentaCobrar.update({
        where: { id: existing.id },
        data: {
          clienteId: clienteId || existing.clienteId,
          clienteNombre: item.clienteNombre,
          clienteRuc: item.clienteRuc,
          ordenProd: item.ordenProd,
          producto: item.producto,
          montoTotal: item.montoTotal,
          saldoPendiente: item.saldoPendiente,
          condicionPago: item.condicionPago,
          diasPlazo: item.diasPlazo,
          fechaEmision: fEmision,
          fechaVencimiento: fVenc,
          fechaPago: fPago,
          estado: item.estado,
          medioPago: item.medioPago,
          canalBanco: item.canalBanco,
        },
      });
      actualizados++;
    } else {
      await prisma.cuentaCobrar.create({
        data: {
          codigoDoc: item.codigoDoc,
          clienteId,
          clienteNombre: item.clienteNombre,
          clienteRuc: item.clienteRuc,
          ordenProd: item.ordenProd,
          producto: item.producto,
          montoTotal: item.montoTotal,
          saldoPendiente: item.saldoPendiente,
          condicionPago: item.condicionPago,
          diasPlazo: item.diasPlazo,
          fechaEmision: fEmision,
          fechaVencimiento: fVenc,
          fechaPago: fPago,
          estado: item.estado,
          medioPago: item.medioPago,
          canalBanco: item.canalBanco,
        },
      });
      creados++;
    }
  }

  console.log(`✅ Seed de Cobranzas finalizado con éxito.`);
  console.log(`- Nuevos registros creados: ${creados}`);
  console.log(`- Registros actualizados: ${actualizados}`);
  console.log(`- Total en base de datos: ${creados + actualizados}`);
}

main()
  .catch((e) => {
    console.error('Error al ejecutar seed de cobranzas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
