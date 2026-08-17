import { BadRequestException, Injectable } from '@nestjs/common';
import { EstadoFormula } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearFormulaDto } from './dto/crear-formula.dto';

@Injectable()
export class FormulasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearFormulaDto) {
    const sumaPorcentajes = dto.detalles.reduce((acc, d) => acc + d.porcentaje, 0);
    if (Math.abs(sumaPorcentajes - 100) > 0.01) {
      throw new BadRequestException(
        `La suma de porcentajes debe ser 100%. Actual: ${sumaPorcentajes.toFixed(2)}%.`,
      );
    }

    return this.prisma.formulaMaster.create({
      data: {
        codigoFormula: dto.codigoFormula,
        nombreProducto: dto.nombreProducto,
        densidadTeorica: dto.densidadTeorica,
        estado: EstadoFormula.EN_REVISION,
        detalles: {
          create: dto.detalles.map((d) => ({
            insumoId: d.insumoId,
            porcentaje: d.porcentaje,
            pesoMasaTeorico: d.porcentaje, // referencial; se recalcula por lote real
          })),
        },
      },
      include: { detalles: { include: { insumo: true } } },
    });
  }

  async listar(search?: string) {
    const where: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { nombreProducto: { contains: q, mode: 'insensitive' } },
        { codigoFormula: { contains: q, mode: 'insensitive' } },
        { variants: { some: { nombre: { contains: q, mode: 'insensitive' } } } },
        { variants: { some: { cliente: { razonSocial: { contains: q, mode: 'insensitive' } } } } },
      ];
    }

    return this.prisma.formulaMaster.findMany({
      where,
      include: {
        detalles: {
          include: {
            insumo: {
              include: { familia: true },
            },
          },
        },
        variants: {
          include: { cliente: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const formula = await this.prisma.formulaMaster.findUnique({
      where: { id },
      include: {
        detalles: {
          include: {
            insumo: {
              include: { familia: true },
            },
          },
        },
        variants: {
          include: { cliente: true },
        },
      },
    });

    if (!formula) {
      throw new BadRequestException(`Fórmula con ID ${id} no encontrada.`);
    }

    return formula;
  }

  async activar(id: string) {
    return this.prisma.formulaMaster.update({
      where: { id },
      data: { estado: EstadoFormula.ACTIVA },
    });
  }

  async clonar(
    id: string,
    dto: {
      nuevoCodigo?: string;
      nuevoNombre: string;
      clienteId?: string;
      nombreVariante?: string;
      notas?: string;
    },
  ) {
    const origen = await this.obtenerPorId(id);

    // Si no se especifica código, generamos uno incremental
    let codigo = dto.nuevoCodigo?.trim();
    if (!codigo) {
      const total = await this.prisma.formulaMaster.count();
      codigo = `FM-${String(total + 1).padStart(3, '0')}`;
    }

    // Comprobar colisión de código
    const existente = await this.prisma.formulaMaster.findUnique({
      where: { codigoFormula: codigo },
    });
    if (existente) {
      codigo = `${codigo}-CLON-${Date.now().toString().slice(-4)}`;
    }

    // Clonación en transacción atómica
    return this.prisma.$transaction(async (tx) => {
      const nuevaFormula = await tx.formulaMaster.create({
        data: {
          codigoFormula: codigo!,
          nombreProducto: dto.nuevoNombre.trim(),
          densidadTeorica: origen.densidadTeorica,
          estado: EstadoFormula.ACTIVA,
          detalles: {
            create: origen.detalles.map((d) => ({
              insumoId: d.insumoId,
              porcentaje: d.porcentaje,
              pesoMasaTeorico: d.pesoMasaTeorico,
            })),
          },
        },
        include: {
          detalles: { include: { insumo: true } },
          variants: true,
        },
      });

      // Si se especificó un cliente o variante exclusiva para la fórmula clonada
      if (dto.nombreVariante && dto.nombreVariante.trim()) {
        await tx.formulaVariant.create({
          data: {
            nombre: dto.nombreVariante.trim(),
            formulaId: nuevaFormula.id,
            clienteId: dto.clienteId || null,
            notas: dto.notas || `Fórmula clonada a partir de ${origen.codigoFormula}`,
          },
        });
      }

      return tx.formulaMaster.findUnique({
        where: { id: nuevaFormula.id },
        include: {
          detalles: { include: { insumo: true } },
          variants: { include: { cliente: true } },
        },
      });
    });
  }

  async agregarVariante(
    formulaId: string,
    dto: {
      nombre: string;
      clienteId?: string;
      notas?: string;
    },
  ) {
    const formula = await this.prisma.formulaMaster.findUnique({ where: { id: formulaId } });
    if (!formula) {
      throw new BadRequestException(`Fórmula no encontrada.`);
    }

    return this.prisma.formulaVariant.create({
      data: {
        nombre: dto.nombre.trim(),
        formulaId,
        clienteId: dto.clienteId || null,
        notas: dto.notas || null,
      },
      include: { cliente: true },
    });
  }

  async eliminarVariante(variantId: string) {
    return this.prisma.formulaVariant.delete({
      where: { id: variantId },
    });
  }

  async listarVariantes(formulaId: string, clienteId?: string) {
    const where: any = { formulaId };
    if (clienteId && clienteId.trim()) {
      where.clienteId = clienteId.trim();
    }
    return this.prisma.formulaVariant.findMany({
      where,
      include: { cliente: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
