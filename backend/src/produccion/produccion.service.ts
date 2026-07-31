import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrdenProduccion, Prisma, TipoMovimientoKardex } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { KardexService } from '../kardex/kardex.service';
import {
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
  ) {}

  /**
   * Endpoint clave del Sprint 1: calcula, a partir de la FormulaMaster y sus
   * porcentajes, cuánto insumo se requiere para la cantidad planificada y lo
   * compara contra el stockReal actual. Se usa ANTES de permitir iniciar una
   * Orden de Producción, para evitar detener la planta a mitad de proceso.
   */
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

  /**
   * Crea la Orden de Producción SOLO si la validación de stock es
   * satisfactoria; en caso contrario lanza 400 con el detalle de faltantes.
   */
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

    return this.prisma.ordenProduccion.create({
      data: {
        codigoLote,
        formulaId: dto.formulaId,
        cantidadPlanificada: dto.cantidadPlanificada,
        supervisorId: dto.supervisorId,
        estado: EstadoOrdenProduccion.EN_PROCESO,
      },
      include: { formula: true, supervisor: true },
    });
  }

  /**
   * Registra un Ajuste Fino en planta: crea el registro de negocio
   * (AjusteFino) y, en la misma operación, dispara el movimiento inmutable
   * de Kardex de tipo AJUSTE_FINO para mantener el stockReal sincronizado.
   */
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

  /** Bandeja de aprobación QA: lotes pendientes de revisión. */
  listarPendientesQA() {
    return this.prisma.ordenProduccion.findMany({
      where: { estado: EstadoOrdenProduccion.QA_PENDIENTE },
      include: { formula: true, supervisor: { select: { nombres: true, apellidos: true } } },
      orderBy: { updatedAt: 'asc' },
    });
  }

  enviarAQA(ordenProduccionId: string, cantidadObtenida: number) {
    return this.prisma.ordenProduccion.update({
      where: { id: ordenProduccionId },
      data: {
        estado: EstadoOrdenProduccion.QA_PENDIENTE,
        cantidadObtenida,
      },
    });
  }

  aprobarLote(dto: DecidirQADto) {
    return this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: { estado: EstadoOrdenProduccion.APROBADO },
    });
  }

  rechazarLote(dto: DecidirQADto) {
    return this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: { estado: EstadoOrdenProduccion.RECHAZADO },
    });
  }

  listar() {
    return this.prisma.ordenProduccion.findMany({
      include: { formula: true, supervisor: { select: { nombres: true, apellidos: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
