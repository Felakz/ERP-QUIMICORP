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
    const validacion = await this.validarStockDisponible({
      formulaId: dto.formulaId,
      cantidadPlanificada: dto.cantidadPlanificada,
    });

    if (!validacion.puedeIniciar) {
      throw new BadRequestException({
        message: 'Stock insuficiente para iniciar la orden de producción.',
        faltantes: validacion.requerimientos.filter((r) => !r.suficiente),
      });
    }

    const ultimoCodigo = await this.prisma.ordenProduccion.count();
    const codigoLote = `LOTE-${String(ultimoCodigo + 1).padStart(6, '0')}`;

    const orden = await this.prisma.ordenProduccion.create({
      data: {
        codigoLote,
        formulaId: dto.formulaId,
        cantidadPlanificada: dto.cantidadPlanificada,
        supervisorId: dto.supervisorId,
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
          estado: EstadoOrdenProduccion.APROBADO,
          pasoProceso: 'LIBERADO_QA',
          observacionesQA: dto.observacionesQA || orden.observacionesQA,
        },
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
      await tx.colaDespacho.create({
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
    return this.prisma.colaDespacho.findMany({
      orderBy: { createdAt: 'desc' },
    });
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

  listar() {
    return this.prisma.ordenProduccion.findMany({
      include: { formula: true, supervisor: { select: { nombres: true, apellidos: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
