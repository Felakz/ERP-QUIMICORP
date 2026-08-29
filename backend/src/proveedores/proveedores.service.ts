import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.proveedor.findMany({
      include: {
        cuentasBancarias: true,
        _count: {
          select: { cotizaciones: true },
        },
      },
      orderBy: { razonSocial: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    const prov = await this.prisma.proveedor.findUnique({
      where: { id },
      include: {
        cuentasBancarias: true,
        cotizaciones: {
          include: { insumo: true },
          orderBy: { fechaCotizacion: 'desc' },
        },
      },
    });
    if (!prov) throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    return prov;
  }

  async crear(dto: CrearProveedorDto) {
    const { cuentasBancarias, ...datosProveedor } = dto;
    return this.prisma.proveedor.create({
      data: {
        ...datosProveedor,
        cuentasBancarias: cuentasBancarias && cuentasBancarias.length > 0
          ? {
              create: cuentasBancarias.map((c) => ({
                banco: c.banco,
                moneda: c.moneda,
                numeroCuenta: c.numeroCuenta,
                cci: c.cci,
              })),
            }
          : undefined,
      },
      include: {
        cuentasBancarias: true,
      },
    });
  }

  async eliminar(id: string) {
    await this.buscarPorId(id);
    return this.prisma.proveedor.delete({
      where: { id },
    });
  }
}
