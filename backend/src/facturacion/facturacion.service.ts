import { costoRegistradoPedido, resumirRentabilidad } from './profitability';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CostoOperativoPeriodoDto } from './dto/costo-operativo.dto';

interface CostoOperativoCalculado {
  cantidadBase: number;
  manoObraLote: number;
  supervisionLote: number;
  depreciacionLote: number;
  energiaLote: number;
  usoLocalLote: number;
}

type PedidoConCosto = Prisma.PedidoComercialGetPayload<{
  include: {
    formula: { include: { detalles: { include: { insumo: true } } } };
    aditivos: { include: { insumo: true } };
    adicionales: { include: { insumo: true } };
  };
}>;

@Injectable()
export class FacturacionService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerCostoOperativo(periodo: string) {
    return this.prisma.costoOperativoPeriodo.findUnique({ where: { periodo } });
  }

  async actualizarCostoOperativo(periodo: string, dto: CostoOperativoPeriodoDto) {
    if (periodo !== dto.periodo) {
      throw new NotFoundException('El periodo de la ruta y del cuerpo deben coincidir.');
    }

    return this.prisma.costoOperativoPeriodo.upsert({
      where: { periodo },
      create: {
        periodo,
        cantidadBase: dto.cantidadBase,
        manoObraLote: dto.manoObraLote,
        supervisionLote: dto.supervisionLote,
        depreciacionLote: dto.depreciacionLote,
        energiaLote: dto.energiaLote,
        usoLocalLote: dto.usoLocalLote,
        alquilerMensual: dto.alquilerMensual,
        energiaMensual: dto.energiaMensual,
        horasProductivas: dto.horasProductivas,
        valorMaquinaria: dto.valorMaquinaria,
        depreciacionAnual: dto.depreciacionAnual,
      },
      update: {
        cantidadBase: dto.cantidadBase,
        manoObraLote: dto.manoObraLote,
        supervisionLote: dto.supervisionLote,
        depreciacionLote: dto.depreciacionLote,
        energiaLote: dto.energiaLote,
        usoLocalLote: dto.usoLocalLote,
        alquilerMensual: dto.alquilerMensual,
        energiaMensual: dto.energiaMensual,
        horasProductivas: dto.horasProductivas,
        valorMaquinaria: dto.valorMaquinaria,
        depreciacionAnual: dto.depreciacionAnual,
      },
    });
  }

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

  /** Rango de fechas compartido por los reportes de rentabilidad. */
  private rangoFechas(dateRange: string = 'MES_ACTUAL', startDateStr?: string, endDateStr?: string) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone:'America/Lima', year:'numeric',month:'2-digit' }).formatToParts(now);
    const year = Number(parts.find(p=>p.type==='year').value), month = Number(parts.find(p=>p.type==='month').value);
    const first = dateRange==='ESTE_ANO' ? new Date(Date.UTC(year,0,1)) : new Date(Date.UTC(year,month-(dateRange==='MES_ANTERIOR'?2:1),1));
    const last = dateRange==='ESTE_ANO' ? new Date(Date.UTC(year,11,31)) : new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0));
    const start = new Date(`${startDateStr || first.toISOString().slice(0,10)}T00:00:00-05:00`);
    const end = new Date(`${endDateStr || last.toISOString().slice(0,10)}T23:59:59.999-05:00`);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start>end) throw new BadRequestException('El rango de fechas es inválido.');
    return { start, end };
  }

  /** The same invoice cohort drives total, customer and order summaries. */
  private async reporteRentabilidad(start: Date, end: Date, ruc?: string) {
    const cuentas = await this.prisma.cuentaCobrar.findMany({ where: { fechaEmision: { gte: start, lte: end }, ...(ruc ? { clienteRuc: ruc } : {}) } });
    const ids = cuentas.map(c => c.pedidoId).filter(Boolean);
    const codes = cuentas.filter(c => !c.pedidoId).map(c => c.ordenProd).filter(Boolean);
    const pedidos = await this.prisma.pedidoComercial.findMany({ where: { OR: [{ id: { in: ids } }, { codigoOrden: { in: codes } }] }, include: { items: true, ordenesProduccion: true } });
    const lotCodes = pedidos.flatMap(p => p.ordenesProduccion.map(l => l.codigoLote));
    const movements = lotCodes.length ? await this.prisma.kardexMovimiento.findMany({ where: { OR: [{ numero: { in: lotCodes } }, { otp: { in: lotCodes.map(c => `OTP-${c}`) } }] } }) : [];
    const operational = await this.prisma.costoOperativoPeriodo.findMany();
    const assigned = new Set<string>();
    const ventas: any[] = pedidos.map(p => {
      const docs = cuentas.filter(c => c.pedidoId ? c.pedidoId === p.id : c.ordenProd === p.codigoOrden);
      docs.forEach(c => assigned.add(c.id));
      const facturado = Number(new Prisma.Decimal(docs.reduce((sum,c) => sum + Number(c.montoTotal),0)).div('1.18').toDecimalPlaces(2));
      const recorded = costoRegistradoPedido(p, movements);
      const pendientes = [...recorded.pendientes];
      let operationalProjection = 0;
      const operationalBreakdown = p.ordenesProduccion.map(l => {
        const date = l.fechaCierre || l.createdAt;
        const period = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
        const config = operational.find(c => c.periodo === period);
        const snapshot = l.recetaSnapshot as any;
        // Mass of the manufactured batch, not a guessed conversion of sold litres.
        const mass = ['KG','GR'].includes(l.unidadMedida) ? Number(l.cantidadObtenida || 0)/(l.unidadMedida==='GR'?1000:1) : Number(snapshot?.pesaje?.netoKg || 0);
        if (!config || Number(config.cantidadBase)<=0 || mass<=0) return { lote:l.codigoLote,periodo:period,pendiente:true,motivo:'Falta período operativo configurado o masa obtenida documentada' };
        const unitCost = [config.manoObraLote,config.supervisionLote,config.depreciacionLote,config.energiaLote,config.usoLocalLote].reduce((sum,c)=>sum+Number(c),0)/Number(config.cantidadBase);
        const amount=Number(new Prisma.Decimal(mass).mul(unitCost).toDecimalPlaces(2));
        operationalProjection+=amount;
        return {lote:l.codigoLote,periodo:period,pendiente:false,masaKg:mass,costoPorKg:unitCost,monto:amount};
      });
      if (p.moneda !== 'PEN') pendientes.push('Moneda extranjera: tipo de cambio documentado pendiente');
      if (Math.abs(docs.reduce((sum,c) => sum + Number(c.montoTotal),0) - Number(p.montoTotal)) > 0.02) pendientes.push('Facturación del período distinta del total del pedido; asignación de costos pendiente');
      const utilidad = Number(new Prisma.Decimal(facturado).minus(recorded.costo).toDecimalPlaces(2));
      return { pedidoId: p.id, codigoOrden: p.codigoOrden, fecha: docs[0]?.fechaEmision || p.createdAt, estado: p.estado,
        clienteRuc: p.clienteRuc, clienteNombre: p.clienteNombre, productoNombre: p.productoNombre,
        cantidadSolicitada: Number(p.cantidadSolicitada), unidadMedida: p.unidadMedida,
        productos: p.items.map(i => ({ nombre: i.productoNombre, cantidad: Number(i.cantidad), unidad: i.unidadMedida })),
        facturado, costo: recorded.costo, materiales: recorded.materiales, adicionales: recorded.adicionales, utilidad: pendientes.length ? null : utilidad,
        margen: !pendientes.length && facturado > 0 ? Number((utilidad/facturado*100).toFixed(2)) : null,
        margenIndicativo: !pendientes.length && facturado > 0 ? Number((utilidad/facturado*100).toFixed(2)) : null,
        pendientes, operativosEstimados:operationalProjection, proyeccionConOperativos: pendientes.length ? null : Number(new Prisma.Decimal(utilidad).minus(operationalProjection).toDecimalPlaces(2)), operativosDetalle:operationalBreakdown, lotes: recorded.lotes, documentos: docs.map(c => ({ codigo: c.codigoDoc, total: Number(c.montoTotal) })) };
    });
    for (const c of cuentas.filter(c => !assigned.has(c.id))) ventas.push({ pedidoId: c.id, codigoOrden: c.ordenProd || c.codigoDoc, fecha: c.fechaEmision, estado: 'SIN_VINCULO', clienteRuc: c.clienteRuc, clienteNombre: c.clienteNombre, productoNombre: c.producto || '', cantidadSolicitada: 0, unidadMedida: '', productos: [], facturado: Number(new Prisma.Decimal(c.montoTotal).div('1.18').toDecimalPlaces(2)), costo: 0, materiales: 0, adicionales: 0, utilidad: null, margen: null, margenIndicativo: null, pendientes: ['Comprobante sin pedido vinculado: costo desconocido'], lotes: [], documentos: [{ codigo: c.codigoDoc, total: Number(c.montoTotal) }] });
    ventas.sort((a,b) => new Date(b.fecha).getTime()-new Date(a.fecha).getTime());
    const clientes = new Map<string, any[]>();
    for (const v of ventas) { const key = v.clienteRuc || v.clienteNombre; clientes.set(key, [...(clientes.get(key)||[]),v]); }
    const tabla = [...clientes.entries()].map(([ruc, list]) => ({ ruc, cliente: list[0].clienteNombre, ...resumirRentabilidad(list), docs: list.reduce((sum,v) => sum+v.documentos.length,0) }));
    return { ventas, tabla, totales: resumirRentabilidad(ventas), criterio: 'Facturación del período sin IGV (total / 1,18), menos costos registrados de materiales y adicionales. Margen bruto de materiales; no utilidad neta. Mano de obra, energía y otros gastos operativos requieren asignación independiente.' };
  }

  async rentabilidad(dateRange = 'MES_ACTUAL', startDateStr?: string, endDateStr?: string) {
    const { start, end } = this.rangoFechas(dateRange, startDateStr, endDateStr);
    const report = await this.reporteRentabilidad(start,end);
    const [pagos, compras] = await Promise.all([
      this.prisma.pagoAbono.aggregate({ where: { fechaAbono: { gte:start,lte:end } }, _sum: { montoAbonado:true } }),
      this.prisma.ordenCompra.findMany({ where: { estado:'RECIBIDO',updatedAt:{gte:start,lte:end} },select:{totalPEN:true} }),
    ]);
    const serie = [];
    const now = this.rangoFechas('MES_ACTUAL').start;
    for (let i=11;i>=0;i--) {
      const calendar = new Date(Date.UTC(now.getFullYear(),now.getMonth()-i,1));
      const ending = new Date(Date.UTC(calendar.getUTCFullYear(),calendar.getUTCMonth()+1,0));
      const first = new Date(`${calendar.toISOString().slice(0,10)}T00:00:00-05:00`);
      const last = new Date(`${ending.toISOString().slice(0,10)}T23:59:59.999-05:00`);
      const monthly = first.getTime()===start.getTime() && last.getTime()===end.getTime() ? report : await this.reporteRentabilidad(first,last);
      const [cash,oc] = await Promise.all([this.prisma.pagoAbono.aggregate({where:{fechaAbono:{gte:first,lte:last}},_sum:{montoAbonado:true}}),this.prisma.ordenCompra.aggregate({where:{estado:'RECIBIDO',updatedAt:{gte:first,lte:last}},_sum:{totalPEN:true}})]);
      serie.push({month:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'][calendar.getUTCMonth()],year:calendar.getUTCFullYear(),...monthly.totales,cobrado:Number(cash._sum.montoAbonado||0),egresos:Number(oc._sum.totalPEN||0)});
    }
    return { ...report.totales, cobrado: Number(pagos._sum.montoAbonado||0), egresos: compras.reduce((s,c)=>s+Number(c.totalPEN),0), tabla:report.tabla,serie,desglose:[],criterio:report.criterio };
  }

  async rentabilidadPorPedido(dateRange = 'MES_ACTUAL', startDateStr?: string, endDateStr?: string, ruc?: string) {
    const {start,end} = this.rangoFechas(dateRange,startDateStr,endDateStr);
    return this.reporteRentabilidad(start,end,ruc?.trim());
  }

  private costoIndirectoUnitario(
    fecha: Date,
    costosPorPeriodo: Map<string, CostoOperativoCalculado>,
  ): number {
    const periodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const costo = costosPorPeriodo.get(periodo);
    if (!costo || costo.cantidadBase <= 0) return 0;
    const costoLote = costo.manoObraLote
      + costo.supervisionLote
      + costo.depreciacionLote
      + costo.energiaLote
      + costo.usoLocalLote;
    return costoLote / costo.cantidadBase;
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
