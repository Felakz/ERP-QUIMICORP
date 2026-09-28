import { CommercialOrderWorkflow } from './commercial-order.workflow';
import { masaLoteKg } from '../common/order-quantity';
import { Prisma } from '@prisma/client';
import { cantidadLoteKg, consumoFormulaGramos, unidadStock } from '../common/stock-units';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProduccionGateway } from '../produccion/produccion.gateway';

@Injectable()
export class PedidosAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly produccionGateway: ProduccionGateway,
  ) {}

  private parsearRangoDia(fechaStr?: string) {
    let y: number, m: number, d: number;
    if (fechaStr && /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const parts = fechaStr.split('-').map(Number);
      y = parts[0];
      m = parts[1] - 1;
      d = parts[2];
    } else {
      const now = new Date();
      y = now.getFullYear();
      m = now.getMonth();
      d = now.getDate();
    }

    const inicioDia = new Date(y, m, d, 0, 0, 0, 0);
    const finDia = new Date(y, m, d, 23, 59, 59, 999);
    const fechaISO = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    return { inicioDia, finDia, fechaISO };
  }

  // 1. Obtener KPIs superiores dinámicos del día (solo órdenes de producción OP)
  async obtenerKpis(fecha?: string) {
    const db = this.prisma as any;
    try {
      const { inicioDia, finDia, fechaISO } = this.parsearRangoDia(fecha);
      const dateFilter = {
        createdAt: {
          gte: inicioDia,
          lte: finDia,
        },
      };

      const [nuevosCount, pendienteRevisionCount, aprobadosCount, enProduccionCount, agregadosHoy] =
        await Promise.all([
          db.pedidoComercial.count({ where: { estado: 'NUEVO', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'PENDIENTE_REVISION', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'APROBADO', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'EN_PRODUCCION', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.aggregate({ where: { docType: 'OP', ...dateFilter }, _sum: { montoTotal: true } }).catch(() => ({ _sum: { montoTotal: null } })),
        ]);

      const countTotal = (nuevosCount + pendienteRevisionCount + aprobadosCount + enProduccionCount) || 0;
      const sumValue = agregadosHoy?._sum?.montoTotal ? Number(agregadosHoy._sum.montoTotal) : 0.0;

      return {
        fecha: fechaISO,
        pedidosHoy: countTotal,
        nuevos: (nuevosCount + pendienteRevisionCount),
        pendienteRevision: pendienteRevisionCount,
        aprobados: aprobadosCount,
        enProduccion: enProduccionCount,
        valorDelDia: sumValue,
      };
    } catch (e) {
      console.log('Error en obtenerKpis:', e);
      return {
        pedidosHoy: 0,
        nuevos: 0,
        pendienteRevision: 0,
        aprobados: 0,
        enProduccion: 0,
        valorDelDia: 0.0,
      };
    }
  }


  // 1.5 Crear pedido/cotización — bifurcado por mode: 'COTIZACION'|'PEDIDO'
  async crearPedido(dto: any, actorId?: string) {
    return new CommercialOrderWorkflow(this.prisma, this.produccionGateway).create(dto, actorId);
  }

  // 2. Listar pedidos con búsqueda, filtros y cálculo automático de stock en Kardex
  async listar(search?: string, estado?: string, prioridad?: string, docType?: string, fecha?: string) {
    const db = this.prisma as any;
    const whereCondition: any = {};

    if (docType && docType.toUpperCase() !== 'TODOS') {
      whereCondition.docType = docType.toUpperCase();
    }

    if (fecha && fecha.trim() !== '' && fecha.toUpperCase() !== 'TODOS') {
      const { inicioDia, finDia } = this.parsearRangoDia(fecha);
      whereCondition.createdAt = { gte: inicioDia, lte: finDia };
    }

    if (estado && estado.toUpperCase() !== 'TODOS') {
      if (estado.toUpperCase() === 'NUEVO') {
        whereCondition.OR = [
          { estado: 'NUEVO' },
          { estado: 'PENDIENTE_REVISION' },
        ];
      } else {
        whereCondition.estado = estado.toUpperCase();
      }
    }

    if (prioridad && prioridad.toUpperCase() !== 'TODAS') {
      whereCondition.prioridad = prioridad.toUpperCase();
    }


    if (search && search.trim() !== '') {
      const q = search.trim();
      whereCondition.OR = [
        { codigoOrden: { contains: q, mode: 'insensitive' } },
        { codigoRefAdmin: { contains: q, mode: 'insensitive' } },
        { clienteNombre: { contains: q, mode: 'insensitive' } },
        { clienteRuc: { contains: q, mode: 'insensitive' } },
        { productoNombre: { contains: q, mode: 'insensitive' } },
      ];
    }

    const pedidos = await db.pedidoComercial.findMany({
      where: whereCondition,
      include: {
        items: { include: { formula: { include: { detalles: { include: { insumo: true } } } } }, orderBy: { indice: 'asc' } },
        formula: {
          include: {
            detalles: {
              include: {
                insumo: true,
              },
            },
          },
        },
        aditivos: {
          include: {
            insumo: true,
          },
        },
        adicionales: true,
        ordenesProduccion: {
          orderBy: { createdAt: 'desc' },
          select: {
            codigoLote: true,
            estado: true,
            pasoProceso: true,
            fechaCierre: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Cuentas por cobrar vinculadas (pedidoId o fallback por codigoOrden)
    const pedidoIds = pedidos.map((p: any) => p.id);
    const codigosOrden = pedidos.map((p: any) => p.codigoOrden).filter(Boolean);
    const ccs = pedidoIds.length
      ? (await (db.cuentaCobrar.findMany({
          where: {
            OR: [{ pedidoId: { in: pedidoIds } }, { ordenProd: { in: codigosOrden } }],
          },
          orderBy: { fechaEmision: 'desc' },
        })).catch(() => []))
      : [];
    const ccPorPedido = new Map<string, any>();
    const ccPorOrden = new Map<string, any>();
    for (const cc of ccs as any[]) {
      if (cc.pedidoId && !ccPorPedido.has(cc.pedidoId)) ccPorPedido.set(cc.pedidoId, cc);
      if (cc.ordenProd && !ccPorOrden.has(cc.ordenProd)) ccPorOrden.set(cc.ordenProd, cc);
    }

    // Calcular el estado de stock en Kardex y desglosar items guardados
    const pedidosConStock = await Promise.all(
      pedidos.map(async (ped: any) => {
        // No exponer las relaciones crudas; se resumen en estadoPago / ordenesEstados
        const { cuentasCobrar: _ccRaw, ordenesProduccion: _ordsRaw, ...pedResto } = ped;
        let stockValidacion: any;
        try {
          stockValidacion = await this.calcularStockPedido(ped);
        } catch (error) {
          stockValidacion = {
            stockCompleto: false,
            insumosFaltantesCount: 0,
            calculoPendiente: error.message,
            detalles: [],
          };
        }

        let itemsList: any[] = [];
        let cleanObservaciones = ped.notasAdmin;

        if (ped.notasAdmin && typeof ped.notasAdmin === 'string') {
          try {
            const parsed = JSON.parse(ped.notasAdmin);
            if (parsed && Array.isArray(parsed.items)) {
              itemsList = parsed.items;
              cleanObservaciones = parsed.observaciones || '';
            }
          } catch {}
        }
        if (ped.items?.length) itemsList = ped.items.map((line: any) => ({ ...line.metadata, id: line.codigoLinea,
          formulaId: line.formulaId, productoNombre: line.productoNombre, cantidad: Number(line.cantidad),
          unidadMedida: line.unidadMedida, precioUnitario: line.precioUnitario == null ? null : Number(line.precioUnitario) }));

        // Estado de pago real desde la cuenta por cobrar vinculada (con VENCIDO derivado)
        const cc = ccPorPedido.get(ped.id) || ccPorOrden.get(ped.codigoOrden) || null;
        const estadoPago = cc
          ? Number(cc.saldoPendiente) > 0 &&
            cc.estado !== 'PAGADO' &&
            cc.fechaVencimiento &&
            new Date(cc.fechaVencimiento) < new Date()
            ? 'VENCIDO'
            : cc.estado
          : null;

        // Estados de las órdenes de producción vinculadas (para emisibilidad de crédito)
        const ordenesEstados = (ped.ordenesProduccion || []).map((o: any) => ({
          codigoLote: o.codigoLote,
          estado: o.estado,
          pasoProceso: o.pasoProceso,
        }));

        return {
          ...pedResto,
          estadoPago,
          ordenesEstados,
          desgloseStock: stockValidacion,
          itemsList,
          observacionesClean: cleanObservaciones,
        };
      }),
    );

    return pedidosConStock;
  }


  // 3. Obtener desglose exacto de stock para el modal de stock insuficiente
  async obtenerDesgloseStock(pedidoId: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({
      where: { id: pedidoId },
      include: {
        items: { include: { formula: { include: { detalles: { include: { insumo: true } } } } }, orderBy: { indice: 'asc' } },
        formula: {
          include: {
            detalles: {
              include: { insumo: true },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido comercial no encontrado.');
    }

    return this.calcularStockPedido(pedido);
  }

  // 3.1 Actualizar Pedido / Cotización (Edición de datos comerciales)
  async actualizarPedido(id: string, dto: any, actorId?: string) {
    return new CommercialOrderWorkflow(this.prisma, this.produccionGateway).update(id, dto, actorId);
  }

  // 3.2 Eliminar Pedido / Cotización
  async eliminarPedido(id: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({
      where: { id },
      include: { ordenesProduccion: true },
    });

    if (!pedido) {
      throw new NotFoundException('El pedido a eliminar no existe.');
    }

    // Verificar si tiene órdenes de producción activas en planta avanzadas
    if (pedido.ordenesProduccion && pedido.ordenesProduccion.length > 0) {
      const enProceso = pedido.ordenesProduccion.some((op: any) => op.estado === 'EN_PROCESO' || op.estado === 'TERMINADO');
      if (enProceso) {
        throw new BadRequestException('No se puede eliminar un pedido con órdenes de producción en proceso o terminadas en planta.');
      }
      await db.ordenProduccion.deleteMany({
        where: { pedidoComercialId: id },
      }).catch(() => null);
    }

    // Eliminar aditivos vinculados
    await db.pedidoAditivo.deleteMany({
      where: { pedidoId: id },
    }).catch(() => null);

    await db.pedidoComercial.delete({
      where: { id },
    });

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('pedido:eliminado', { id, codigoOrden: pedido.codigoOrden });
    }

    return { ok: true, mensaje: `Pedido ${pedido.codigoOrden} eliminado correctamente.` };
  }

  // 4. Aprobar Pedido y Transferir a Control de Producción & QA
  async aprobarPedido(id: string, actorId?: string) {
    return new CommercialOrderWorkflow(this.prisma, this.produccionGateway).approve(id, actorId);
  }

  // 5. Devolver Pedido a Administración por falta de stock/insumos
  async devolverPedido(id: string, motivoDevolucion: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({ where: { id } });
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    return db.pedidoComercial.update({
      where: { id },
      data: {
        estado: 'DEVUELTO',
        motivoDevolucion,
      },
    });
  }

  // 5.5 Convertir Cotización Comercial en Pedido de Producción (Aceptado por Cliente)
  async convertirCotizacionAPedido(id: string, dto?: any, actorId?: string) {
    return new CommercialOrderWorkflow(this.prisma, this.produccionGateway).convert(id, dto, actorId);
  }

  // 6. Limpiar datos de prueba para iniciar en limpio como nuevo sistema
  async limpiarDatos() {
    const db = this.prisma as any;
    try {
      await db.pedidoComercial.deleteMany({});
      await db.ordenProduccion.deleteMany({});
      if (db.colaDespacho) {
        await db.colaDespacho.deleteMany({});
      }
    } catch (e) {
      console.log('Error limpiando datos:', e);
    }

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('order:created_to_plant', null);
      this.produccionGateway.server.emit('order:status_updated', { ordenId: null });
      this.produccionGateway.server.emit('lote:estado_actualizado', { ordenId: null });
    }

    return { success: true, message: 'Datos limpiados exitosamente. El sistema está listo para nuevos pedidos.' };
  }


  // Helper privado para calcular stock de insumos cruzando la fórmula con los Insumos en Kardex
  private async calcularStockPedido(pedido: any) {
    let lines = pedido.items || [];
    if (!lines.length) {
      let raw = [];
      try { raw = JSON.parse(pedido.notasAdmin || '{}').items || []; } catch { /* plain notes */ }
      if (raw.length) {
        lines = await Promise.all(raw.map(async (item: any) => ({ cantidad: Number(item.cantidad), unidadMedida: item.unidadMedida || item.unidad,
          formulaId: item.formulaId, productoNombre: item.productoNombre, metadata: item,
          formula: await this.prisma.formulaMaster.findUnique({ where: { id: item.formulaId }, include: { detalles: { include: { insumo: true } } } }),
        })));
      } else lines = [{ cantidad: Number(pedido.cantidadSolicitada), unidadMedida: pedido.unidadMedida,
        formulaId: pedido.formulaId, formula: pedido.formula, metadata: {}, productoNombre: pedido.productoNombre }];
    }
    const requirements = new Map<string, any>();
    for (const line of lines) {
      if (!line.formula) throw new BadRequestException('Falta identificar la fórmula de un producto.');
      const kg = masaLoteKg({ ...line.metadata, cantidad: Number(line.cantidad), unidadMedida: line.unidadMedida });
      const recipe = new CommercialOrderWorkflow(this.prisma, this.produccionGateway).recipe(line);
      for (const detail of recipe.componentes) {
        const ingredient = line.formula.detalles.find((d: any) => d.insumoId === detail.insumoId)?.insumo || await this.prisma.insumo.findUnique({ where: { id: detail.insumoId } });
        if (!ingredient) throw new BadRequestException('Falta identificar el insumo de un ingrediente.');
        const amount = new Prisma.Decimal(consumoFormulaGramos(kg, detail.porcentaje, ingredient));
        const previous = requirements.get(ingredient.id);
        requirements.set(ingredient.id, { ingredient, required: previous ? previous.required.plus(amount) : amount });
      }
    }
    const detalles = [...requirements.values()].map(({ ingredient, required }) => ({ codigo: ingredient.codigo, nombre: ingredient.nombre,
      unidadMedida: unidadStock(ingredient), requerido: required.toNumber(), disponible: Number(ingredient.stockReal),
      faltante: Math.max(0, required.minus(ingredient.stockReal).toNumber()), suficiente: required.lte(ingredient.stockReal) }));
    const missing = detalles.filter(d => !d.suficiente).length;
    return { stockCompleto: missing === 0, insumosFaltantesCount: missing, detalles };
  }

  /**
   * R1 — Emitir comprobante (Boleta / Factura / Nota de Venta) desde una cotización/pedido.
   * Cambia el tipoComprobante, mantiene el ciclo docType (COT/OP) y registra la cuenta por cobrar.
   *
   * Reglas de negocio:
   *  - CONTADO: se factura desde que el pedido está confirmado (APROBADO) y, si el pago ya fue
   *    recibido (pagoRecibido, casilla marcada por defecto), la cuenta nace PAGADO con abono total.
   *  - CREDITO: solo facturable cuando la producción está lista para despacho
   *    (EN_ETIQUETADO / LIBERADO_QA / ETIQUETADO / DESPACHADO), o si el pedido ya fue entregado,
   *    o si es venta directa sin lote en reactor.
   */
  async emitirComprobante(
    pedidoId: string,
    dto: {
      tipo?: string;
      pagoRecibido?: boolean;
      medioPago?: string;
      numOperacion?: string;
      canalBanco?: string;
    },
    emitidoPor?: string,
  ) {
    const db = this.prisma as any;
    const tipo = (dto?.tipo || '').toUpperCase();
    if (!['BOLETA', 'FACTURA', 'NOTA_VENTA'].includes(tipo)) {
      throw new Error('Tipo de comprobante inválido. Use BOLETA, FACTURA o NOTA_VENTA.');
    }

    const pedido = await db.pedidoComercial.findUnique({
      where: { id: pedidoId },
      include: { ordenesProduccion: true },
    });
    if (!pedido) throw new NotFoundException('Pedido no encontrado.');

    if (pedido.docType !== 'OP' || pedido.importeValidado === false) throw new BadRequestException('Se requiere un pedido con importe documentado para emitir el comprobante.');
    if (pedido.moneda && pedido.moneda !== 'PEN') throw new BadRequestException('La cuenta por cobrar en soles requiere conversión monetaria documentada; no se asume un tipo de cambio.');

    if (pedido.tipoComprobante) {
      throw new BadRequestException(
        `El pedido ${pedido.codigoOrden} ya emitió comprobante (${pedido.tipoComprobante}).`,
      );
    }

    // ── Clasificador de condición de pago: CONTADO vs CRÉDITO ──
    const condicion = (pedido.condicionPago || '').toLowerCase();
    const esContado = !/\b(cr[eé]dito|plazo)\b|\b\d+\s*d[ií]as\b/i.test(condicion);

    // ── Validaciones de emisibilidad según regla de negocio ──
    this.validarEmisibilidad(pedido, esContado);

    const monto = Number(pedido.montoTotal) || 0;
    const nombre = pedido.clienteNombre || 'Cliente';
    const ruc = pedido.clienteRuc || '00000000000';

    // Regla de negocio: línea de crédito por cliente (null = sin límite)
    if (!esContado && pedido.clienteId) {
      const cliente = await db.cliente.findUnique({ where: { id: pedido.clienteId } });
      if (cliente) {
        const limite = cliente.limiteCredito != null ? Number(cliente.limiteCredito) : null;
        if (limite != null && limite > 0) {
          const deudaActual = await db.cuentaCobrar.aggregate({
            where: { clienteId: cliente.id, estado: { in: ['PENDIENTE', 'VENCIDO'] } },
            _sum: { saldoPendiente: true },
          });
          const deuda = Number(deudaActual?._sum?.saldoPendiente) || 0;
          if (deuda + monto > limite) {
            throw new BadRequestException(
              `Se superaría la línea de crédito del cliente: deuda actual S/ ${deuda.toLocaleString('es-PE', { minimumFractionDigits: 2 })} + comprobante S/ ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })} > límite S/ ${limite.toLocaleString('es-PE', { minimumFractionDigits: 2 })}.`,
            );
          }
        }
        if (cliente.diasCreditoMax != null && cliente.diasCreditoMax > 0) {
          const dias = Number(pedido.condicionPago?.match(/\d+/)?.[0]) || 0;
          if (dias > cliente.diasCreditoMax) {
            throw new BadRequestException(
              `El plazo de crédito (${dias} días) supera el máximo del cliente (${cliente.diasCreditoMax} días).`,
            );
          }
        }
      }
    }

    // Días de crédito derivados de la condición de pago para el vencimiento.
    const diasCredito = esContado
      ? 0
      : (() => {
          const m = condicion;
          const num = m.match(/\d+/)?.[0];
          if (num) return parseInt(num, 10);
          return 0;
        })();
    const fechaEmision = new Date();
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasCredito);

    // Pago recibido al instante (casilla marcada por defecto en contado)
    const pagoRecibido = dto?.pagoRecibido !== undefined ? !!dto.pagoRecibido : esContado;
    const medioPago = dto?.medioPago?.trim() || null;

    // Registrar en cuenta por cobrar (tabla de cobranzas)
    const prefijo = tipo === 'FACTURA' ? 'FAC' : tipo === 'BOLETA' ? 'BOL' : 'NV';
    const nroc = await db.cuentaCobrar.count();
    const codigoDoc = `${prefijo}-${new Date().getFullYear()}-${String(nroc + 1).padStart(5, '0')}`;

    // Transacción atómica: CuentaCobrar + abono (si pagó) + marca del pedido
    const resultado = await db.$transaction(async (tx: any) => {
      const cuenta = await tx.cuentaCobrar.create({
        data: {
          codigoDoc,
          clienteId: pedido.clienteId,
          clienteNombre: nombre,
          clienteRuc: ruc,
          pedidoId: pedido.id,
          ordenProd: pedido.codigoOrden,
          producto: pedido.productoNombre,
          montoTotal: monto,
          saldoPendiente: pagoRecibido ? 0 : monto,
          condicionPago: pedido.condicionPago || 'Contado',
          diasPlazo: diasCredito,
          fechaEmision,
          fechaVencimiento,
          estado: pagoRecibido ? 'PAGADO' : 'PENDIENTE',
          fechaPago: pagoRecibido ? fechaEmision : null,
          medioPago: pagoRecibido ? medioPago || 'Pago contado' : tipo,
          canalBanco: dto?.canalBanco?.trim() || null,
          emitidoPor: emitidoPor || null,
        },
      });

      if (pagoRecibido) {
        await tx.pagoAbono.create({
          data: {
            cuentaCobrarId: cuenta.id,
            montoAbonado: monto,
            medio: medioPago || 'Pago contado',
            banco: dto?.canalBanco?.trim() || null,
            numOperacion: dto?.numOperacion?.trim() || null,
            observaciones: `Pago contado al instante — ${pedido.codigoOrden}`,
          },
        });
      }

      const actualizado = await tx.pedidoComercial.update({
        where: { id: pedidoId },
        data: { tipoComprobante: tipo },
      });

      return { cuenta, actualizado };
    });

    return {
      id: resultado.actualizado.id,
      codigoOrden: resultado.actualizado.codigoOrden,
      tipoComprobante: resultado.actualizado.tipoComprobante,
      cuentaCobrar: codigoDoc,
      montoTotal: monto,
      estadoPago: resultado.cuenta.estado,
      estadoEntrega: pedido.estado,
    };
  }

  /**
   * Valida que el pedido pueda facturarse según condición de pago y estado de producción.
   * - Contado: exige pedido confirmado (≠ NUEVO/REVISIÓN).
   * - Crédito: exige producción lista para despacho, pedido entregado o venta directa sin lote.
   */
  private validarEmisibilidad(pedido: any, esContado: boolean) {
    const estado = pedido.estado || '';
    if (['RECHAZADO', 'DEVUELTO'].includes(estado)) {
      throw new BadRequestException(
        `El pedido ${pedido.codigoOrden} está en estado ${estado} y no se puede facturar.`,
      );
    }

    if (esContado) {
      if (['NUEVO', 'PENDIENTE_REVISION', 'VALIDANDO'].includes(estado)) {
        throw new BadRequestException(
          `El pedido ${pedido.codigoOrden} es de contado pero aún no está confirmado. Aprueba el pedido antes de facturar.`,
        );
      }
      return;
    }

    // Crédito: producción lista para despacho
    const estadosListos = ['EN_ETIQUETADO', 'LIBERADO_QA', 'ETIQUETADO', 'LISTO_PARA_IMPRIMIR', 'DESPACHADO'];
    const produccionLista = (pedido.ordenesProduccion || []).some(
      (o: any) => estadosListos.includes(o.pasoProceso) || estadosListos.includes(o.estado),
    );
    const yaEntregado = ['ENTREGADO', 'DESPACHADO'].includes(estado);
    const sinLote = !pedido.ordenesProduccion || pedido.ordenesProduccion.length === 0;

    if (produccionLista || yaEntregado || sinLote) return;

    throw new BadRequestException(
      `El pedido ${pedido.codigoOrden} es a crédito y su producción aún no está lista para despacho. ` +
        `Espera a que el lote pase a EN_ETIQUETADO / LIBERADO_QA (o sea despachado) para emitir el comprobante.`,
    );
  }

  /**
   * R1 — Comparativa por ciclo: facturado vs boletado (vs nota de venta),
   * comparando el período actual contra el anterior.
   * periodo: MES | TRIMESTRE | SEMESTRE | ANUAL
   */
  async comparativaCiclo(periodo: string = 'MES') {
    const now = new Date();
    const ranges = this.rangoPeriodoComparativo(now, (periodo || 'MES').toUpperCase());

    const agregar = async (inicio: Date, fin: Date) => {
      const docs = await (this.prisma as any).pedidoComercial.findMany({
        where: {
          tipoComprobante: { in: ['BOLETA', 'FACTURA', 'NOTA_VENTA'] },
          createdAt: { gte: inicio, lte: fin },
        },
        select: { tipoComprobante: true, montoTotal: true },
      });
      const base = { facturado: 0, boletado: 0, notaVenta: 0, count: 0 };
      const acc = { ...base };
      for (const d of docs) {
        const m = Number(d.montoTotal) || 0;
        acc.count += 1;
        if (d.tipoComprobante === 'FACTURA') acc.facturado += m;
        else if (d.tipoComprobante === 'BOLETA') acc.boletado += m;
        else if (d.tipoComprobante === 'NOTA_VENTA') acc.notaVenta += m;
      }
      return acc;
    };

    const actual = await agregar(ranges.actualInicio, ranges.actualFin);
    const anterior = await agregar(ranges.anteriorInicio, ranges.anteriorFin);

    const cambio = (a: number, b: number) =>
      b > 0 ? Number((((a - b) / b) * 100).toFixed(1)) : 0;

    return {
      periodo: (periodo || 'MES').toUpperCase(),
      actual: { ...actual, total: actual.facturado + actual.boletado + actual.notaVenta },
      anterior: { ...anterior, total: anterior.facturado + anterior.boletado + anterior.notaVenta },
      variacionPorcentual: {
        facturado: cambio(actual.facturado, anterior.facturado),
        boletado: cambio(actual.boletado, anterior.boletado),
        notaVenta: cambio(actual.notaVenta, anterior.notaVenta),
        total: cambio(
          actual.facturado + actual.boletado + actual.notaVenta,
          anterior.facturado + anterior.boletado + anterior.notaVenta,
        ),
      },
    };
  }

  private rangoPeriodoComparativo(now: Date, periodo: string) {
    const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    if (periodo === 'ANUAL') {
      const ai = new Date(now.getFullYear() - 1, 0, 1);
      const af = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      const ni = new Date(now.getFullYear(), 0, 1);
      const nf = endOf(now);
      return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
    }
    if (periodo === 'SEMESTRE') {
      const monthOffset = 6;
      const ai = new Date(now.getFullYear(), now.getMonth() - monthOffset * 2, 1);
      const af = new Date(now.getFullYear(), now.getMonth() - monthOffset, 0, 23, 59, 59, 999);
      const ni = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const nf = endOf(now);
      return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
    }
    if (periodo === 'TRIMESTRE') {
      const ai = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      const af = new Date(now.getFullYear(), now.getMonth() - 3, 0, 23, 59, 59, 999);
      const ni = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      const nf = endOf(now);
      return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
    }
    // MES (default)
    const ai = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const af = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
    const ni = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nf = endOf(now);
    return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
  }
}

