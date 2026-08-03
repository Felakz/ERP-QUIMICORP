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
   * Lista movimientos planos con filtros (para búsquedas puntuales).
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
    const { categoria, search, tipoOperacion, desde, hasta, take = 200, skip = 0 } = params;

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

  /**
   * Devuelve movimientos agrupados por productoNombre, igual que el Excel:
   * cabecera del producto (familia, proveedor, stockInicial, saldoFinal)
   * + array de movimientos cronológicos.
   */
  async listarAgrupado(params: {
    categoria?: CategoriaKardex;
    search?: string;
    tipoOperacion?: string;
    desde?: string;
    hasta?: string;
  }) {
    const { categoria, search, tipoOperacion, desde, hasta } = params;

    const whereCondition: Prisma.KardexMovimientoWhereInput = {
      AND: [
        categoria ? { categoriaKardex: categoria } : {},
        search
          ? {
              OR: [
                { productoNombre: { contains: search, mode: 'insensitive' } },
                { proveedorCliente: { contains: search, mode: 'insensitive' } },
                { familia: { contains: search, mode: 'insensitive' } },
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

    // Ordenar: producto asc + fecha asc (para que el primer mov. sea el más antiguo)
    const movimientos = await this.prisma.kardexMovimiento.findMany({
      where: whereCondition,
      orderBy: [{ productoNombre: 'asc' }, { fecha: 'asc' }],
      include: {
        insumo: { select: { costoUnitario: true, codigo: true, nombre: true } },
      },
    });

    // Agrupar por categoriaKardex + productoNombre
    const grupos = new Map<
      string,
      {
        productoNombre: string;
        familia: string;
        categoriaNombre: string;
        proveedorCliente: string;
        unidadMedida: string;
        categoriaKardex: string;
        stockInicial: number;
        saldoFinal: number;
        totalEntradas: number;
        totalSalidas: number;
        costoUnitario: number;
        movimientos: typeof movimientos;
      }
    >();

    for (const mov of movimientos) {
      const key = `${mov.categoriaKardex}::${mov.productoNombre}`;
      if (!grupos.has(key)) {
        // El stock inicial se deduce del primer movimiento (más antiguo)
        const primerSaldo = Number(mov.saldoFinal);
        const primerEntrada = Number(mov.cantidadEntrada);
        const primerSalida = Number(mov.cantidadSalida);
        const stockInicial = primerSaldo - primerEntrada + primerSalida;

        grupos.set(key, {
          productoNombre: mov.productoNombre,
          familia: mov.familia || '',
          categoriaNombre: mov.categoriaNombre || '',
          proveedorCliente: mov.proveedorCliente || '',
          unidadMedida: mov.unidadMedida,
          categoriaKardex: mov.categoriaKardex,
          stockInicial,
          saldoFinal: 0,
          totalEntradas: 0,
          totalSalidas: 0,
          costoUnitario: mov.insumo?.costoUnitario ? Number(mov.insumo.costoUnitario) : 0,
          movimientos: [],
        });
      }
      const grupo = grupos.get(key)!;
      grupo.movimientos.push(mov);
      grupo.totalEntradas += Number(mov.cantidadEntrada);
      grupo.totalSalidas += Number(mov.cantidadSalida);
      // El último movimiento (más reciente) tiene el saldo actual
      grupo.saldoFinal = Number(mov.saldoFinal);
    }

    return Array.from(grupos.values());
  }

  async obtenerBomProducto(nombreProducto: string) {
    if (!nombreProducto) return null;
    return this.prisma.formulaMaster.findFirst({
      where: {
        nombreProducto: { contains: nombreProducto, mode: 'insensitive' },
        estado: { not: 'INACTIVA' },
      },
      include: {
        detalles: {
          include: {
            insumo: {
              include: {
                familia: true,
              },
            },
          },
          orderBy: { porcentaje: 'desc' },
        },
      },
    });
  }
}
