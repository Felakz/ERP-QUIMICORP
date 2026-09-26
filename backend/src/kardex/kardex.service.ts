import { cantidadEnStock, costoPorUnidadStock, unidadStock } from '../common/stock-units';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TipoMovimientoKardex, CategoriaKardex, TipoMovimiento } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegistrarMovimientoDto } from './dto/registrar-movimiento.dto';

const MOVIMIENTOS_EGRESO: TipoMovimientoKardex[] = [
  TipoMovimientoKardex.SALIDA,
  TipoMovimientoKardex.MERMA,
];

@Injectable()
export class KardexService {
  constructor(private readonly prisma: PrismaService) {}

  async registrarMovimiento(dto: RegistrarMovimientoDto, transaction?: Prisma.TransactionClient) {
    if (!Number.isFinite(dto.cantidad) || dto.cantidad <= 0) throw new BadRequestException('La cantidad debe ser mayor a cero.');
    const registrar = async (tx: Prisma.TransactionClient) => {
      await tx.$queryRaw`SELECT id FROM insumos WHERE id = ${dto.insumoId} FOR UPDATE`;
      const insumo = await tx.insumo.findUnique({ where: { id: dto.insumoId }, include: { familia: true } });
      if (!insumo) throw new NotFoundException(`Insumo ${dto.insumoId} no encontrado.`);
      // Without an explicit unit the endpoint accepts the stock unit (GR/ML/UN).
      const cantidad = cantidadEnStock(dto.cantidad, dto.unidadMedida || unidadStock(insumo.unidadMedida), insumo.unidadMedida);
      const stockAnterior = new Prisma.Decimal(insumo.stockReal);
      const salida = MOVIMIENTOS_EGRESO.includes(dto.tipoMovimiento) || dto.tipoMovimiento === TipoMovimientoKardex.AJUSTE_FINO;
      const stockNuevo = salida ? stockAnterior.minus(cantidad) : stockAnterior.plus(cantidad);
      if (stockNuevo.isNegative()) throw new ConflictException(`Stock insuficiente. Disponible: ${stockAnterior} ${unidadStock(insumo.unidadMedida)}, solicitado: ${cantidad}.`);
      await tx.insumo.update({ where: { id: dto.insumoId }, data: { stockReal: stockNuevo } });
      const costo = costoPorUnidadStock(Number(insumo.costoUnitario), insumo.unidadMedida);
      const categoria = insumo.tipo === 'ENVASE' ? CategoriaKardex.ENVASE : insumo.tipo === 'BASE' ? CategoriaKardex.MATERIA_PRIMA : CategoriaKardex.INSUMO;
      await tx.kardexMovimiento.create({ data: {
        insumoId: insumo.id, categoriaKardex: categoria,
        productoNombre: insumo.nombre, familia: insumo.familia.nombre,
        unidadMedida: unidadStock(insumo.unidadMedida), tipoDoc: 'MOV',
        numero: dto.documentoReferencia, proveedorCliente: dto.documentoReferencia || 'Movimiento de almacén',
        tipoOperacion: salida ? (dto.tipoMovimiento === TipoMovimientoKardex.MERMA ? TipoMovimiento.SALIDA_MERMA : TipoMovimiento.SALIDA_CONSUMO_PRODUCCION) : TipoMovimiento.ENTRADA_AJUSTE,
        cantidadEntrada: salida ? 0 : cantidad, cantidadSalida: salida ? cantidad : 0,
        saldoFinal: stockNuevo.toNumber(), costoUnitario: costo,
        montoEntradaPen: salida ? 0 : cantidad * costo, montoSalidaPen: salida ? cantidad * costo : 0,
        montoSaldoPen: stockNuevo.toNumber() * costo, usuarioId: dto.usuarioId,
      } });
      return tx.kardexInmutable.create({ data: {
        insumoId: dto.insumoId, tipoMovimiento: dto.tipoMovimiento, cantidad, stockAnterior, stockNuevo,
        documentoReferencia: dto.documentoReferencia, usuarioId: dto.usuarioId,
      }, include: { insumo: true, usuario: true } });
    };
    return transaction ? registrar(transaction) : this.prisma.$transaction(registrar, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
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

    const movimientos = await this.prisma.kardexMovimiento.findMany({
      where: whereCondition,
      orderBy: { fecha: 'desc' },
      take,
      skip,
      include: { insumo: true },
    });

    // Montos reales: usar los montos del movimiento; si están en 0 pero el
    // insumo vinculado tiene costo unitario, calcularlos (dato real, no inventado).
    return movimientos.map((m) => {
      const costoReal = Number(
        m.costoUnitario ?? (m.insumo ? costoPorUnidadStock(Number(m.insumo.costoUnitario), m.insumo.unidadMedida) : 0)
      );
      const cEntrada = Number(m.cantidadEntrada || 0);
      const cSalida = Number(m.cantidadSalida || 0);
      const saldo = Number(m.saldoFinal || 0);

      const montoEntrada = Number(m.montoEntradaPen || 0) || cEntrada * costoReal;
      const montoSalida = Number(m.montoSalidaPen || 0) || cSalida * costoReal;
      const montoSaldo = Number(m.montoSaldoPen || 0) || saldo * costoReal;

      return {
        ...m,
        unidadSaldo: m.insumo ? unidadStock(m.insumo.unidadMedida) : m.unidadMedida,
        requiereConciliacionUnidad: !!m.insumo && m.unidadMedida !== unidadStock(m.insumo.unidadMedida),
        costoUnitario: costoReal,
        montoEntradaPen: montoEntrada,
        montoSalidaPen: montoSalida,
        montoSaldoPen: montoSaldo,
      };
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
        insumo: { select: { costoUnitario: true, codigo: true, nombre: true, unidadMedida: true } },
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
        stockInicial: number | null;
        unidadSaldo: string;
        requiereConciliacionUnidad: boolean;
        saldoFinal: number;
        totalEntradas: number;
        totalSalidas: number;
        costoUnitario: number;
        movimientos: typeof movimientos;
      }
    >();

    for (const mov of movimientos) {
      const key = `${mov.categoriaKardex}::${mov.insumoId || mov.productoNombre}::${mov.unidadMedida}`;
      if (!grupos.has(key)) {
        // El stock inicial se deduce del primer movimiento (más antiguo)
        const primerSaldo = Number(mov.saldoFinal);
        const primerEntrada = Number(mov.cantidadEntrada);
        const primerSalida = Number(mov.cantidadSalida);
        const unidadSaldo = mov.insumo ? unidadStock(mov.insumo.unidadMedida) : mov.unidadMedida;
        const requiereConciliacionUnidad = mov.unidadMedida !== unidadSaldo;
        const stockInicial = requiereConciliacionUnidad ? null : primerSaldo - primerEntrada + primerSalida;

        grupos.set(key, {
          productoNombre: mov.productoNombre,
          familia: mov.familia || '',
          categoriaNombre: mov.categoriaNombre || '',
          proveedorCliente: mov.proveedorCliente || '',
          unidadMedida: mov.unidadMedida,
          categoriaKardex: mov.categoriaKardex,
          stockInicial,
          unidadSaldo,
          requiereConciliacionUnidad,
          saldoFinal: 0,
          totalEntradas: 0,
          totalSalidas: 0,
          costoUnitario: Number(mov.costoUnitario ?? 0),
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
