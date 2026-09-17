import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearInsumoDto } from './dto/crear-insumo.dto';
import { CategoriaKardex, EstadoGenerico, Prisma, TipoInsumo, TipoMovimiento, TipoMovimientoKardex } from '@prisma/client';

@Injectable()
export class InventarioService {
  constructor(private readonly prisma: PrismaService) {}

  listar(search?: string, familiaId?: string, tipo?: TipoInsumo | string, excluirSoloFormula?: boolean) {
    let tipoEnum: TipoInsumo | undefined = undefined;
    if (tipo && Object.values(TipoInsumo).includes(tipo.toUpperCase() as TipoInsumo)) {
      tipoEnum = tipo.toUpperCase() as TipoInsumo;
    }

    return this.prisma.insumo.findMany({
      where: {
        AND: [
          { estado: EstadoGenerico.ACTIVO },
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
          excluirSoloFormula ? { esSoloFormula: false } : {},
        ],
      },
      include: { familia: true },
      orderBy: { nombre: 'asc' },
    });
  }

  listarFamilias() {
    return this.prisma.familiaInsumo.findMany({ orderBy: { nombre: 'asc' } });
  }

  private async obtenerUsuarioSistema() {
    const user = await this.prisma.usuario.findFirst({ where: { dni: '70000000' } });
    if (!user) throw new NotFoundException('Usuario sistema no encontrado.');
    return user;
  }

  private categoriaKardexSegunTipo(tipo: string | null | undefined, familiaNombre: string): CategoriaKardex {
    const t = String(tipo || '').toUpperCase();
    const fam = String(familiaNombre || '').toLowerCase();
    if (t === 'ENVASE') return CategoriaKardex.ENVASE;
    if (t === 'BASE') return CategoriaKardex.MATERIA_PRIMA;
    if (fam.includes('embalaje') || fam.includes('caja') || fam.includes('etiqueta')) return CategoriaKardex.EMBALAJE;
    if (t === 'PIGMENTO' || t === 'COLORANTE') return CategoriaKardex.INSUMO;
    return CategoriaKardex.MATERIA_PRIMA;
  }

  async crearInsumo(dto: CrearInsumoDto) {
    const codigo = String(dto.codigo || '').trim();
    const nombre = String(dto.nombre || '').trim();
    if (!codigo) throw new BadRequestException('El código (SKU) es obligatorio.');

    const existeSku = await this.prisma.insumo.findUnique({ where: { codigo } });
    if (existeSku) {
      throw new ConflictException(`El código ${codigo} ya existe. Usa un SKU distinto o edita el existente.`);
    }

    const stockInicial = Number(dto.stockInicial || 0);
    const esSoloFormula = Boolean(dto.esSoloFormula);

    return this.prisma.$transaction(async (tx) => {
      const insumo = await tx.insumo.create({
        data: {
          codigo,
          nombre,
          familiaId: dto.familiaId,
          unidadMedida: dto.unidadMedida,
          tipo: dto.tipo ?? 'OTRO',
          estadoFisico: dto.estadoFisico ?? null,
          stockMinimo: dto.stockMinimo ?? 0,
          costoUnitario: dto.costoUnitario ?? 0,
          stockReal: stockInicial,
          stockTeorico: stockInicial,
          esSoloFormula,
        },
        include: { familia: true },
      });

      if (stockInicial > 0) {
        const user = await tx.usuario.findFirst({ where: { dni: '70000000' } });
        const categoria = this.categoriaKardexSegunTipo(insumo.tipo, insumo.familia?.nombre);
        const costo = Number(insumo.costoUnitario || 0);

        await tx.kardexMovimiento.create({
          data: {
            categoriaKardex: categoria,
            productoNombre: insumo.nombre,
            familia: insumo.familia?.nombre || 'General',
            categoriaNombre: insumo.familia?.nombre || 'Químicos Base',
            proveedorCliente: 'ALTA INICIAL - ADMINISTRACION',
            unidadMedida: insumo.unidadMedida,
            fecha: new Date(),
            tipoDoc: 'ALTA',
            tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
            cantidadEntrada: stockInicial,
            cantidadSalida: 0,
            saldoFinal: stockInicial,
            costoUnitario: costo,
            montoEntradaPen: stockInicial * costo,
            montoSaldoPen: stockInicial * costo,
            insumoId: insumo.id,
            usuarioId: user?.id,
          } as any,
        });

        await tx.kardexInmutable.create({
          data: {
            insumoId: insumo.id,
            tipoMovimiento: TipoMovimientoKardex.ENTRADA,
            cantidad: stockInicial,
            stockAnterior: 0,
            stockNuevo: stockInicial,
            documentoReferencia: 'ALTA INICIAL',
            usuarioId: user?.id,
          },
        });
      }

      return insumo;
    });
  }

