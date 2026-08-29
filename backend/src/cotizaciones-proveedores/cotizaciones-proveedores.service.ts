import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';

@Injectable()
export class CotizacionesProveedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(insumoId?: string, proveedorId?: string) {
    const where: any = {};
    if (insumoId) where.insumoId = insumoId;
    if (proveedorId) where.proveedorId = proveedorId;

    return this.prisma.cotizacionProveedor.findMany({
      where,
      include: {
        proveedor: true,
        insumo: true,
      },
      orderBy: { fechaCotizacion: 'desc' },
    });
  }

  async obtenerComparativaPorInsumo(insumoId: string) {
    const cotizaciones = await this.prisma.cotizacionProveedor.findMany({
      where: { insumoId },
      include: {
        proveedor: true,
        insumo: true,
      },
      orderBy: { fechaCotizacion: 'desc' },
    });

    // Agrupar por proveedor tomando la última cotización
    const proveedoresMap = new Map<string, any>();
    for (const cot of cotizaciones) {
      if (!proveedoresMap.has(cot.proveedorId)) {
        proveedoresMap.set(cot.proveedorId, cot);
      }
    }

    const ranking = Array.from(proveedoresMap.values()).sort(
      (a, b) => Number(a.precioUnitario) - Number(b.precioUnitario),
    );

    return {
      insumoId,
      totalProveedoresCotizantes: ranking.length,
      mejorPrecio: ranking[0] || null,
      ranking,
      historialCompleto: cotizaciones,
    };
  }

  async crear(dto: CrearCotizacionDto) {
    // 1. Buscar la última cotización previa de este proveedor para este insumo
    const previa = await this.prisma.cotizacionProveedor.findFirst({
      where: {
        proveedorId: dto.proveedorId,
        insumoId: dto.insumoId,
      },
      orderBy: { fechaCotizacion: 'desc' },
    });

    let variacionPorcentual: number | null = null;
    if (previa && Number(previa.precioUnitario) > 0) {
      const precioAnt = Number(previa.precioUnitario);
      const precioNuevo = Number(dto.precioUnitario);
      variacionPorcentual = Number((((precioNuevo - precioAnt) / precioAnt) * 100).toFixed(2));
    }

    return this.prisma.cotizacionProveedor.create({
      data: {
        proveedorId: dto.proveedorId,
        insumoId: dto.insumoId,
        precioUnitario: dto.precioUnitario,
        moneda: dto.moneda || 'SOLES',
        unidadMedida: dto.unidadMedida || 'KG',
        numCotizacion: dto.numCotizacion,
        fechaCotizacion: dto.fechaCotizacion ? new Date(dto.fechaCotizacion) : new Date(),
        variacionPorcentual,
        observaciones: dto.observaciones,
      },
      include: {
        proveedor: true,
        insumo: true,
      },
    });
  }

  async eliminar(id: string) {
    return this.prisma.cotizacionProveedor.delete({
      where: { id },
    });
  }
}
