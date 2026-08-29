import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function cleanRuc(rawRuc: string, fallbackName: string): string {
  let ruc = (rawRuc || '').trim();
  if (ruc.includes('E10') || ruc.includes('e10')) {
    try {
      ruc = String(Math.round(parseFloat(ruc)));
    } catch {
      ruc = ruc.replace(/[^0-9]/g, '');
    }
  }
  ruc = ruc.replace(/\.0$/, '').replace(/[^0-9]/g, '');
  if (!ruc || ruc.length < 8) {
    // Generar RUC/DNI único basado en nombre si está vacío
    const hash = Math.abs(
      fallbackName.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0),
    );
    return `CLI-${String(hash).substring(0, 8)}`;
  }
  return ruc;
}

async function main() {
  console.log('--- Sincronizando Cartera 360° con Cobranzas y Clientes ---');

  const dataPath = path.resolve(__dirname, '../../../frontend/lib/cobranzasRealData.ts');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');

  const match = fileContent.match(/export const COBRANZAS_EXCEL_SEED: CuentaCobrarItem\[\] = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('No se encontró COBRANZAS_EXCEL_SEED');

  const items = JSON.parse(match[1]);

  // 1. Extraer todos los clientes únicos del Excel
  const clientesMap = new Map<string, { razonSocial: string; ruc: string; condicion: string }>();

  for (const item of items) {
    const nombre = (item.clienteNombre || '').trim();
    if (!nombre) continue;
    const ruc = cleanRuc(item.clienteRuc, nombre);

    if (!clientesMap.has(ruc)) {
      clientesMap.set(ruc, {
        razonSocial: nombre,
        ruc,
        condicion: item.condicionPago || 'Contado',
      });
    }
  }

  console.log(`Total clientes identificados en el Excel de Cobranzas: ${clientesMap.size}`);

  // 2. Upsert clientes en tabla 'clientes'
  const rucToClientId = new Map<string, string>();

  for (const [ruc, data] of clientesMap.entries()) {
    const existing = await prisma.cliente.findUnique({
      where: { ruc },
    });

    if (existing) {
      rucToClientId.set(ruc, existing.id);
    } else {
      const created = await prisma.cliente.create({
        data: {
          razonSocial: data.razonSocial,
          ruc: data.ruc,
          condicionPago: data.condicion,
          direccion: 'Lima, Perú',
          contacto: 'Área de Compras / Administración',
        },
      });
      rucToClientId.set(ruc, created.id);
      console.log(`+ Cliente creado en Cartera 360°: ${data.razonSocial} (RUC: ${data.ruc})`);
    }
  }

  // 3. Re-sincronizar cuentas_cobrar con sus clienteId
  let actualizadas = 0;
  for (const item of items) {
    const nombre = (item.clienteNombre || '').trim();
    if (!nombre) continue;
    const ruc = cleanRuc(item.clienteRuc, nombre);
    const clienteId = rucToClientId.get(ruc) || null;

    const fEmision = new Date(item.fechaEmision);
    const fVenc = new Date(item.fechaVencimiento);
    const fPago = item.fechaPago ? new Date(item.fechaPago) : null;

    await prisma.cuentaCobrar.upsert({
      where: { codigoDoc: item.codigoDoc },
      create: {
        codigoDoc: item.codigoDoc,
        clienteId,
        clienteNombre: nombre,
        clienteRuc: ruc,
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
      update: {
        clienteId,
        clienteNombre: nombre,
        clienteRuc: ruc,
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
    actualizadas++;
  }

  console.log(`✅ Sincronización completa: ${actualizadas} cuentas por cobrar vinculadas 100% a la Cartera de Clientes.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
