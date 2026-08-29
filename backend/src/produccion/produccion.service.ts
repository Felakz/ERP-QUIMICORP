import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrdenProduccion, Prisma, TipoMovimientoKardex, CategoriaKardex, TipoMovimiento } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { KardexService } from '../kardex/kardex.service';
import { ProduccionGateway } from './produccion.gateway';
import {
  AsignarOperariosDto,
  CambiarPasoDto,
  CrearOrdenDto,
  DecidirQADto,
  RegistrarAjusteFinoDto,
  ValidarStockDto,
} from './dto/crear-orden.dto';

export interface RequerimientoInsumo {
  insumoId: string;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  cantidadRequerida: string;
  stockDisponible: string;
  suficiente: boolean;
  faltante: string;
}

@Injectable()
export class ProduccionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kardexService: KardexService,
    private readonly produccionGateway: ProduccionGateway,
  ) {}

  async validarStockDisponible(dto: ValidarStockDto): Promise<{
    formulaId: string;
    cantidadPlanificada: number;
    puedeIniciar: boolean;
    requerimientos: RequerimientoInsumo[];
  }> {
    const formula = await this.prisma.formulaMaster.findUnique({
      where: { id: dto.formulaId },
      include: { detalles: { include: { insumo: true } } },
    });

    if (!formula) {
      throw new NotFoundException(`Fórmula ${dto.formulaId} no encontrada.`);
    }
    if (!formula.detalles.length) {
      throw new BadRequestException('La fórmula no tiene insumos configurados.');
    }

    const requerimientos: RequerimientoInsumo[] = formula.detalles.map((detalle) => {
      const cantidadRequerida = new Prisma.Decimal(dto.cantidadPlanificada)
        .mul(detalle.porcentaje)
        .div(100);
      const stockDisponible = new Prisma.Decimal(detalle.insumo.stockReal);
      const suficiente = stockDisponible.gte(cantidadRequerida);
      const faltante = suficiente
        ? new Prisma.Decimal(0)
        : cantidadRequerida.minus(stockDisponible);

      return {
        insumoId: detalle.insumoId,
        codigo: detalle.insumo.codigo,
        nombre: detalle.insumo.nombre,
        unidadMedida: detalle.insumo.unidadMedida,
        cantidadRequerida: cantidadRequerida.toFixed(4),
        stockDisponible: stockDisponible.toFixed(4),
        suficiente,
        faltante: faltante.toFixed(4),
      };
    });

    return {
      formulaId: dto.formulaId,
      cantidadPlanificada: dto.cantidadPlanificada,
      puedeIniciar: requerimientos.every((r) => r.suficiente),
      requerimientos,
    };
  }

  async crearOrden(dto: CrearOrdenDto) {
    // Validamos stock para informar, pero NO bloqueamos la creación del lote.
    const validacion = await this.validarStockDisponible({
      formulaId: dto.formulaId,
      cantidadPlanificada: dto.cantidadPlanificada,
    }).catch(() => null);

    const ultimoCodigo = await this.prisma.ordenProduccion.count();
    const codigoLote = `LOTE-${String(ultimoCodigo + 1).padStart(6, '0')}`;

    // El frontend envía el id del modelo de autenticación (User). Resolvemos al
    // Usuario (ERP) real para respetar la FK de supervisorId.
    let supervisorId = dto.supervisorId;
    const supervisor = await this.prisma.usuario.findUnique({ where: { id: supervisorId } });
    if (!supervisor) {
      const fallback = await this.prisma.usuario.findFirst();
      if (fallback) supervisorId = fallback.id;
    }

    const orden = await this.prisma.ordenProduccion.create({
      data: {
        codigoLote,
        formulaId: dto.formulaId,
        cantidadPlanificada: dto.cantidadPlanificada,
        supervisorId: supervisorId,
        clienteNombre: dto.clienteNombre || 'Cliente Quimicorp SAC',
        estado: EstadoOrdenProduccion.EN_PROCESO,
        pasoProceso: 'PENDIENTE_ASIGNACION',
      },
      include: { formula: true, supervisor: true },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: orden.id,
      codigoLote: orden.codigoLote,
      clienteNombre: orden.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: 'EN_PROCESO',
      pasoProceso: 'PENDIENTE_ASIGNACION',
      timestamp: new Date().toISOString(),
    });

    return orden;
  }

  async asignarOperarios(dto: AsignarOperariosDto) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    const operariosStr = dto.operarios.join(', ');
    const nuevoPaso = dto.operarios.length > 0 ? 'ELABORANDO' : 'PENDIENTE_ASIGNACION';

    const ordenActualizada = await this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: {
        operariosAsignados: operariosStr,
        pasoProceso: nuevoPaso,
      },
      include: { formula: true },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: ordenActualizada.id,
      codigoLote: ordenActualizada.codigoLote,
      clienteNombre: ordenActualizada.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: ordenActualizada.estado,
      pasoProceso: nuevoPaso,
      operarios: dto.operarios,
      timestamp: new Date().toISOString(),
    });

    return ordenActualizada;
  }

  async cambiarPasoProceso(dto: CambiarPasoDto) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    // Regla de negocio: no se puede pasar a ELABORANDO ni EN_MUESTREO_QA sin operarios
    const operariosList = orden.operariosAsignados ? orden.operariosAsignados.split(', ') : [];
    if ((dto.pasoProceso === 'ELABORANDO' || dto.pasoProceso === 'EN_MUESTREO_QA') && operariosList.length === 0) {
      throw new BadRequestException('⚠️ Asigna al menos un operario para habilitar la fabricación.');
    }

    let nuevoEstadoEnum = orden.estado;
    if (dto.pasoProceso === 'EN_MUESTREO_QA') {
      nuevoEstadoEnum = EstadoOrdenProduccion.QA_PENDIENTE;
    } else if (dto.pasoProceso === 'LIBERADO_QA') {
      nuevoEstadoEnum = EstadoOrdenProduccion.APROBADO;
    }

    const ordenActualizada = await this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: {
        pasoProceso: dto.pasoProceso,
        estado: nuevoEstadoEnum,
        observacionesQA: dto.observacionesQA || orden.observacionesQA,
      },
      include: { formula: true },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: ordenActualizada.id,
      codigoLote: ordenActualizada.codigoLote,
      clienteNombre: ordenActualizada.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: ordenActualizada.estado,
      pasoProceso: dto.pasoProceso,
      observaciones: dto.observacionesQA,
      timestamp: new Date().toISOString(),
    });

    return ordenActualizada;
  }

  async registrarAjusteFino(dto: RegistrarAjusteFinoDto) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      const ajuste = await tx.ajusteFino.create({
        data: {
          ordenProduccionId: dto.ordenProduccionId,
          insumoId: dto.insumoId,
          cantidadAgregada: dto.cantidadAgregada,
          registradoPorId: dto.registradoPorId,
        },
      });

      await this.kardexService.registrarMovimiento({
        insumoId: dto.insumoId,
        tipoMovimiento: TipoMovimientoKardex.AJUSTE_FINO,
        cantidad: Math.abs(dto.cantidadAgregada),
        documentoReferencia: orden.codigoLote,
        usuarioId: dto.registradoPorId,
      });

      return ajuste;
    });
  }

  listarPendientesQA() {
    return this.prisma.ordenProduccion.findMany({
      where: {
        OR: [
          { estado: EstadoOrdenProduccion.QA_PENDIENTE },
          { estado: EstadoOrdenProduccion.EN_PROCESO },
          { estado: EstadoOrdenProduccion.PENDIENTE },
        ],
      },
      include: { formula: true, supervisor: { select: { nombres: true, apellidos: true } } },
      orderBy: { updatedAt: 'asc' },
    });
  }

  enviarAQA(ordenProduccionId: string, cantidadObtenida: number) {
    return this.prisma.ordenProduccion.update({
      where: { id: ordenProduccionId },
      data: {
        estado: EstadoOrdenProduccion.QA_PENDIENTE,
        pasoProceso: 'EN_MUESTREO_QA',
        cantidadObtenida,
      },
    });
  }

  /**
   * Al APROBAR & LIBERAR un Lote en Control de Producción & QA:
   * 1. Cambia el estado a APROBADO y pasoProceso a LIBERADO_QA.
   * 2. Registra automáticamente en el KardexMovimiento:
   *    - Salida por consumo (SALIDA_CONSUMO_PRODUCCION) de cada Materia Prima / Insumo según receta.
   *    - Entrada de Producto Terminado (ENTRADA_PRODUCCION) en PRODUCTO_TERMINADO con el nombre del Cliente y los KG/L.
   * 3. Emite evento WebSocket en tiempo real para Administración y Logística.
   */
  async aprobarLote(dto: DecidirQADto) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
      include: {
        formula: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: { familia: true },
                },
              },
            },
          },
        },
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      const ordenAprobada = await tx.ordenProduccion.update({
        where: { id: dto.ordenProduccionId },
        data: {
          estado: EstadoOrdenProduccion.EN_ETIQUETADO,
          pasoProceso: 'LIBERADO_QA',
          observacionesQA: dto.observacionesQA || orden.observacionesQA,
          fechaCierre: new Date(),
        } as any,
      });

      const cantidadProducida = Number(dto.cantidadObtenida || orden.cantidadObtenida || orden.cantidadPlanificada);
      const clienteFinal = orden.clienteNombre || 'Cliente Quimicorp SAC';

      // 1. Salidas por Consumo de Materia Prima / Insumos
      for (const detalle of orden.formula.detalles) {
        const porcentaje = Number(detalle.porcentaje);
        const consumoCalculado = (Number(orden.cantidadPlanificada) * porcentaje) / 100;
        const stockActual = Number(detalle.insumo.stockReal);
        const nuevoSaldo = Math.max(0, stockActual - consumoCalculado);

        await tx.insumo.update({
          where: { id: detalle.insumoId },
          data: { stockReal: nuevoSaldo },
        });

        const esMateriaPrima = detalle.insumo.familia?.nombre.toLowerCase().includes('ácido') ||
                               detalle.insumo.familia?.nombre.toLowerCase().includes('solvente');

        await tx.kardexMovimiento.create({
          data: {
            categoriaKardex: esMateriaPrima
              ? CategoriaKardex.MATERIA_PRIMA
              : CategoriaKardex.INSUMO,
            productoNombre: detalle.insumo.nombre,
            familia: detalle.insumo.familia?.nombre || 'General',
            categoriaNombre: detalle.insumo.familia?.nombre || 'Químicos Base',
            proveedorCliente: `Consumo Planta - Lote ${orden.codigoLote} (${clienteFinal})`,
            unidadMedida: detalle.insumo.unidadMedida,
            fecha: new Date(),
            tipoDoc: 'OP',
            serie: 'LOTE',
            numero: orden.codigoLote,
            otp: `OTP-${orden.codigoLote}`,
            tipoOperacion: TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
            cantidadEntrada: 0,
            cantidadSalida: consumoCalculado,
            saldoFinal: nuevoSaldo,
            insumoId: detalle.insumoId,
          },
        });
      }

      // 2. Entrada del Producto Terminado Aprobado
      await tx.kardexMovimiento.create({
        data: {
          categoriaKardex: CategoriaKardex.PRODUCTO_TERMINADO,
          productoNombre: orden.formula.nombreProducto,
          familia: 'Detergentes & Limpiadores Industriales',
          categoriaNombre: 'Producto Terminado Aprobado',
          proveedorCliente: clienteFinal,
          unidadMedida: 'KG',
          fecha: new Date(),
          tipoDoc: 'OP',
          serie: 'LOTE',
          numero: orden.codigoLote,
          otp: `OTP-${orden.codigoLote}`,
          tipoOperacion: TipoMovimiento.ENTRADA_PRODUCCION,
          cantidadEntrada: cantidadProducida,
          cantidadSalida: 0,
          saldoFinal: cantidadProducida,
        },
      });

      // 3. Enviar a la Cola de Etiquetas & Despacho (/dashboard/etiquetas)
      await (tx as any).colaDespacho.create({
        data: {
          loteCodigo: orden.codigoLote,
          productoNombre: orden.formula.nombreProducto,
          clienteNombre: clienteFinal,
          cantidad: `${cantidadProducida} KG`,
          fechaFabricacion: new Date(),
          codigoQR: `QR-QUIMICORP-${orden.codigoLote}`,
          codigoBarras: `7759000${orden.codigoLote.replace(/\D/g, '') || '1001'}`,
          estado: 'LISTO_PARA_IMPRIMIR',
        },
      });

      // 4. Emisión de Evento WebSocket
      this.produccionGateway.emitirEstadoActualizado({
        ordenId: ordenAprobada.id,
        codigoLote: ordenAprobada.codigoLote,
        clienteNombre: clienteFinal,
        nuevoEstado: 'APROBADO',
        pasoProceso: 'LIBERADO_QA',
        observaciones: dto.observacionesQA,
        timestamp: new Date().toISOString(),
      });

      return ordenAprobada;
    });
  }

  obtenerColaDespacho() {
    return (this.prisma as any).colaDespacho.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async despacharEtiqueta(colaId: string) {
    if (!colaId) {
      throw new BadRequestException('Se requiere colaId para registrar el despacho.');
    }

    const cola = await (this.prisma as any).colaDespacho.findUnique({ where: { id: colaId } });
    if (!cola) {
      throw new NotFoundException('No se encontró el registro de despacho de la cola.');
    }

    const colaActualizada = await (this.prisma as any).colaDespacho.update({
      where: { id: colaId },
      data: { estado: 'DESPACHADO' },
    });

    // Marcar la Orden de Producción asociada como DESPACHADA (vínculo por código de lote).
    const orden = await this.prisma.ordenProduccion.findFirst({
      where: { codigoLote: cola.loteCodigo },
    });
    if (orden) {
      await this.prisma.ordenProduccion.update({
        where: { id: orden.id },
        data: {
          estado: EstadoOrdenProduccion.DESPACHADO,
          pasoProceso: 'DESPACHADO',
          fechaCierre: new Date(),
        },
      });

      // Propagar el estado ENTREGADO al Pedido Comercial vinculado (mismo patrón de
      // coincidencia por dígitos del código usado en el resto del módulo de producción),
      // para que el estado sea consistente en pedidos, control-producción y cartera de clientes.
      const numPart = (orden.codigoLote || '').replace(/\D/g, '');
      const pedidoVinculado = await (this.prisma as any).pedidoComercial.findFirst({
        where: {
          OR: numPart
            ? [
                { codigoOrden: { contains: numPart } },
                { codigoRefAdmin: { contains: numPart } },
              ]
            : [],
          clienteNombre: orden.clienteNombre || undefined,
        },
        orderBy: { createdAt: 'desc' },
      }).catch(() => null);

      if (pedidoVinculado) {
        await (this.prisma as any).pedidoComercial.update({
          where: { id: pedidoVinculado.id },
          data: { estado: 'ENTREGADO' },
        });
      }

      this.produccionGateway.emitirEstadoActualizado({
        ordenId: orden.id,
        codigoLote: orden.codigoLote,
        clienteNombre: orden.clienteNombre || '',
        nuevoEstado: 'DESPACHADO',
        pasoProceso: 'DESPACHADO',
        observaciones: 'Lote despachado y entregado al cliente.',
        timestamp: new Date().toISOString(),
      });
    }

    return colaActualizada;
  }

  async rechazarLote(dto: DecidirQADto) {
    if (!dto.motivoRechazo?.trim()) {
      throw new BadRequestException('El motivo de rechazo es obligatorio para detener el lote.');
    }

    const ordenRechazada = await this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: {
        estado: EstadoOrdenProduccion.RECHAZADO,
        pasoProceso: 'RECHAZADO',
        motivoRechazo: dto.motivoRechazo,
        observacionesQA: dto.observacionesQA,
      },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: ordenRechazada.id,
      codigoLote: ordenRechazada.codigoLote,
      clienteNombre: ordenRechazada.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: 'RECHAZADO',
      pasoProceso: 'RECHAZADO',
      observaciones: dto.motivoRechazo,
      timestamp: new Date().toISOString(),
    });

    return ordenRechazada;
  }

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

  listar(fechaStr?: string) {
    let whereCondition: any = {};
    if (fechaStr) {
      const { inicioDia, finDia } = this.parsearRangoDia(fechaStr);
      whereCondition.createdAt = { gte: inicioDia, lte: finDia };
    }

    return this.prisma.ordenProduccion.findMany({
      where: whereCondition,
      include: { formula: true, supervisor: { select: { nombres: true, apellidos: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerProgramacionDiaria(fechaStr?: string) {
    const { inicioDia, finDia, fechaISO } = this.parsearRangoDia(fechaStr);

    const ordenesDelDia = await this.prisma.ordenProduccion.findMany({
      where: {
        createdAt: {
          gte: inicioDia,
          lte: finDia,
        },
      },
      include: {
        formula: true,
        supervisor: { select: { nombres: true, apellidos: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Cargar pedidos comerciales del sistema para resolver aditivos y atributos personalizados
    const pedidosRecientes = await (this.prisma as any).pedidoComercial.findMany({
      include: {
        aditivos: {
          include: { insumo: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }).catch(() => []);

    let totalKgProgramados = 0;
    let terminadosCount = 0;
    let enProcesoCount = 0;
    let pendientesCount = 0;

    const listaFormatted = ordenesDelDia.map((oItem) => {
      const o = oItem as any;
      const cant = Number(o.cantidadPlanificada) || 0;
      totalKgProgramados += cant;

      const esTerminado =
        o.estado === EstadoOrdenProduccion.APROBADO ||
        o.pasoProceso === 'LIBERADO_QA' ||
        !!o.fechaCierre;

      const esEnProceso =
        !esTerminado &&
        (o.pasoProceso === 'ELABORANDO' ||
          o.pasoProceso === 'EN_MUESTREO_QA' ||
          o.estado === EstadoOrdenProduccion.QA_PENDIENTE ||
          (!!o.operariosAsignados && o.operariosAsignados.trim().length > 0));

      const estadoCalculado: 'ENTREGADO' | 'TERMINADO' | 'EN PROCESO' | 'PENDIENTE' =
        o.estado === EstadoOrdenProduccion.DESPACHADO
          ? 'ENTREGADO'
          : esTerminado
          ? 'TERMINADO'
          : esEnProceso
          ? 'EN PROCESO'
          : 'PENDIENTE';

      if (estadoCalculado === 'TERMINADO' || estadoCalculado === 'ENTREGADO') {
        terminadosCount++;
      } else if (estadoCalculado === 'EN PROCESO') {
        enProcesoCount++;
      } else {
        pendientesCount++;
      }

      // Resolver Color y Fragancia con prioridad: OrdenProduccion > PedidoComercial > Fallback
      let colorResuelto = o.colorEspecificado;
      let fraganciaResuelta = o.fraganciaEspecificada;

      if (!colorResuelto || colorResuelto === 'TRANSPARENTE' || colorResuelto === 'SIN COLOR' || !fraganciaResuelta || fraganciaResuelta === 'SIN FRAGANCIA' || fraganciaResuelta === 'SIN AROMA') {
        const numPart = (o.codigoLote || '').replace(/\D/g, '');
        const matchingPedido = pedidosRecientes.find((p: any) => {
          const pNum = (p.codigoOrden || '').replace(/\D/g, '');
          if (numPart && pNum && (numPart.includes(pNum) || pNum.includes(numPart))) return true;
          return p.clienteNombre === o.clienteNombre && p.formulaId === o.formulaId;
        });

        if (matchingPedido) {
          const fragAdit = matchingPedido.aditivos?.find(
            (a: any) => a.tipo === 'FRAGANCIA' || a.insumo?.tipo === 'FRAGANCIA' || a.insumo?.nombre?.toLowerCase().includes('fragancia')
          );
          const pigmAdit = matchingPedido.aditivos?.find(
            (a: any) => a.tipo === 'PIGMENTO' || a.insumo?.tipo === 'PIGMENTO' || a.insumo?.nombre?.toLowerCase().includes('pigmento')
          );

          if (!colorResuelto || colorResuelto === 'TRANSPARENTE' || colorResuelto === 'SIN COLOR') {
            colorResuelto = matchingPedido.colorText || matchingPedido.color || pigmAdit?.insumo?.nombre || 'TRANSPARENTE';
          }
          if (!fraganciaResuelta || fraganciaResuelta === 'SIN FRAGANCIA' || fraganciaResuelta === 'SIN AROMA') {
            fraganciaResuelta = matchingPedido.aromaText || matchingPedido.aroma || fragAdit?.insumo?.nombre || 'SIN FRAGANCIA';
          }
        }
      }

      return {
        id: o.id,
        codigoLote: o.codigoLote,
        clienteNombre: o.clienteNombre || 'Quimicorp SAC',
        productoNombre: o.formula?.nombreProducto || 'Producto Químico',
        colorEspecificado: colorResuelto || 'TRANSPARENTE',
        fraganciaEspecificada: fraganciaResuelta || 'SIN FRAGANCIA',
        cantidad: cant,
        unidadMedida: 'KG',
        estado: estadoCalculado,
        operarios: o.operariosAsignados || 'Sin Asignar',
        prioridad: o.prioridad || 'NORMAL',
        fechaCreacion: o.createdAt,
        fechaCierre: o.fechaCierre,
      };
    });

    return {
      fecha: fechaISO,
      resumen: {
        totalOrdenes: listaFormatted.length,
        totalKgProgramados: totalKgProgramados.toFixed(2),
        totalTerminados: terminadosCount,
        totalEnProceso: enProcesoCount,
        totalPendientes: pendientesCount,
      },
      ordenes: listaFormatted,
    };
  }

  /**
   * Receta Unificada (mergeReceta):
   * Combina componentes de la fórmula base + aditivos personalizados (Fragancias, Pigmentos)
   * con sus porcentajes, gramos calculados y estado de stock en Kardex.
   */
  async obtenerMergeReceta(loteId: string) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: loteId },
      include: {
        formula: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: { familia: true },
                },
              },
            },
          },
        },
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    const cantidadPlanificadaKg = Number(orden.cantidadPlanificada) || 100;

    // 1. Componentes base de la fórmula
    const ingredientesBase = orden.formula.detalles.map((d) => {
      const pct = Number(d.porcentaje);
      const gramos = cantidadPlanificadaKg * 1000 * (pct / 100);
      return {
        insumoId: d.insumoId,
        codigo: d.insumo.codigo,
        nombre: d.insumo.nombre,
        familia: d.insumo.familia?.nombre || 'General',
        tipo: 'BASE',
        porcentaje: pct,
        gramosCalculados: Math.round(gramos * 100) / 100,
        unidadMedida: d.insumo.unidadMedida,
        stockReal: Number(d.insumo.stockReal),
        suficiente: Number(d.insumo.stockReal) * 1000 >= gramos,
        esAditivo: false,
      };
    });

    // 2. Aditivos del pedido comercial asociado
    let aditivos: any[] = [];
    let pedidoConVariante: any = null;
    if (orden.codigoLote) {
      const numPart = (orden.codigoLote || '').replace(/\D/g, '');

      const pedido = await (this.prisma as any).pedidoComercial.findFirst({
        where: numPart
          ? {
              OR: [
                { codigoOrden: { contains: numPart } },
                { codigoRefAdmin: { contains: numPart } },
                { clienteNombre: orden.clienteNombre },
              ],
            }
          : { clienteNombre: orden.clienteNombre },
        include: {
          aditivos: {
            include: {
              insumo: {
                include: { familia: true },
              },
            },
          },
          variante: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (pedido && pedido.aditivos && pedido.aditivos.length > 0) {
        pedidoConVariante = pedido;
        aditivos = pedido.aditivos.map((ad: any) => {
          const pct = Number(ad.porcentaje) || (ad.tipo === 'PIGMENTO' ? 0.5 : 1.0);
          const gramos = Number(ad.gramosCalculados) || (cantidadPlanificadaKg * 1000 * (pct / 100));
          return {
            insumoId: ad.insumoId,
            codigo: ad.insumo?.codigo || 'AD-001',
            nombre: ad.insumo?.nombre || 'Aditivo Personalizado',
            familia: ad.insumo?.familia?.nombre || (ad.tipo === 'FRAGANCIA' ? 'Fragancias' : 'Pigmentos'),
            tipo: ad.tipo || 'FRAGANCIA',
            porcentaje: pct,
            gramosCalculados: Math.round(gramos * 100) / 100,
            unidadMedida: ad.insumo?.unidadMedida || 'KG',
            stockReal: Number(ad.insumo?.stockReal || 50),
            suficiente: Number(ad.insumo?.stockReal || 50) * 1000 >= gramos,
            esAditivo: true,
          };
        });
      }
    }

    const mergeReceta = [...ingredientesBase, ...aditivos];
    const totalGramos = mergeReceta.reduce((sum, item) => sum + item.gramosCalculados, 0);

    // Prioriza los pasos de elaboración de la VARIANTE (cliente específico) si existen;
    // si no, usa los pasos de la fórmula maestra.
    const pasosVariant = pedidoConVariante?.variante?.pasosElaboracion;
    const pasosEfectivos = Array.isArray(pasosVariant) && pasosVariant.length > 0
      ? pasosVariant
      : (Array.isArray(orden.formula.pasosElaboracion) ? orden.formula.pasosElaboracion : []);

    return {
      ordenId: orden.id,
      codigoLote: orden.codigoLote,
      clienteNombre: orden.clienteNombre,
      productoNombre: orden.formula.nombreProducto,
      cantidadPlanificadaKg,
      totalGramos: Math.round(totalGramos * 100) / 100,
      ingredientes: mergeReceta,
      pasosElaboracion: pasosEfectivos,
    };
  }
}