  async reponerStock(insumoId: string, cantidad: number, documentoReferencia?: string, usuarioId?: string) {
    if (!insumoId) throw new BadRequestException('insumoId es obligatorio.');
    if (!cantidad || cantidad <= 0) throw new BadRequestException('La cantidad debe ser mayor a cero.');

    return this.prisma.$transaction(async (tx) => {
      const insumo = await tx.insumo.findUnique({
        where: { id: insumoId },
        include: { familia: true },
      });
      if (!insumo) throw new NotFoundException('Insumo no encontrado.');

      const stockAnterior = Number(insumo.stockReal || 0);
      const stockNuevo = stockAnterior + cantidad;

      await tx.insumo.update({
        where: { id: insumoId },
        data: { stockReal: stockNuevo, stockTeorico: stockNuevo },
      });

      const user = usuarioId
        ? await tx.usuario.findUnique({ where: { id: usuarioId } })
        : await tx.usuario.findFirst({ where: { dni: '70000000' } });

      const categoria = this.categoriaKardexSegunTipo(insumo.tipo, insumo.familia?.nombre);
      const costo = Number(insumo.costoUnitario || 0);

      await tx.kardexMovimiento.create({
        data: {
          categoriaKardex: categoria,
          productoNombre: insumo.nombre,
          familia: insumo.familia?.nombre || 'General',
          categoriaNombre: insumo.familia?.nombre || 'Químicos Base',
          proveedorCliente: documentoReferencia || 'REPOSICION STOCK - ADMINISTRACION',
          unidadMedida: insumo.unidadMedida,
          fecha: new Date(),
          tipoDoc: 'REPO',
          tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
          cantidadEntrada: cantidad,
          cantidadSalida: 0,
          saldoFinal: stockNuevo,
          costoUnitario: costo,
          montoEntradaPen: cantidad * costo,
          montoSaldoPen: stockNuevo * costo,
          insumoId: insumo.id,
          usuarioId: user?.id,
        } as any,
      });

      await tx.kardexInmutable.create({
        data: {
          insumoId: insumo.id,
          tipoMovimiento: TipoMovimientoKardex.ENTRADA,
          cantidad,
          stockAnterior,
          stockNuevo,
          documentoReferencia: documentoReferencia || 'REPOSICION STOCK',
          usuarioId: user?.id,
        },
      });

      return { ...insumo, stockReal: stockNuevo };
    });
  }

  crearFamilia(nombre: string) {
    const n = String(nombre || '').trim();
    if (!n) throw new Error('Nombre de categoría requerido');
    return this.prisma.familiaInsumo.create({ data: { nombre: n } });
  }

