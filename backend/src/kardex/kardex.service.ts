import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TipoMovimientoKardex, CategoriaKardex, TipoMovimiento } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegistrarMovimientoDto } from './dto/registrar-movimiento.dto';

const MOVIMIENTOS_INGRESO: TipoMovimientoKardex[] = [
  TipoMovimientoKardex.ENTRADA,
  TipoMovimientoKardex.REAPROVECHAMIENTO,
];

const MOVIMIENTOS_EGRESO: TipoMovimientoKardex[] = [
  TipoMovimientoKardex.SALIDA,
  TipoMovimientoKardex.MERMA,
];

@Injectable()
export class KardexService {
  constructor(private readonly prisma: PrismaService) {}

  async registrarMovimiento(dto: RegistrarMovimientoDto) {
    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a cero.');
    }

    return this.prisma.$transaction(
      async (tx) => {
        const insumoRows = await tx.$queryRaw<
          { id: string; stockReal: Prisma.Decimal }[]
        >`SELECT id, "stockReal" FROM insumos WHERE id = ${dto.insumoId}::uuid FOR UPDATE`;

        if (!insumoRows.length) {
          throw new NotFoundException(`Insumo ${dto.insumoId} no encontrado.`);
        }

        const stockAnterior = new Prisma.Decimal(insumoRows[0].stockReal);
        let stockNuevo: Prisma.Decimal;

        if (MOVIMIENTOS_INGRESO.includes(dto.tipoMovimiento)) {
          stockNuevo = stockAnterior.plus(dto.cantidad);
        } else if (MOVIMIENTOS_EGRESO.includes(dto.tipoMovimiento)) {
          stockNuevo = stockAnterior.minus(dto.cantidad);
          if (stockNuevo.isNegative()) {
            throw new ConflictException(
              `Stock insuficiente. Disponible: ${stockAnterior.toString()}, solicitado: ${dto.cantidad}.`,
            );
          }
        } else {
          stockNuevo = stockAnterior.plus(dto.cantidad);
        }

        await tx.insumo.update({
          where: { id: dto.insumoId },
          data: { stockReal: stockNuevo },
        });

        const movimiento = await tx.kardexInmutable.create({
          data: {
            insumoId: dto.insumoId,
            tipoMovimiento: dto.tipoMovimiento,
            cantidad: dto.cantidad,
            stockAnterior,
            stockNuevo,
            documentoReferencia: dto.documentoReferencia,
            usuarioId: dto.usuarioId,
          },
          include: { insumo: true, usuario: true },
        });

        return movimiento;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async listarPorInsumo(insumoId: string, take = 50, skip = 0) {
    return this.prisma.kardexInmutable.findMany({
      where: { insumoId },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: { usuario: { select: { nombres: true, apellidos: true } } },
    });
  }

  async listarTodos(take = 100, skip = 0) {
    return this.prisma.kardexInmutable.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        insumo: { select: { codigo: true, nombre: true, unidadMedida: true } },
        usuario: { select: { nombres: true, apellidos: true } },
      },
    });
  }

  /**
   * Consulta el Kardex Categorizado de Inventario según la categoría (PRODUCTO_TERMINADO, MATERIA_PRIMA, INSUMO, ENVASE, EMBALAJE),
   * filtros de búsqueda, fechas y tipo de operación.
   */
  async listarCategorizado(params: {
    categoria?: CategoriaKardex;
    search?: string;
    tipoOperacion?: string;
    desde?: string;
    hasta?: string;
    take?: number;
    skip?: number;
  }) {
    const { categoria, search, tipoOperacion, desde, hasta, take = 100, skip = 0 } = params;

    const whereCondition: Prisma.KardexMovimientoWhereInput = {
      AND: [
        categoria ? { categoriaKardex: categoria } : {},
        search
          ? {
              OR: [
                { productoNombre: { contains: search, mode: 'insensitive' } },
                { proveedorCliente: { contains: search, mode: 'insensitive' } },
                { numero: { contains: search, mode: 'insensitive' } },
                { otp: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        tipoOperacion && tipoOperacion !== 'TODAS'
          ? tipoOperacion === 'ENTRADAS'
            ? { cantidadEntrada: { gt: 0 } }
            : { cantidadSalida: { gt: 0 } }
          : {},
        desde ? { fecha: { gte: new Date(desde) } } : {},
        hasta ? { fecha: { lte: new Date(hasta) } } : {},
      ],
    };

    return this.prisma.kardexMovimiento.findMany({
      where: whereCondition,
      orderBy: { fecha: 'desc' },
      take,
      skip,
      include: { insumo: true },
    });
  }
}
