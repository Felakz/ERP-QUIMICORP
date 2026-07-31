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

  listar() {
    return this.prisma.formulaMaster.findMany({
      include: { detalles: { include: { insumo: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  activar(id: string) {
    return this.prisma.formulaMaster.update({
      where: { id },
      data: { estado: EstadoFormula.ACTIVA },
    });
  }
}