  async actualizarInsumo(id: string, dto: any, user?: any) {
    const insumoActual = await this.prisma.insumo.findUnique({
      where: { id },
      include: { familia: true },
    });
    if (!insumoActual) throw new NotFoundException(`Insumo con ID ${id} no encontrado.`);

    const data: any = {};
    if (dto.nombre !== undefined) data.nombre = String(dto.nombre).trim();
    if (dto.codigo !== undefined) {
      const codigoLimpio = String(dto.codigo).trim().toUpperCase();
      if (codigoLimpio !== insumoActual.codigo) {
        const existe = await this.prisma.insumo.findUnique({ where: { codigo: codigoLimpio } });
        if (existe && existe.id !== id) {
          throw new ConflictException(`Ya existe un insumo con el código ${codigoLimpio}`);
        }
        data.codigo = codigoLimpio;
      }
    }
    if (dto.familiaId) data.familiaId = dto.familiaId;
    if (dto.unidadMedida) data.unidadMedida = dto.unidadMedida;
    if (dto.tipo) data.tipo = dto.tipo;
    if (dto.estadoFisico !== undefined) data.estadoFisico = dto.estadoFisico ? String(dto.estadoFisico).trim() : null;
    if (dto.stockMinimo !== undefined) data.stockMinimo = Number(dto.stockMinimo);
    if (dto.costoUnitario !== undefined) data.costoUnitario = Number(dto.costoUnitario);
    if (dto.esSoloFormula !== undefined) data.esSoloFormula = Boolean(dto.esSoloFormula);

    if (dto.stockReal !== undefined) {
      const nuevoStock = Number(dto.stockReal);
      data.stockReal = nuevoStock;
      data.stockTeorico = nuevoStock;

      const stockAnterior = Number(insumoActual.stockReal || 0);
      const diff = nuevoStock - stockAnterior;

      // Bloqueo: altas de stock solo vía OC RECIBIDA (cantidad exacta cotizada)
      if (diff > 0.0001 && !dto.viaOC) {
        throw new BadRequestException('Alta de stock solo vía Orden de Compra RECIBIDA con cantidad exacta cotizada. Use OC → Recibir.');
      }

      if (Math.abs(diff) > 0.0001) {
        const categoria = this.categoriaKardexSegunTipo(data.tipo || insumoActual.tipo, insumoActual.familia?.nombre);
        const costo = Number(data.costoUnitario !== undefined ? data.costoUnitario : insumoActual.costoUnitario || 0);

        await this.prisma.kardexMovimiento.create({
          data: {
            categoriaKardex: categoria,
            productoNombre: data.nombre || insumoActual.nombre,
            familia: insumoActual.familia?.nombre || 'General',
            categoriaNombre: insumoActual.familia?.nombre || 'Químicos Base',
            proveedorCliente: 'AJUSTE MANUAL - CRUD ADMINISTRACION',
            unidadMedida: data.unidadMedida || insumoActual.unidadMedida,
            fecha: new Date(),
            tipoDoc: 'AJUSTE',
            tipoOperacion: diff >= 0 ? TipoMovimiento.ENTRADA_AJUSTE : TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
            cantidadEntrada: diff >= 0 ? diff : 0,
            cantidadSalida: diff < 0 ? Math.abs(diff) : 0,
            saldoFinal: nuevoStock,
            costoUnitario: costo,
            montoEntradaPen: diff >= 0 ? diff * costo : 0,
            montoSalidaPen: diff < 0 ? Math.abs(diff) * costo : 0,
            montoSaldoPen: nuevoStock * costo,
            insumoId: id,
            usuarioId: user?.id,
          } as any,
        }).catch(() => null);

        await this.prisma.kardexInmutable.create({
          data: {
            insumoId: id,
            tipoMovimiento: TipoMovimientoKardex.AJUSTE_FINO,
            cantidad: Math.abs(diff),
            stockAnterior,
            stockNuevo: nuevoStock,
            documentoReferencia: 'AJUSTE MANUAL CRUD INVENTARIO',
            usuarioId: user?.id,
          },
        }).catch(() => null);
      }
    }

    return this.prisma.insumo.update({ where: { id }, data, include: { familia: true } });
  }

  async eliminarInsumo(id: string) {
    const insumo = await this.prisma.insumo.findUnique({ where: { id } });
    if (!insumo) {
      throw new NotFoundException('Insumo no encontrado');
    }

    const usoFormula = await this.prisma.formulaDetalle.count({ where: { insumoId: id } });
    const usoAjustesFinos = await this.prisma.ajusteFino.count({ where: { insumoId: id } });
    const usoSobrantes = await this.prisma.subAlmacenSobrante.count({ where: { insumoSubproductoId: id } });
    const usoPedidos = await this.prisma.pedidoAditivo.count({ where: { insumoId: id } });

    // Si está vinculado a fórmulas, producción o pedidos, se desactiva (soft-delete) para proteger trazabilidad
    if (usoFormula > 0 || usoAjustesFinos > 0 || usoSobrantes > 0 || usoPedidos > 0) {
      return this.prisma.insumo.update({
        where: { id },
        data: { estado: EstadoGenerico.INACTIVO },
      });
    }

    // Si es un producto de prueba o nuevo sin uso en producción/recetas,
    // eliminamos sus registros de Kardex asociados y borramos físicamente el insumo (liberando su SKU)
    return this.prisma.$transaction(async (tx) => {
      await tx.kardexInmutable.deleteMany({ where: { insumoId: id } });
      await tx.kardexMovimiento.deleteMany({ where: { insumoId: id } });
      return tx.insumo.delete({ where: { id } });
    });
  }

  obtenerPorId(id: string) {
    return this.prisma.insumo.findUniqueOrThrow({
      where: { id },
      include: { familia: true },
    });
  }
}
