import { BadRequestException, Injectable } from '@nestjs/common';
import { EstadoFormula } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearFormulaDto } from './dto/crear-formula.dto';

@Injectable()
export class FormulasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Normaliza cualquier dosificación total (mayor a 0) a exactamente 100%,
   * preservando las proporciones y corrigiendo el residuo en el componente mayoritario.
   * Así el registro nunca se bloquea por merma o redondeo.
   */
  private normalizarPorcentajes(valores: number[]): number[] {
    const total = valores.reduce((acc, v) => acc + (Number(v) || 0), 0);
    if (total <= 0) {
      throw new BadRequestException('La dosificación total debe ser mayor a 0.');
    }
    if (Math.abs(total - 100) <= 0.01) return valores.map((v) => Number(v) || 0);
    const factor = 100 / total;
    const escalados = valores.map((v) => {
      const e = Number((((Number(v) || 0) * factor) as number).toFixed(4));
      return (Number(v) || 0) > 0 && e < 0.001 ? 0.001 : e;
    });
    const suma = escalados.reduce((acc, v) => acc + v, 0);
    const residuo = Number((100 - suma).toFixed(4));
    if (Math.abs(residuo) > 0.00001) {
      let idx = 0;
      escalados.forEach((v, i) => {
        if (v > escalados[idx]) idx = i;
      });
      escalados[idx] = Number((escalados[idx] + residuo).toFixed(4));
    }
    return escalados;
  }

  async crear(dto: CrearFormulaDto) {
    const porcentajes = this.normalizarPorcentajes(dto.detalles.map((d) => Number(d.porcentaje) || 0));

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
          create: dto.detalles.map((d, idx) => {
            const porc = porcentajes[idx];
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

      // Los detalles se normalizan a 100% exacto (acepta cualquier total mayor a 0).
      let porcentajesNormalizados: number[] | null = null;
      if (Array.isArray(dto.detalles) && dto.detalles.length > 0) {
        porcentajesNormalizados = this.normalizarPorcentajes(
          dto.detalles.map((d: any) => Number(d.porcentaje) || 0),
        );
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
        for (let idx = 0; idx < dto.detalles.length; idx++) {
          const item = dto.detalles[idx];
          const porc = porcentajesNormalizados ? porcentajesNormalizados[idx] : parseFloat(item.porcentaje) || 0;
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
