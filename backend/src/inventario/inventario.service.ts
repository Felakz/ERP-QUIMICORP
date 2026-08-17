import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearInsumoDto } from './dto/crear-insumo.dto';
import { TipoInsumo } from '@prisma/client';

@Injectable()
export class InventarioService {
  constructor(private readonly prisma: PrismaService) {}

  crearInsumo(dto: CrearInsumoDto) {
    return this.prisma.insumo.create({
      data: {
        codigo: dto.codigo,
        nombre: dto.nombre,
        familiaId: dto.familiaId,
        unidadMedida: dto.unidadMedida,
        stockMinimo: dto.stockMinimo ?? 0,
        costoUnitario: dto.costoUnitario ?? 0,
      },
    });
  }

  listar(search?: string, familiaId?: string, tipo?: TipoInsumo | string) {
    let tipoEnum: TipoInsumo | undefined = undefined;
    if (tipo && Object.values(TipoInsumo).includes(tipo.toUpperCase() as TipoInsumo)) {
      tipoEnum = tipo.toUpperCase() as TipoInsumo;
    }

    return this.prisma.insumo.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { nombre: { contains: search, mode: 'insensitive' } },
                  { codigo: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          familiaId ? { familiaId } : {},
          tipoEnum ? { tipo: tipoEnum } : {},
        ],
      },
      include: { familia: true },
      orderBy: { nombre: 'asc' },
    });
  }

  listarFamilias() {
    return this.prisma.familiaInsumo.findMany({ orderBy: { nombre: 'asc' } });
  }

  obtenerPorId(id: string) {
    return this.prisma.insumo.findUniqueOrThrow({
      where: { id },
      include: { familia: true },
    });
  }
}
