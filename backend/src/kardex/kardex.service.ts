import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TipoMovimientoKardex } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegistrarMovimientoDto } from './dto/registrar-movimiento.dto';

/**
 * Movimientos que INCREMENTAN el stock real del insumo.
 */
const MOVIMIENTOS_INGRESO: TipoMovimientoKardex[] = [
  TipoMovimientoKardex.ENTRADA,
  TipoMovimientoKardex.REAPROVECHAMIENTO,
];

/**
 * Movimientos que DECREMENTAN el stock real del insumo.
 * AJUSTE_FINO puede ir en cualquier sentido (se resuelve por signo del DTO
 * a nivel de negocio); aquí se trata como ingreso adicional a producción.
 */
const MOVIMIENTOS_EGRESO: TipoMovimientoKardex[] = [
  TipoMovimientoKardex.SALIDA,
  TipoMovimientoKardex.MERMA,
];

@Injectable()
export class KardexService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra un movimiento de Kardex de forma ATOMICA e INMUTABLE.
   * - Bloquea la fila del insumo (SELECT ... FOR UPDATE) dentro de una
   *   transacción SERIALIZABLE para evitar condiciones de carrera entre
   *   operarios registrando movimientos simultáneos.
   * - Calcula stockAnterior/stockNuevo en servidor (nunca confía en el
   *   cliente) y persiste ambos en el registro histórico.
   * - El registro de KardexInmutable NUNCA se actualiza ni se borra
   *   (append-only); cualquier corrección se hace con un nuevo movimiento
   *   tipo AJUSTE_FINO referenciando el documento original.
   */
  async registrarMovimiento(dto: RegistrarMovimientoDto) {
    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a cero.');
    }

    return this.prisma.$transaction(
      async (tx) => {
        // 1. Bloqueo pesimista de la fila del insumo
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
          // AJUSTE_FINO: se registra como ingreso neto (cantidad agregada en planta)
          stockNuevo = stockAnterior.plus(dto.cantidad);
        }

        // 2. Actualiza stock real del insumo
        await tx.insumo.update({
          where: { id: dto.insumoId },
          data: { stockReal: stockNuevo },
        });

        // 3. Inserta el movimiento inmutable (nunca se editará este registro)
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
}
