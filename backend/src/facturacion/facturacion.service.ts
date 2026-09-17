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

  /** Rentabilidad & Margen: Facturado vs Cobrado vs Invertido (COGS real) vs Utilidad. */
  async rentabilidad(dateRange: string = 'MES_ACTUAL', startDateStr?: string, endDateStr?: string) {
    const start = (() => {
      const now = new Date();
      if (startDateStr && endDateStr) return new Date(`${startDateStr}T00:00:00`);
      if (dateRange === 'ESTE_ANO') return new Date(now.getFullYear(), 0, 1);
      if (dateRange === 'MES_ANTERIOR') return new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return new Date(now.getFullYear(), now.getMonth(), 1);
    })();
    const end = (() => {
      const now = new Date();
      if (startDateStr && endDateStr) return new Date(`${endDateStr}T23:59:59.999`);
      if (dateRange === 'ESTE_ANO') return new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      if (dateRange === 'MES_ANTERIOR') return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    })();
    const whereDate = { gte: start, lte: end };
    const [cuentas, pagos, pedidos] = await Promise.all([
      this.prisma.cuentaCobrar.findMany({ where: { fechaEmision: whereDate }, select: { montoTotal: true, pedidoId: true, ordenProd: true } }),
      this.prisma.pagoAbono.aggregate({ where: { fechaAbono: whereDate }, _sum: { montoAbonado: true } }),
      this.prisma.pedidoComercial.findMany({
        where: { createdAt: whereDate, estado: { not: 'RECHAZADO' } },
        include: { formula: { include: { detalles: { include: { insumo: true } } } } },
      }),
    ]);
    const facturado = cuentas.reduce((a, c) => a + Number(c.montoTotal || 0), 0);
    const cobrado = Number(pagos._sum.montoAbonado || 0);
    let invertido = 0;
    for (const p of pedidos) {
      if (p.formula?.detalles?.length) {
        const costoUnit = p.formula.detalles.reduce((acc: number, d: any) => acc + Number(d.insumo?.costoUnitario || 0) * (Number(d.porcentaje || 0) / 100), 0);
        invertido += costoUnit * Number(p.cantidadSolicitada || 0);
      } else {
        invertido += Number(p.montoTotal || 0) * 0.65;
      }
    }
    // Si no hay pedidos en el mes, estimar COGS como 65% de lo facturado
    if (pedidos.length === 0 && facturado > 0) invertido = facturado * 0.65;
    const utilidad = Math.max(0, facturado - invertido);
    const margen = facturado > 0 ? (utilidad / facturado) * 100 : 0;
    // Serie mensual últimos 12 meses para gráfico
    const now = new Date();
    const serie: any[] = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    const allCuentas = await this.prisma.cuentaCobrar.findMany({ where: { fechaEmision: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } }, select: { montoTotal: true, fechaEmision: true } });
    const allPagos = await this.prisma.pagoAbono.findMany({ where: { fechaAbono: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } }, select: { montoAbonado: true, fechaAbono: true } });
    const allPedidos = await this.prisma.pedidoComercial.findMany({
      where: { createdAt: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) }, estado: { not: 'RECHAZADO' } },
      include: { formula: { include: { detalles: { include: { insumo: true } } } } },
    });
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth(), y = d.getFullYear();
      const mc = allCuentas.filter((c: any) => new Date(c.fechaEmision).getMonth() === m && new Date(c.fechaEmision).getFullYear() === y).reduce((a: number, c: any) => a + Number(c.montoTotal || 0), 0);
      const mp = allPagos.filter((p: any) => new Date(p.fechaAbono).getMonth() === m && new Date(p.fechaAbono).getFullYear() === y).reduce((a: number, p: any) => a + Number(p.montoAbonado || 0), 0);
      const mpeds = allPedidos.filter((p: any) => new Date(p.createdAt).getMonth() === m && new Date(p.createdAt).getFullYear() === y);
      let inv = 0;
      for (const p of mpeds) {
        if (p.formula?.detalles?.length) {
          const cu = p.formula.detalles.reduce((acc: number, det: any) => acc + Number(det.insumo?.costoUnitario || 0) * (Number(det.porcentaje || 0) / 100), 0);
          inv += cu * Number(p.cantidadSolicitada || 0);
        } else inv += Number(p.montoTotal || 0) * 0.65;
      }
      const util = Math.max(0, mc - inv);
      const marg = mc > 0 ? (util / mc) * 100 : 0;
      serie.push({ month: months[m], year: y, facturado: mc, cobrado: mp, invertido: inv, utilidad: util, margen: Number(marg.toFixed(1)) });
    }
    // Tabla por cliente (top 20 por margen)
    const porCliente = await this.prisma.cuentaCobrar.groupBy({ by: ['clienteRuc', 'clienteNombre'], where: { fechaEmision: whereDate }, _sum: { montoTotal: true }, _count: true });
    const tabla = porCliente.map((g: any) => {
      const fact = Number(g._sum.montoTotal || 0);
      const inv = fact * 0.65;
      const util = Math.max(0, fact - inv);
      return { ruc: g.clienteRuc, cliente: g.clienteNombre, facturado: fact, invertido: inv, utilidad: util, margen: fact > 0 ? Number(((util / fact) * 100).toFixed(1)) : 0, docs: g._count };
    }).sort((a, b) => b.utilidad - a.utilidad).slice(0, 20);
    return { facturado, cobrado, invertido, utilidad, margen: Number(margen.toFixed(1)), serie, tabla };
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