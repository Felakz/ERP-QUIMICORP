import { Injectable } from '@nestjs/common';
import { EstadoSubAlmacen } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SubAlmacenService {
  constructor(private readonly prisma: PrismaService) {}

  listarDisponibles() {
    return this.prisma.subAlmacenSobrante.findMany({
      where: { estado: EstadoSubAlmacen.DISPONIBLE },
      include: {
        insumoSubproducto: true,
        loteOrigen: { select: { codigoLote: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  marcarReusado(id: string) {
    return this.prisma.subAlmacenSobrante.update({
      where: { id },
      data: { estado: EstadoSubAlmacen.REUSADO },
    });
  }

  registrarSobrante(data: {
    loteOrigenId: string;
    insumoSubproductoId: string;
    pesoDisponible: number;
    ubicacion: string;
  }) {
    return this.prisma.subAlmacenSobrante.create({ data });
  }
}
