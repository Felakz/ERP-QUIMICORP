import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const cuentas = await prisma.cuentaCobrar.findMany({
    orderBy: { fechaEmision: 'desc' },
  });

  const outData = cuentas.map((c) => ({
    id: c.id,
    codigoDoc: c.codigoDoc,
    cmo: undefined,
    clienteNombre: c.clienteNombre,
    clienteRuc: c.clienteRuc,
    producto: c.producto || undefined,
    montoTotal: Number(c.montoTotal),
    saldoPendiente: Number(c.saldoPendiente),
    condicionPago: c.condicionPago,
    diasPlazo: c.diasPlazo,
    fechaEmision: c.fechaEmision.toISOString().split('T')[0],
    fechaVencimiento: c.fechaVencimiento.toISOString().split('T')[0],
    fechaPago: c.fechaPago ? c.fechaPago.toISOString().split('T')[0] : null,
    estado: c.estado as 'PAGADO' | 'PENDIENTE' | 'VENCIDO',
    ordenProd: c.ordenProd || undefined,
    medioPago: c.medioPago || undefined,
    canalBanco: c.canalBanco || undefined,
  }));

  const outPath = path.resolve(__dirname, '../../../frontend/lib/cobranzasRealData.ts');

  let content = "export interface CuentaCobrarItem {\n";
  content += "  id: string;\n";
  content += "  codigoDoc: string;\n";
  content += "  cmo?: string;\n";
  content += "  clienteNombre: string;\n";
  content += "  clienteRuc: string;\n";
  content += "  producto?: string;\n";
  content += "  cantidad?: number;\n";
  content += "  unidadMedida?: string;\n";
  content += "  precioUnitario?: number;\n";
  content += "  montoTotal: number;\n";
  content += "  saldoPendiente: number;\n";
  content += "  condicionPago: string;\n";
  content += "  diasPlazo: number;\n";
  content += "  fechaEmision: string;\n";
  content += "  fechaVencimiento: string;\n";
  content += "  fechaPago?: string | null;\n";
  content += "  estado: 'PAGADO' | 'PENDIENTE' | 'VENCIDO';\n";
  content += "  ordenProd?: string;\n";
  content += "  medioPago?: string;\n";
  content += "  canalBanco?: string;\n";
  content += "}\n\n";
  content += "export interface CobranzasKpis {\n";
  content += "  totalFacturado: number;\n";
  content += "  totalCobrado: number;\n";
  content += "  saldoPendiente: number;\n";
  content += "  totalVencido: number;\n";
  content += "  totalDocumentos: number;\n";
  content += "}\n\n";
  content += `export const COBRANZAS_EXCEL_SEED: CuentaCobrarItem[] = ${JSON.stringify(outData, null, 2)};\n`;

  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`✅ ${outPath} actualizado con los 31 clientes y 61 cuentas limpias.`);
}

main().finally(() => prisma.$disconnect());
