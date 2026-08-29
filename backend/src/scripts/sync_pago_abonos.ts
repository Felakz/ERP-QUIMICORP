import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Sincronizando Pagos y Abonos Reales en PostgreSQL ---');

  const cuentas = await prisma.cuentaCobrar.findMany({
    include: { pagos: true },
  });

  let creados = 0;
  let existentes = 0;

  for (const cc of cuentas) {
    const total = Number(cc.montoTotal) || 0;
    const saldo = Number(cc.saldoPendiente) || 0;
    const pagado = total - saldo;

    // Si tiene saldo abonado o pagado (> 0)
    if (pagado > 0) {
      if (cc.pagos && cc.pagos.length > 0) {
        existentes++;
        continue;
      }

      const fechaAbono = cc.fechaPago || cc.fechaEmision;
      const medio = cc.medioPago || 'Deposito en cuenta';
      const banco = cc.canalBanco || 'Interbank';
      const numOperacion = `DEP-${cc.codigoDoc.replace(/[^0-9]/g, '') || cc.id.substring(0, 6)}`;

      await prisma.pagoAbono.create({
        data: {
          cuentaCobrarId: cc.id,
          montoAbonado: pagado,
          fechaAbono: fechaAbono,
          medio: medio,
          banco: banco,
          numOperacion: numOperacion,
          observaciones: `Abono conciliado histórico registrado automáticamente para comprobante ${cc.codigoDoc}`,
        },
      });

      creados++;
    }
  }

  const totalAbonos = await prisma.pagoAbono.count();
  const sumaAbonos = await prisma.pagoAbono.aggregate({
    _sum: { montoAbonado: true },
  });

  console.log(`✅ Abonos procesados: ${creados} nuevos creados, ${existentes} ya existentes.`);
  console.log(`📊 Total movimientos en tabla 'pagos_abonos': ${totalAbonos}`);
  console.log(`💰 Monto total recaudado y conciliado en BD: S/ ${Number(sumaAbonos._sum.montoAbonado || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
