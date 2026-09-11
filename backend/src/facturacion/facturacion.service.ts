import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FacturacionService {
  constructor(private readonly prisma: PrismaService) {}

  /** Estado de pago derivado: saldo pendiente + vencimiento pasado => VENCIDO (sin job nocturno). */
  private derivarEstado(cc: any): string {
    const saldo = Number(cc.saldoPendiente) || 0;
    if (saldo > 0 && cc.fechaVencimiento && new Date(cc.fechaVencimiento) < new Date()) {
      return 'VENCIDO';
    }
    return cc.estado || 'PENDIENTE';
  }

  private diasParaVencer(cc: any): number | null {
    if (!cc.fechaVencimiento) return null;
    const venc = new Date(cc.fechaVencimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    venc.setHours(0, 0, 0, 0);
    return Math.ceil((venc.getTime() - hoy.getTime()) / 86400000);
  }

  private semaforo(dias: number | null, estado: string): string {
    if (estado === 'VENCIDO' || dias === null) return dias === null && estado !== 'VENCIDO' ? 'gris' : 'rojo';
    if (dias > 7) return 'verde';
    if (dias >= 0) return 'ambar';
    return 'rojo';
  }

  /**
   * Vista unificada de facturación: CuentaCobrar + PedidoComercial + PagoAbono + línea de crédito.
   * El vínculo con el pedido usa cc.pedidoId (comprobantes nuevos) o cc.ordenProd (legacy).
   */
  async listar(estado?: string, proximo?: string, search?: string, condicion?: string) {
    const where: any = {};
    if (estado && estado !== 'TODOS' && estado !== 'VENCIDO') where.estado = estado;

    let cuentas = await this.prisma.cuentaCobrar.findMany({
      where,
      include: {
        pagos: { orderBy: { fechaAbono: 'desc' } },
        cliente: { select: { limiteCredito: true, diasCreditoMax: true } },
      },
      orderBy: { fechaVencimiento: 'asc' },
    });

    // Join en memoria con PedidoComercial (cc.pedidoId no tiene relación declarada)
    const pedidoIds = cuentas.map((c) => c.pedidoId).filter(Boolean) as string[];
    const ordenCods = cuentas.map((c) => c.ordenProd).filter(Boolean) as string[];
    const pedidosById = new Map<string, any>();
    const pedidosByCod = new Map<string, any>();

    const [pedidosPorId, pedidosPorCod] = await Promise.all([
      pedidoIds.length
        ? this.prisma.pedidoComercial.findMany({
            where: { id: { in: pedidoIds } },
            select: { id: true, codigoOrden: true, estado: true, fechaEntrega: true },
          })
        : Promise.resolve([]),
      ordenCods.length
        ? this.prisma.pedidoComercial.findMany({
            where: { codigoOrden: { in: ordenCods } },
            select: { id: true, codigoOrden: true, estado: true, fechaEntrega: true },
          })
        : Promise.resolve([]),
    ]);
    pedidosPorId.forEach((p) => pedidosById.set(p.id, p));
    pedidosPorId.forEach((p) => {
      if (p.codigoOrden && !pedidosByCod.has(p.codigoOrden)) pedidosByCod.set(p.codigoOrden, p);
    });

    // Filtro de "por vencer en los próximos N días"
    if (proximo && proximo !== 'TODOS') {
      const dias = parseInt(proximo, 10);
      const limite = new Date();
      limite.setDate(limite.getDate() + dias);
      cuentas = cuentas.filter((c) => {
        const saldo = Number(c.saldoPendiente) || 0;
        if (saldo <= 0) return false;
        const d = this.diasParaVencer(c);
        return d !== null && d >= 0 && d <= dias;
      });
    }

    // Filtro por condición de pago (CONTADO / CRÉDITO)
    if (condicion && condicion !== 'TODOS') {
      cuentas = cuentas.filter((c) =>
        (c.condicionPago || '').toLowerCase().includes(condicion.toLowerCase()),
      );
    }

    const filas = cuentas.map((cc) => {
      const pedido = cc.pedidoId ? pedidosById.get(cc.pedidoId) : undefined;
      const fallback = pedido || (cc.ordenProd ? pedidosByCod.get(cc.ordenProd) : undefined);
      const estadoPago = this.derivarEstado(cc);
      const dias = this.diasParaVencer(cc);
      const total = Number(cc.montoTotal) || 0;
      const saldo = Number(cc.saldoPendiente) || 0;

      return {
        id: cc.id,
        codigoDoc: cc.codigoDoc,
        clienteId: cc.clienteId,
        clienteNombre: cc.clienteNombre,
        clienteRuc: cc.clienteRuc,
        ordenProd: cc.ordenProd,
        codigoPedido: fallback?.codigoOrden || cc.ordenProd || null,
        producto: cc.producto,
        montoTotal: total,
        saldoPendiente: saldo,
        pagado: total - saldo,
        condicionPago: cc.condicionPago,
        diasPlazo: cc.diasPlazo,
        medioPago: cc.medioPago,
        canalBanco: cc.canalBanco,
        emitidoPor: cc.emitidoPor,
        fechaEmision: cc.fechaEmision,
        fechaVencimiento: cc.fechaVencimiento,
        fechaEntrega: fallback?.fechaEntrega || null,
        estadoEntrega:
          fallback?.estado || (estadoPago === 'PAGADO' && saldo <= 0 ? 'ENTREGADO' : 'PENDIENTE'),
        estadoPago,
        diasParaVencer: estadoPago === 'VENCIDO' ? -Math.abs(dias || 0) : dias,
        semaforo: this.semaforo(dias, estadoPago),
        pagos: cc.pagos,
        limiteCredito: cc.cliente?.limiteCredito != null ? Number(cc.cliente.limiteCredito) : null,
        diasCreditoMax: cc.cliente?.diasCreditoMax ?? null,
      };
    });

    if (estado === 'VENCIDO') return filas.filter((f) => f.estadoPago === 'VENCIDO');

    if (search) {
      const q = search.toLowerCase();
      return filas.filter(
        (f) =>
          f.clienteNombre.toLowerCase().includes(q) ||
          f.codigoDoc.toLowerCase().includes(q) ||
          f.ordenProd?.toLowerCase().includes(q) ||
          f.clienteRuc.includes(q),
      );
    }

    return filas;
  }

  /** KPIs financieros: por cobrar, vencido, cobrado del mes, aging de cartera y medios de pago. */
  async resumen() {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [cuentas, cobradoMesAgg, mediosAgg] = await Promise.all([
      this.prisma.cuentaCobrar.findMany({
        select: {
          id: true,
          montoTotal: true,
          saldoPendiente: true,
          estado: true,
          fechaVencimiento: true,
        },
      }),
      this.prisma.pagoAbono.aggregate({
        where: { fechaAbono: { gte: inicioMes } },
        _sum: { montoAbonado: true },
      }),
      this.prisma.pagoAbono.groupBy({
        by: ['medio'],
        where: { fechaAbono: { gte: inicioMes } },
        _sum: { montoAbonado: true },
      }),
    ]);

    let totalPorCobrar = 0;
    let totalVencido = 0;
    let cantidadVencidas = 0;
    let cantidadPendientes = 0;
    let cantidadPagadas = 0;
    const aging: { label: string; valor: number }[] = [
      { label: '0-30', valor: 0 },
      { label: '31-60', valor: 0 },
      { label: '61-90', valor: 0 },
      { label: '90+', valor: 0 },
    ];

    cuentas.forEach((cc) => {
      const saldo = Number(cc.saldoPendiente) || 0;
      const estado = this.derivarEstado(cc);

      if (estado === 'PAGADO' || saldo <= 0) {
        cantidadPagadas += 1;
        return;
      }

      totalPorCobrar += saldo;
      const diasVencidos = this.diasParaVencer(cc);

      if (estado === 'VENCIDO' || (diasVencidos !== null && diasVencidos < 0)) {
        totalVencido += saldo;
        cantidadVencidas += 1;
        const d = Math.abs(diasVencidos ?? 0);
        if (d <= 30) aging[0].valor += saldo;
        else if (d <= 60) aging[1].valor += saldo;
        else if (d <= 90) aging[2].valor += saldo;
        else aging[3].valor += saldo;
      } else {
        cantidadPendientes += 1;
      }
    });

    const mediosPago = mediosAgg
      .map((m) => ({ medio: m.medio || 'Pago contado', total: Number(m._sum.montoAbonado) || 0 }))
      .sort((a, b) => b.total - a.total);

    return {
      totalPorCobrar,
      totalVencido,
      totalPendiente: totalPorCobrar - totalVencido,
      cobradoMes: Number(cobradoMesAgg._sum.montoAbonado) || 0,
      cantidadVencidas,
      cantidadPendientes,
      cantidadPagadas,
      aging,
      mediosPago,
    };
  }

  /** Datos completos para el comprobante imprimible / vista de detalle. */
  async comprobante(id: string) {
    const cc = await this.prisma.cuentaCobrar.findUnique({
      where: { id },
      include: {
        pagos: { orderBy: { fechaAbono: 'asc' } },
        cliente: true,
      },
    });
    if (!cc) throw new NotFoundException(`Comprobante ${id} no encontrado.`);

    const pedido = cc.pedidoId
      ? await this.prisma.pedidoComercial.findUnique({
          where: { id: cc.pedidoId },
          include: {
            ordenesProduccion: {
              orderBy: { createdAt: 'desc' },
              select: { codigoLote: true, estado: true, pasoProceso: true, fechaCierre: true },
            },
          },
        })
      : cc.ordenProd
        ? await this.prisma.pedidoComercial.findFirst({
            where: { codigoOrden: cc.ordenProd },
            include: {
              ordenesProduccion: {
                orderBy: { createdAt: 'desc' },
                select: { codigoLote: true, estado: true, pasoProceso: true, fechaCierre: true },
              },
            },
          })
        : null;

    const estadoPago = this.derivarEstado(cc);
    return {
      id: cc.id,
      codigoDoc: cc.codigoDoc,
      cliente: cc.cliente,
      clienteNombre: cc.clienteNombre,
      clienteRuc: cc.clienteRuc,
      direccion: cc.cliente?.direccion || null,
      producto: cc.producto,
      ordenProd: cc.ordenProd,
      codigoPedido: pedido?.codigoOrden || cc.ordenProd,
      montoTotal: Number(cc.montoTotal) || 0,
      saldoPendiente: Number(cc.saldoPendiente) || 0,
      condicionPago: cc.condicionPago,
      diasPlazo: cc.diasPlazo,
      medioPago: cc.medioPago,
      canalBanco: cc.canalBanco,
      emitidoPor: cc.emitidoPor || null,
      fechaEmision: cc.fechaEmision,
      fechaVencimiento: cc.fechaVencimiento,
      fechaEntrega: pedido?.fechaEntrega || null,
      estadoEntrega: pedido?.estado || 'PENDIENTE',
      estadoPago,
      pagos: cc.pagos.map((p) => ({
        ...p,
        montoAbonado: Number(p.montoAbonado) || 0,
      })),
      ordenesProduccion: pedido?.ordenesProduccion || [],
    };
  }
}