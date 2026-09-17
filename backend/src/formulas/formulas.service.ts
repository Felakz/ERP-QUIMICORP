import { BadRequestException, Injectable } from '@nestjs/common';
import { EstadoFormula } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearFormulaDto } from './dto/crear-formula.dto';

@Injectable()
export class FormulasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearFormulaDto) {
    const sumaPorcentajes = dto.detalles.reduce((acc, d) => acc + (Number(d.porcentaje) || 0), 0);
    if (Math.abs(sumaPorcentajes - 100) > 0.01) {
      throw new BadRequestException(
        `La suma de porcentajes debe ser exactamente 100%. Actual: ${sumaPorcentajes.toFixed(2)}%.`,
      );
    }

    const cod = dto.codigoFormula.trim().toUpperCase();
    const existente = await this.prisma.formulaMaster.findUnique({
      where: { codigoFormula: cod },
    });
    if (existente) {
      throw new BadRequestException(`El código de fórmula "${cod}" ya está registrado.`);
    }

    return this.prisma.formulaMaster.create({
      data: {
        codigoFormula: cod,
        nombreProducto: dto.nombreProducto.trim().toUpperCase(),
        densidadTeorica: Number(dto.densidadTeorica) || 1.0,
        estado: dto.estado || EstadoFormula.ACTIVA,
        pasosElaboracion: dto.pasosElaboracion || null,
        detalles: {
          create: dto.detalles.map((d) => {
            const porc = Number(d.porcentaje) || 0;
            return {
              insumoId: d.insumoId || null,
              nombreComponente: d.nombreComponente || null,
              skuComponente: d.skuComponente || null,
              porcentaje: porc,
              pesoMasaTeorico: Number((porc * 10).toFixed(3)), // referencial para 1000 kg/L base
            };
          }),
        },
      },
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
  }

  async listar(search?: string) {
    const where: any = {
      OR: [
        { detalles: { some: {} } },
        { variants: { some: {} } },
      ],
    };
    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        {
          OR: [
            { nombreProducto: { contains: q, mode: 'insensitive' } },
            { codigoFormula: { contains: q, mode: 'insensitive' } },
            { variants: { some: { nombre: { contains: q, mode: 'insensitive' } } } },
            { variants: { some: { cliente: { razonSocial: { contains: q, mode: 'insensitive' } } } } },
          ],
        },
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

  async actualizarFormula(id: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const formula = await tx.formulaMaster.findUnique({ where: { id } });
      if (!formula) throw new BadRequestException('Fórmula no encontrada.');

      // Validar suma de porcentajes = 100% al actualizar (paridad con la creación).
      if (Array.isArray(dto.detalles) && dto.detalles.length > 0) {
        const suma = dto.detalles.reduce((acc: number, d: any) => acc + (parseFloat(d.porcentaje) || 0), 0);
        if (Math.abs(suma - 100) > 0.01) {
          throw new BadRequestException('La suma de porcentajes de los componentes debe ser 100%.');
        }
      }

      await tx.formulaMaster.update({
        where: { id },
        data: {
          nombreProducto: dto.nombreProducto || formula.nombreProducto,
          densidadTeorica: dto.densidadTeorica ? parseFloat(dto.densidadTeorica) : formula.densidadTeorica,
          pasosElaboracion: dto.pasosElaboracion !== undefined ? dto.pasosElaboracion : formula.pasosElaboracion,
        },
      });

      if (Array.isArray(dto.detalles)) {
        await tx.formulaDetalle.deleteMany({ where: { formulaId: id } });
        for (const item of dto.detalles) {
          const porc = parseFloat(item.porcentaje) || 0;
          await tx.formulaDetalle.create({
            data: {
              formulaId: id,
              insumoId: item.insumoId || null,
              nombreComponente: item.nombreComponente || 'Insumo',
              porcentaje: porc,
              pesoMasaTeorico: item.pesoMasaTeorico ? parseFloat(item.pesoMasaTeorico) : parseFloat((porc * 10).toFixed(3)),
            },
          });
        }
      }

      return tx.formulaMaster.findUnique({
        where: { id },
        include: {
          detalles: { include: { insumo: true } },
          variants: { include: { cliente: true } },
        },
      });
    });
  }

  async actualizarVariante(variantId: string, dto: any) {
    const v = await this.prisma.formulaVariant.findUnique({ where: { id: variantId } });
    if (!v) throw new BadRequestException('Variante no encontrada.');

    return this.prisma.formulaVariant.update({
      where: { id: variantId },
      data: {
        nombre: dto.nombre || v.nombre,
        clienteId: dto.clienteId !== undefined ? dto.clienteId : v.clienteId,
        notas: dto.notas !== undefined ? dto.notas : v.notas,
        pasosElaboracion: dto.pasosElaboracion !== undefined ? dto.pasosElaboracion : v.pasosElaboracion,
      },
      include: { cliente: true },
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
