import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { EstadoFormula } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearFormulaDto } from './dto/crear-formula.dto';
import { auditarFormula, detallesVinculados } from './formula-integrity';

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

  async crear(dto: CrearFormulaDto, actorId: string) {
    return this.prisma.$transaction(async tx => {
    const detalles = await detallesVinculados(tx, dto.detalles);
    const porcentajes = this.normalizarPorcentajes(detalles.map(d => d.porcentaje));

    const cod = dto.codigoFormula.trim().toUpperCase();
    const existente = await tx.formulaMaster.findUnique({
      where: { codigoFormula: cod },
    });
    if (existente) {
      throw new BadRequestException(`El código de fórmula "${cod}" ya está registrado.`);
    }

    const created = await tx.formulaMaster.create({
      data: {
        codigoFormula: cod,
        nombreProducto: dto.nombreProducto.trim().toUpperCase(),
        densidadTeorica: Number(dto.densidadTeorica) || 1.0,
        estado: dto.estado || EstadoFormula.ACTIVA,
        pasosElaboracion: dto.pasosElaboracion || null,
        detalles: {
          create: detalles.map((d, idx) => {
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
    await auditarFormula(tx, actorId, 'CREAR_FORMULA', null, created);
    return created;
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
      await detallesVinculados(tx, origen.detalles, origen.detalles);
      const nuevaFormula = await tx.formulaMaster.create({
        data: {
          codigoFormula: codigo!,
          nombreProducto: dto.nuevoNombre.trim(),
          densidadTeorica: origen.densidadTeorica,
          estado: EstadoFormula.ACTIVA,
          detalles: {
            create: origen.detalles.map((d) => ({
              insumoId: d.insumoId,
              nombreComponente: d.nombreComponente,
              skuComponente: d.skuComponente,
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

  async actualizarFormula(id: string, dto: any, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM formulas_master WHERE id = ${id} FOR UPDATE`;
      const formula = await tx.formulaMaster.findUnique({ where: { id }, include: { detalles: { include: { insumo: true } } } });
      if (!formula) throw new BadRequestException('Fórmula no encontrada.');
      if (!dto.expectedUpdatedAt || new Date(dto.expectedUpdatedAt).getTime() !== formula.updatedAt.getTime()) {
        throw new ConflictException('La fórmula cambió o falta su versión de edición. Recargue la página antes de guardar.');
      }
      const detalles = dto.detalles === undefined ? null : await detallesVinculados(tx, dto.detalles, formula.detalles);

      // Los detalles se normalizan a 100% exacto (acepta cualquier total mayor a 0).
      let porcentajesNormalizados: number[] | null = null;
      if (detalles) {
        porcentajesNormalizados = this.normalizarPorcentajes(
          detalles.map(d => d.porcentaje),
        );
      }

      if (dto.codigoFormula && dto.codigoFormula.trim().toUpperCase() !== formula.codigoFormula) {
        const nuevoCodigo = dto.codigoFormula.trim().toUpperCase();
        const existeCod = await tx.formulaMaster.findUnique({ where: { codigoFormula: nuevoCodigo } });
        if (existeCod && existeCod.id !== id) {
          throw new BadRequestException(`El código de fórmula "${nuevoCodigo}" ya está en uso.`);
        }
      }

      await tx.formulaMaster.update({
        where: { id },
        data: {
          codigoFormula: dto.codigoFormula ? dto.codigoFormula.trim().toUpperCase() : formula.codigoFormula,
          nombreProducto: dto.nombreProducto ? dto.nombreProducto.trim().toUpperCase() : formula.nombreProducto,
          estado: dto.estado || formula.estado,
          densidadTeorica: dto.densidadTeorica ? parseFloat(dto.densidadTeorica) : formula.densidadTeorica,
          pasosElaboracion: dto.pasosElaboracion !== undefined ? dto.pasosElaboracion : formula.pasosElaboracion,
          version: { increment: 1 },
        },
      });

      if (detalles) {
        // Keep stable detail IDs. Only explicitly removed ingredients are deleted.
        await tx.formulaDetalle.deleteMany({ where: { formulaId: id, id: { notIn: detalles.map(d => d.id).filter(Boolean) } } });
        for (let idx = 0; idx < detalles.length; idx++) {
          const item = detalles[idx], porc = porcentajesNormalizados![idx];
          const data = { insumoId: item.insumoId, nombreComponente: item.nombreComponente, skuComponente: item.skuComponente,
            porcentaje: porc, pesoMasaTeorico: Number((porc * 10).toFixed(3)) };
          if (item.id) await tx.formulaDetalle.update({ where: { id: item.id }, data });
          else await tx.formulaDetalle.create({ data: { formulaId: id, ...data } });
        }
      }

      const updated = await tx.formulaMaster.findUnique({
        where: { id },
        include: {
          detalles: { include: { insumo: true } },
          variants: { include: { cliente: true } },
        },
      });
      await auditarFormula(tx, actorId, 'EDITAR_FORMULA', formula, updated);
      return updated;
    });
  }

  async eliminar(id: string) {
    const formula = await this.prisma.formulaMaster.findUnique({
      where: { id },
      include: {
        ordenesProduccion: { select: { id: true, codigoLote: true } },
        pedidosComerciales: { select: { id: true, codigoOrden: true } },
      },
    });

    if (!formula) {
      throw new BadRequestException('Fórmula no encontrada.');
    }

    if (formula.ordenesProduccion.length > 0 || formula.pedidosComerciales.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la fórmula "${formula.codigoFormula}" porque tiene historial en planta (${formula.ordenesProduccion.length} orden(es) de producción y ${formula.pedidosComerciales.length} pedido(s) asociados). Para desactivarla, cambia su estado a INACTIVA.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.formulaVariant.deleteMany({ where: { formulaId: id } });
      await tx.formulaDetalle.deleteMany({ where: { formulaId: id } });
      await tx.formulaMaster.delete({ where: { id } });

      return {
        ok: true,
        mensaje: `Fórmula "${formula.codigoFormula} - ${formula.nombreProducto}" eliminada correctamente.`,
      };
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
