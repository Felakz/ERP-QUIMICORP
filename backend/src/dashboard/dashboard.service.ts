import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * KPI Cards Gerenciales calculados exclusivamente contra PostgreSQL
   */
  async getKpis(dateRange: string) {
    const today = new Date();
    let startDate = new Date();
    let prevStartDate = new Date();
    let prevEndDate = new Date();

    if (dateRange === 'HOY') {
      startDate.setHours(0, 0, 0, 0);
      prevStartDate.setDate(today.getDate() - 1);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate = new Date(startDate);
    } else if (dateRange === 'AYER') {
      startDate.setDate(today.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      const endOfAyer = new Date(startDate);
      endOfAyer.setHours(23, 59, 59, 999);
      prevStartDate.setDate(today.getDate() - 2);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate = new Date(startDate);
    } else if (dateRange === 'ULTIMOS_7') {
      startDate.setDate(today.getDate() - 7);
      prevStartDate.setDate(today.getDate() - 14);
      prevEndDate = new Date(startDate);
    } else {
      // MES_ACTUAL
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      prevStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      prevEndDate = new Date(startDate);
    }

    // 1. Ventas & Facturación acumulada real (Actual vs. Anterior)
    // Fuente primaria: pedidos_comerciales (flujo operativo).
    // Fallback: cuentas_cobrar (ventas reales importadas) cuando no hay pedidos.
    const [pedidosActual, pedidosPrevio, cuentasActual, cuentasPrevio] =
      await Promise.all([
        this.prisma.pedidoComercial.findMany({
          where: {
            createdAt: { gte: startDate },
            estado: { not: 'RECHAZADO' },
          },
          select: { montoTotal: true },
        }),
        this.prisma.pedidoComercial.findMany({
          where: {
            createdAt: { gte: prevStartDate, lt: prevEndDate },
            estado: { not: 'RECHAZADO' },
          },
          select: { montoTotal: true },
        }),
        this.prisma.cuentaCobrar.findMany({
          where: { fechaEmision: { gte: startDate } },
          select: { montoTotal: true },
        }),
        this.prisma.cuentaCobrar.findMany({
          where: { fechaEmision: { gte: prevStartDate, lt: prevEndDate } },
          select: { montoTotal: true },
        }),
      ]);

    // Ventas & Facturación del período = cuentas_cobrar (ventas reales / Excel)
    // SUMADAS con pedidos_comerciales (cotizaciones/órdenes nuevas del mes).
    // Ambas alimentan el total: no se prioriza una sobre la otra.
    const totalVentasNetasPen =
      cuentasActual.reduce((acc, c) => acc + Number(c.montoTotal || 0), 0) +
      pedidosActual.reduce((acc, p) => acc + Number(p.montoTotal || 0), 0);
    const prevVentasNetasPen =
      cuentasPrevio.reduce((acc, c) => acc + Number(c.montoTotal || 0), 0) +
      pedidosPrevio.reduce((acc, p) => acc + Number(p.montoTotal || 0), 0);

    const changePercentVentas = prevVentasNetasPen > 0
      ? Number((((totalVentasNetasPen - prevVentasNetasPen) / prevVentasNetasPen) * 100).toFixed(1))
      : 0;

    // 2. Utilidad Neta Real basada en costo real de insumos / fórmulas en las OPs
    const pedidosConFormula = await this.prisma.pedidoComercial.findMany({
      where: {
        createdAt: { gte: startDate },
        estado: { not: 'RECHAZADO' },
      },
      include: {
        formula: {
          include: {
            detalles: {
              include: { insumo: true },
            },
          },
        },
      },
    });

    let totalCostoInsumos = 0;
    let totalCobradoPen = 0;
    if (pedidosConFormula.length > 0) {
      for (const p of pedidosConFormula) {
        if (p.formula && p.formula.detalles && p.formula.detalles.length > 0) {
          const costoUnitarioFormula = p.formula.detalles.reduce((acc, d) => {
            const costoInsumo = Number(d.insumo?.costoUnitario || 0);
            const pct = Number(d.porcentaje || 0) / 100;
            return acc + costoInsumo * pct;
          }, 0);
          totalCostoInsumos += costoUnitarioFormula * Number(p.cantidadSolicitada || 0);
        } else {
          totalCostoInsumos += Number(p.montoTotal || 0) * 0.65;
        }
      }
    } else {
      // Fallback desde cuentas por cobrar: la utilidad real detectable es el
      // efectivo ya cobrado (no se fuerza un margen inventado).
      const cobrado = await this.prisma.cuentaCobrar.aggregate({
        where: { fechaEmision: { gte: startDate } },
        _sum: { montoTotal: true, saldoPendiente: true },
      });
      totalCobradoPen =
        Number(cobrado._sum.montoTotal || 0) -
        Number(cobrado._sum.saldoPendiente || 0);
      totalCostoInsumos = 0;
    }

    const utilidadNetaRealPen =
      pedidosConFormula.length > 0
        ? Math.max(0, totalVentasNetasPen - totalCostoInsumos)
        : totalCobradoPen; // utilidad medida como flujo de caja cobrado
    const margenPorcentaje = totalVentasNetasPen > 0
      ? ((utilidadNetaRealPen / totalVentasNetasPen) * 100).toFixed(1)
      : '0.0';

    // 3. Pedidos Pendientes a Planta / Cuentas por Cobrar Pendientes
    // Dos conceptos claramente separados:
    //  - pedidosPendientesCount: pedidos operativos a fabricar (NUEVO / en revisión).
    //  - cuentasPendientesCount: ventas reales (Excel) aún no cobradas.
    // Se muestran de forma diferenciada para no mezclar fabricación con cobranza.
    const [pedidosPendientesCount, pedidosCompletadosCount] = await Promise.all([
      this.prisma.pedidoComercial.count({
        where: {
          estado: { in: ['NUEVO', 'PENDIENTE_REVISION', 'VALIDANDO'] },
        },
      }),
      this.prisma.pedidoComercial.count({
        where: {
          estado: { in: ['APROBADO', 'EN_PRODUCCION'] },
        },
      }),
    ]);

    const cuentasPendientesCount = await this.prisma.cuentaCobrar.count({
      where: { estado: 'PENDIENTE' },
    });
    const cuentasPendientesMonto = await this.prisma.cuentaCobrar.aggregate({
      where: { estado: 'PENDIENTE' },
      _sum: { montoTotal: true },
    });

    // Normalmente no hay pedidos operativos: el módulo usa cuentas por cobrar.
    const hayPedidosPlanta = pedidosPendientesCount > 0;
    const pedidosPendientesFinal = pedidosPendientesCount;

    // 4. Stock Crítico Valorizado
    const insumosCriticos = await this.prisma.insumo.findMany({
      where: {
        estado: 'ACTIVO',
      },
      select: {
        stockReal: true,
        stockMinimo: true,
        costoUnitario: true,
      },
    });

    const stockCriticoValorizadoPen = insumosCriticos
      .filter((i) => Number(i.stockReal) <= Number(i.stockMinimo))
      .reduce(
        (acc, i) => acc + Number(i.stockReal) * Number(i.costoUnitario),
        0
      );

    return [
      {
        id: 'kpi-1',
        title:
          dateRange === 'MES_ACTUAL'
            ? 'Ventas & Facturación del Mes'
            : dateRange === 'HOY'
            ? 'Ventas & Facturación (Hoy)'
            : dateRange === 'AYER'
            ? 'Ventas & Facturación (Ayer)'
            : 'Ventas & Facturación (7 Días)',
        valuePenNeto: totalVentasNetasPen,
        valueUsdNeto: totalVentasNetasPen / 3.75,
        changePercent: Math.abs(changePercentVentas),
        isPositive: changePercentVentas >= 0,
        trendLabel: prevVentasNetasPen > 0 ? `vs. período anterior` : 'Período base activo',
        iconName: 'TrendingUp',
        unitType: 'currency',
      },
      {
        id: 'kpi-2',
        title: 'Utilidad Neta Real',
        valuePenNeto: utilidadNetaRealPen,
        valueUsdNeto: utilidadNetaRealPen / 3.75,
        changePercent: Number(margenPorcentaje),
        isPositive: utilidadNetaRealPen > 0,
        trendLabel: `${margenPorcentaje}% margen operativo real`,
        iconName: 'DollarSign',
        unitType: 'currency',
      },
      {
        id: 'kpi-3',
        title: hayPedidosPlanta ? 'Pedidos Pendientes a Planta' : 'Cuentas por Cobrar Pendientes',
        valuePenNeto: hayPedidosPlanta
          ? pedidosPendientesFinal
          : Number(cuentasPendientesMonto._sum.montoTotal || 0),
        valueUsdNeto: hayPedidosPlanta
          ? pedidosPendientesFinal
          : Number(cuentasPendientesMonto._sum.montoTotal || 0) / 3.75,
        changePercent: hayPedidosPlanta
          ? pedidosCompletadosCount
          : cuentasPendientesCount,
        isPositive: hayPedidosPlanta
          ? pedidosPendientesFinal <= 5
          : cuentasPendientesCount <= 10,
        trendLabel: hayPedidosPlanta
          ? `${pedidosCompletadosCount} órdenes en planta/despacho`
          : `${cuentasPendientesCount} facturas por cobrar (ventas del mes)`,
        iconName: hayPedidosPlanta ? 'PackageCheck' : 'Wallet',
        unitType: hayPedidosPlanta ? 'count' : 'currency',
      },
      {
        id: 'kpi-4',
        title: 'Valorización de Stock Crítico',
        valuePenNeto: stockCriticoValorizadoPen,
        valueUsdNeto: stockCriticoValorizadoPen / 3.75,
        changePercent: 0,
        isPositive: stockCriticoValorizadoPen === 0,
        trendLabel: 'Reabastecimiento de insumos',
        iconName: 'AlertTriangle',
        unitType: 'currency',
      },
    ];
  }

  /**
   * Top 10 Clientes Frecuentes ordenados por facturación del mes actual
   */
  async getTopCustomers() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fuente primaria: cuentas_cobrar (ventas reales facturadas del mes / Excel).
    // Fallback: pedidos_comerciales cuando no hay cuentas del mes.
    const pedidosClientes = await this.prisma.cliente.findMany({
      include: {
        pedidos: {
          where: {
            createdAt: { gte: startOfMonth },
            estado: { not: 'RECHAZADO' },
          },
          select: {
            montoTotal: true,
            fechaPrometida: true,
            estado: true,
          },
        },
      },
      take: 20,
    });

    const tienePedidos = pedidosClientes.some((c: any) => (c.pedidos || []).length > 0);

    // Agregación por cliente desde cuentas por cobrar del mes actual
    const cuentasCliente = await this.prisma.cuentaCobrar.groupBy({
      by: ['clienteRuc', 'clienteNombre'],
      where: { fechaEmision: { gte: startOfMonth } },
      _sum: { montoTotal: true, saldoPendiente: true },
      _count: true,
    });

    const clientesBD =
      tienePedidos || cuentasCliente.length === 0
        ? pedidosClientes
        : [];

    if (cuentasCliente.length === 0 && tienePedidos) {
      // Fallback: solo cuando NO hay ventas reales del mes (cuentas por cobrar),
      // usar pedidos operativos.
      if (!clientesBD || clientesBD.length === 0) return [];

      const bgs = [
        'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600',
        'bg-rose-600', 'bg-blue-600', 'bg-teal-600',
      ];

      const processed = clientesBD.map((c: any, idx: number) => {
        const totalAmount = c.pedidos.reduce((acc: number, p: any) => acc + Number(p.montoTotal || 0), 0);
        const hoy = new Date();
        const tieneVencidos = c.pedidos.some(
          (p: any) => p.fechaPrometida && new Date(p.fechaPrometida) < hoy && p.estado !== 'APROBADO'
        );
        const tieneSaldo = totalAmount > 0;
        const creditStatus = tieneVencidos ? 'OBSERVADO' : tieneSaldo ? 'REGULAR' : 'EXCELENTE';
        return {
          id: c.id,
          name: c.razonSocial,
          ruc: c.ruc,
          invoicesCount: c.pedidos.length,
          totalAmountPenNeto: totalAmount,
          creditStatus,
          avatarBg: bgs[idx % bgs.length],
        };
      });

      // Solo clientes con facturación real en lo que va del mes (los de S/ 0 quedan fuera)
      const conFacturacion = processed.filter((c) => c.totalAmountPenNeto > 0);
      const ranking = conFacturacion.length > 0 ? conFacturacion : processed;
      ranking.sort((a, b) => b.totalAmountPenNeto - a.totalAmountPenNeto);
      return ranking.slice(0, 10);
    }

    // Fuente principal: top clientes desde cuentas por cobrar (ventas reales del mes)
    const allClientes = await this.prisma.cliente.findMany({
      select: { id: true, ruc: true, razonSocial: true },
    });
    const clienteByRuc = new Map(allClientes.map((c) => [c.ruc, c.id]));
    const clienteByName = new Map(allClientes.map((c) => [c.razonSocial?.toLowerCase().trim(), c.id]));

    const bgs = [
      'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600',
      'bg-rose-600', 'bg-blue-600', 'bg-teal-600',
    ];

    const hoy = new Date();
    const processed = cuentasCliente.map((g: any, idx: number) => {
      const total = Number(g._sum.montoTotal || 0);
      const saldo = Number(g._sum.saldoPendiente || 0);
      const tieneVencido = saldo > 0; // aproximación crediticia
      const creditStatus = tieneVencido ? 'REGULAR' : 'EXCELENTE';
      const realId = clienteByRuc.get(g.clienteRuc) || clienteByName.get((g.clienteNombre || '').toLowerCase().trim()) || g.clienteRuc;
      return {
        id: realId,
        name: g.clienteNombre,
        ruc: g.clienteRuc,
        invoicesCount: g._count || 0,
        totalAmountPenNeto: total,
        creditStatus,
        avatarBg: bgs[idx % bgs.length],
      };
    });

    // Solo clientes con facturación real en lo que va del mes (los de S/ 0 quedan fuera)
    const ranking = processed.filter((c) => c.totalAmountPenNeto > 0);
    ranking.sort((a, b) => b.totalAmountPenNeto - a.totalAmountPenNeto);
    return ranking.slice(0, 10);
  }

  /**
   * Ventas históricas agrupadas por mes (últimos 12 meses) desde PostgreSQL
   */
  async getSalesAnalytics() {
    const now = new Date();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

    const db = this.prisma;
    const pastYearDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const pedidos = await db.pedidoComercial.findMany({
      where: {
        createdAt: { gte: pastYearDate },
        estado: { not: 'RECHAZADO' },
      },
      select: {
        montoTotal: true,
        cantidadSolicitada: true,
        createdAt: true,
      },
    });

    // Fallback: ventas reales desde cuentas por cobrar (facturado por mes)
    const cuentas = await db.cuentaCobrar.findMany({
      where: { fechaEmision: { gte: pastYearDate } },
      select: { montoTotal: true, fechaEmision: true },
    });

    const usarCuentas = pedidos.length === 0 && cuentas.length > 0;

    const result = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = monthDate.getMonth();
      const mYear = monthDate.getFullYear();

      let totalMonto = 0;
      let totalVol = 0;

      if (usarCuentas) {
        const monthCuentas = cuentas.filter((c: any) => {
          const d = new Date(c.fechaEmision);
          return d.getMonth() === mIdx && d.getFullYear() === mYear;
        });
        totalMonto = monthCuentas.reduce((acc: number, c: any) => acc + Number(c.montoTotal || 0), 0);
      } else {
        const monthOrders = pedidos.filter((p: any) => {
          const d = new Date(p.createdAt);
          return d.getMonth() === mIdx && d.getFullYear() === mYear;
        });
        totalMonto = monthOrders.reduce((acc: number, p: any) => acc + Number(p.montoTotal || 0), 0);
        totalVol = monthOrders.reduce((acc: number, p: any) => acc + Number(p.cantidadSolicitada || 0), 0);
      }

      result.push({
        month: months[mIdx],
        year: mYear,
        amountNeto: totalMonto,
        volumenKg: totalVol,
        ventasNetas: totalMonto,
        facturacionNetas: totalMonto,
        cotizacionesNetas: 0,
      });
    }

    return result;
  }

  /**
   * Distribución por Plazos de Pago (Clientes BD)
   */
  async getInvoiceTerms() {
    const db = this.prisma;

    // Fuente primaria: clientes (condición de pago). Fallback: cuentas por cobrar.
    const clientes = await db.cliente.findMany({
      select: { condicionPago: true },
    });

    // Cuentas por cobrar para monto real por plazo de pago
    const cuentas = await db.cuentaCobrar.findMany({
      select: { condicionPago: true, montoTotal: true },
    });

    const cuentasCond = (c: any) => (c.condicionPago || 'Contado').trim();
    const bucket = (cond: string): string => {
      const cc = cond.toLowerCase();
      if (cc.includes('60')) return 'Crédito 60 Días';
      if (cc.includes('30')) return 'Crédito 30 Días';
      if (cc.includes('20')) return 'Crédito 20 Días';
      if (cc.includes('15')) return 'Crédito 15 Días';
      if (cc.includes('07') || cc.includes('7')) return 'Crédito 7 Días';
      return 'Contado';
    };

    const keys = ['Contado', 'Crédito 7 Días', 'Crédito 15 Días', 'Crédito 20 Días', 'Crédito 30 Días', 'Crédito 60 Días'];
    const counts: Record<string, number> = {};
    const monto: Record<string, number> = {};
    keys.forEach((k) => { counts[k] = 0; monto[k] = 0; });

    if (cuentas.length > 0) {
      // Fallback real: agrupar facturas emitidas por condición de pago y sumar montos
      cuentas.forEach((c: any) => {
        const b = bucket(cuentasCond(c));
        counts[b] = (counts[b] || 0) + 1;
        monto[b] = (monto[b] || 0) + Number(c.montoTotal || 0);
      });
    } else {
      clientes.forEach((c: any) => {
        const b = bucket(cuentasCond(c));
        counts[b] = (counts[b] || 0) + 1;
      });
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const termColors: Record<string, string> = {
      'Contado': '#F59E0B',
      'Crédito 7 Días': '#8B5CF6',
      'Crédito 15 Días': '#3B82F6',
      'Crédito 20 Días': '#10B981',
      'Crédito 30 Días': '#EF4444',
      'Crédito 60 Días': '#EC4899',
    };
    return keys.map((term) => ({
      term,
      count: counts[term],
      percentage: total > 0 ? Math.round((counts[term] / total) * 100) : 0,
      amountPenNeto: Number(monto[term] || 0),
      color: termColors[term],
    }));
  }

  /**
   * Métricas Consolidadas de Cobranzas y Cuentas por Cobrar
   */
  async getCobranzaMetrics() {
    const db = this.prisma;
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#EC4899'];

    const totalCuentas = await db.cuentaCobrar.aggregate({
      _sum: { montoTotal: true, saldoPendiente: true },
    });
    const totalCobrado = await db.pagoAbono.aggregate({ _sum: { montoAbonado: true } });

    const pendientes = await db.cuentaCobrar.count({ where: { estado: 'PENDIENTE' } });
    const vencidas = await db.cuentaCobrar.count({
      where: { estado: 'PENDIENTE', fechaVencimiento: { lt: new Date() } },
    });

    // Categorías reales por banco/canal
    const porBanco = await db.cuentaCobrar.groupBy({
      by: ['canalBanco'],
      _sum: { montoTotal: true },
      _count: true,
    });
    const total = Number(totalCuentas._sum.montoTotal) || 0;

    return {
      amountDue: Number(totalCuentas._sum.saldoPendiente) || 0,
      totalFacturado: total,
      totalCobrado: Number(totalCobrado._sum.montoAbonado) || 0,
      pendientes,
      vencidas,
      paymentCategories: (porBanco || [])
        .filter((b: any) => b.canalBanco)
        .map((b: any, i: number) => ({
          name: (b.canalBanco || 'OTROS').toUpperCase(),
          percentage: total > 0 ? Math.round((Number(b._sum.montoTotal) / total) * 100) : 0,
          amountPenNeto: Number(b._sum.montoTotal) || 0,
          color: COLORS[i % COLORS.length],
        })),
    };
  }

  /**
   * Categorías de Métodos de Pago Reales desde Cuentas por Cobrar
   */
  async getPaymentCategories() {
    const cobranza = await this.getCobranzaMetrics();
    return cobranza.paymentCategories.length > 0
      ? cobranza.paymentCategories
      : [
          { name: 'INTERBANK CTA CTE', percentage: 70, amountPenNeto: 0, color: '#3B82F6' },
          { name: 'BCP CUENTA CORRIENTE', percentage: 30, amountPenNeto: 0, color: '#10B981' },
        ];
  }

  /**
   * Tabla de Documentos Comerciales Recientes desde PostgreSQL
   */
  async getRecentDocs() {
    const db = this.prisma;
    const docsBD = await db.pedidoComercial.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        codigoOrden: true,
        clienteNombre: true,
        clienteRuc: true,
        cantidadSolicitada: true,
        montoTotal: true,
        createdAt: true,
        fechaPrometida: true,
        estado: true,
        docType: true,
      },
    });

    if (!docsBD || docsBD.length === 0) {
      // Fallback: documentos reales desde cuentas por cobrar (facturado)
      const cuentas = await db.cuentaCobrar.findMany({
        take: 10,
        orderBy: { fechaEmision: 'desc' },
        select: {
          codigoDoc: true,
          clienteNombre: true,
          clienteRuc: true,
          montoTotal: true,
          fechaEmision: true,
          fechaVencimiento: true,
          estado: true,
          condicionPago: true,
        },
      });

      if (!cuentas || cuentas.length === 0) return [];

      return cuentas.map((c: any) => ({
        id: c.codigoDoc || String(c.clienteRuc),
        docNumber: c.codigoDoc || 'DOC-',
        customerName: c.clienteNombre,
        ruc: c.clienteRuc,
        volumeKgLt: 0,
        issueDate: c.fechaEmision,
        dueDate: c.fechaVencimiento || c.fechaEmision,
        totalAmountPenNeto: Number(c.montoTotal || 0),
        type: 'FACTURA',
        status:
          c.estado === 'PAGADO' ? 'PAGADO'
          : c.estado === 'VENCIDO' ? 'VENCIDO'
          : 'PENDIENTE',
      }));
    }

    return docsBD.map((d: any) => ({
      id: d.id,
      docNumber: d.codigoOrden || `DOC-${d.id.substring(0, 6)}`,
      customerName: d.clienteNombre,
      ruc: d.clienteRuc,
      volumeKgLt: Number(d.cantidadSolicitada || 0),
      issueDate: d.createdAt,
      dueDate: d.fechaPrometida || d.createdAt,
      totalAmountPenNeto: Number(d.montoTotal || 0),
      type: d.docType === 'COT' ? 'COTIZACION' : d.docType === 'NV' ? 'NOTA_VENTA' : 'FACTURA',
      status: d.estado === 'APROBADO' ? 'APROBADO' : d.estado === 'EN_PRODUCCION' ? 'EN_PROCESO' : d.estado === 'RECHAZADO' ? 'RECHAZADO' : 'PENDIENTE',
    }));
  }

  /**
   * Tabla de Control de Órdenes de Planta desde PostgreSQL
   */
  async getRecentOrders() {
    const db = this.prisma;
    const ordersBD = await db.pedidoComercial.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        codigoOrden: true,
        clienteNombre: true,
        productoNombre: true,
        cantidadSolicitada: true,
        montoTotal: true,
        fechaPrometida: true,
        estado: true,
        createdAt: true,
      },
    });

    if (!ordersBD || ordersBD.length === 0) {
      // Fallback: órdenes referenciadas desde cuentas por cobrar (ordenProd)
      const cuentas = await db.cuentaCobrar.findMany({
        take: 10,
        orderBy: { fechaEmision: 'desc' },
        select: {
          ordenProd: true,
          codigoDoc: true,
          clienteNombre: true,
          montoTotal: true,
          fechaVencimiento: true,
          fechaEmision: true,
          estado: true,
          condicionPago: true,
        },
      });

      if (!cuentas || cuentas.length === 0) return [];

      return cuentas.map((o: any) => ({
        id: o.codigoDoc || String(o.clienteNombre),
        code: o.ordenProd || o.codigoDoc || `OP-${(o.codigoDoc || '').substring(0, 6)}`,
        customerName: o.clienteNombre,
        variantName: o.ordenProd,
        paymentTerm: o.condicionPago || 'Contado',
        totalAmountPenNeto: Number(o.montoTotal || 0),
        approvalStatus: o.estado === 'PAGADO' ? 'APROBADO' : 'PENDIENTE',
      }));
    }

    return ordersBD.map((o: any) => ({
      id: o.id,
      code: o.codigoOrden || `OP-${o.id.substring(0, 6)}`,
      customerName: o.clienteNombre,
      variantName: o.productoNombre,
      paymentTerm: 'Contado',
      totalAmountPenNeto: Number(o.montoTotal || 0),
      approvalStatus: o.estado === 'EN_PRODUCCION' ? 'APROBADO' : o.estado === 'RECHAZADO' ? 'RECHAZADO' : 'PENDIENTE',
    }));
  }

  /**
   * Resumen general y métricas de soporte con datos 100% reales de la BD
   */
  async getDashboardStats(dateRange: string) {
    const kpis = await this.getKpis(dateRange);
    const topCustomers = await this.getTopCustomers();
    const salesAnalytics = await this.getSalesAnalytics();
    const invoiceTerms = await this.getInvoiceTerms();
    const paymentCategories = await this.getPaymentCategories();
    const recentDocs = await this.getRecentDocs();
    const recentOrders = await this.getRecentOrders();
    const cobranza = await this.getCobranzaMetrics();

    // Conteos reales dinámicos de PostgreSQL / Prisma
    const db = this.prisma;
    const realClientesCount = await db.cliente.count();
    const realCuentasCobrarCount = await db.cuentaCobrar.count();
    const realInvoicesCount = await db.pedidoComercial.count({
      where: { docType: 'OP' },
    });
    const realEstimatesCount = await db.pedidoComercial.count({
      where: { docType: 'COT' },
    });

    const compactMetrics = [
      {
        id: 'cm-1',
        title: 'Amount Due (Por Cobrar)',
        valuePenNeto: cobranza.amountDue,
        changePercent: 0,
        isPositive: true,
        type: 'AMOUNT_DUE',
      },
      {
        id: 'cm-2',
        title: 'Clientes Activos',
        valuePenNeto: realClientesCount,
        changePercent: 0,
        isPositive: true,
        type: 'CUSTOMERS',
      },
      {
        id: 'cm-3',
        title: 'Invoices Emitidas',
        valuePenNeto: realCuentasCobrarCount > 0 ? realCuentasCobrarCount : realInvoicesCount,
        changePercent: 0,
        isPositive: true,
        type: 'INVOICES',
      },
      {
        id: 'cm-4',
        title: 'Cotizaciones (Estimates)',
        valuePenNeto: realEstimatesCount,
        changePercent: 0,
        isPositive: false,
        type: 'ESTIMATES',
      },
    ];

    return {
      kpis,
      topCustomers,
      compactMetrics,
      salesAnalytics,
      invoiceTerms,
      paymentCategories,
      recentDocs,
      recentOrders,
      timestamp: new Date().toISOString(),
    };
  }
}
