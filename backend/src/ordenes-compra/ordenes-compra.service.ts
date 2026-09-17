import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class OrdenesCompraService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.ordenCompra.findMany({
      include: { items: true, proveedor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async crear(dto: any) {
    const total = dto.items.reduce((a: number, it: any) => a + Number(it.cantidad) * Number(it.precioUnitario), 0);
    const codigo = `OC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    let proveedorId = dto.proveedorId;
    if (!proveedorId || !(await this.prisma.proveedor.findUnique({ where: { id: proveedorId } }))) {
      // Crear proveedor al vuelo si no existe
      const prov = await this.prisma.proveedor.create({
        data: { ruc: dto.ruc, razonSocial: dto.proveedorNombre, contacto: dto.comprador || null },
      });
      proveedorId = prov.id;
    }
    const oc = await this.prisma.ordenCompra.create({
      data: {
        codigoOC: codigo,
        proveedorId,
        ruc: dto.ruc,
        proveedorNombre: dto.proveedorNombre,
        fechaEmision: new Date(),
        fechaEntregaEstimada: new Date(dto.fechaEntregaEstimada),
        estado: 'PENDIENTE',
        totalPEN: total,
        moneda: 'PEN',
        condicionPago: dto.condicionPago || 'Contado',
        comprador: dto.comprador || 'Administración',
        observaciones: dto.observaciones,
        items: {
          create: dto.items.map((it: any) => ({
            insumoId: it.insumoId || null,
            insumoNombre: it.insumoNombre,
            cantidad: it.cantidad,
            unidadMedida: it.unidadMedida,
            precioUnitario: it.precioUnitario,
            subtotal: Number(it.cantidad) * Number(it.precioUnitario),
          })),
        },
      },
      include: { items: true },
    });
    return oc;
  }

  async marcarRecibido(id: string) {
    const oc = await this.prisma.ordenCompra.findUnique({ where: { id }, include: { items: true } });
    if (!oc) throw new Error('OC no encontrada');
    if (oc.estado === 'RECIBIDO') return oc;
    // Actualizar stock y Kardex por cada item que tenga insumoId
    for (const it of oc.items) {
      if (it.insumoId) {
        const insumo = await this.prisma.insumo.findUnique({ where: { id: it.insumoId } });
        if (insumo) {
          const nuevoStock = Number(insumo.stockReal) + Number(it.cantidad);
          await this.prisma.insumo.update({ where: { id: it.insumoId }, data: { stockReal: nuevoStock } });
          // Kardex entrada
          await this.prisma.kardexInmutable.create({
            data: {
              insumoId: it.insumoId,
              tipoMovimiento: 'ENTRADA',
              cantidad: it.cantidad,
              stockAnterior: insumo.stockReal,
              stockNuevo: nuevoStock,
              documentoReferencia: oc.codigoOC,
              usuarioId: (await this.prisma.usuario.findFirst())!.id,
            },
          }).catch(() => {});
        }
      }
    }
    return this.prisma.ordenCompra.update({ where: { id }, data: { estado: 'RECIBIDO' }, include: { items: true } });
  }

  async anular(id: string) {
    return this.prisma.ordenCompra.update({ where: { id }, data: { estado: 'ANULADA' } });
  }
}
