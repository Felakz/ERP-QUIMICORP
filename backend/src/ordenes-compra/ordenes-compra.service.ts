import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoriaKardex,
  Prisma,
  TipoInsumo,
  TipoMovimiento,
  TipoMovimientoKardex,
  UnidadMedida,
} from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';

const RECEPCION_MAX_REINTENTOS = 3;

@Injectable()
export class OrdenesCompraService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.ordenCompra.findMany({
      include: { items: { include: { insumo: true } }, proveedor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async crear(dto: CrearOrdenCompraDto) {
    if (!dto.items.length) throw new BadRequestException('La OC debe contener al menos un insumo.');

    const total = dto.items.reduce(
      (acumulado, item) => acumulado + Number(item.cantidad) * Number(item.precioUnitario),
      0,
    );
    const codigo = `OC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    let proveedorId = dto.proveedorId;

    if (proveedorId) {
      const proveedor = await this.prisma.proveedor.findUnique({ where: { id: proveedorId } });
      if (!proveedor) throw new NotFoundException('Proveedor no encontrado.');
    } else {
      const proveedor = await this.prisma.proveedor.create({
        data: {
          ruc: dto.ruc,
          razonSocial: dto.proveedorNombre,
          contacto: dto.comprador || null,
        },
      });
      proveedorId = proveedor.id;
    }

    return this.prisma.ordenCompra.create({
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
          create: dto.items.map((item) => ({
            insumoId: item.insumoId || null,
            insumoNombre: item.insumoNombre.trim(),
            cantidad: this.validarCantidad(item.cantidad),
            unidadMedida: this.normalizarUnidad(item.unidadMedida),
            precioUnitario: this.validarPrecio(item.precioUnitario),
            subtotal: Number(item.cantidad) * Number(item.precioUnitario),
          })),
        },
      },
      include: { items: true },
    });
  }

  async marcarRecibido(id: string) {
    for (let intento = 1; intento <= RECEPCION_MAX_REINTENTOS; intento += 1) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const oc = await tx.ordenCompra.findUnique({
              where: { id },
              include: { items: true },
            });
            if (!oc) throw new NotFoundException('OC no encontrada.');
            if (oc.estado === 'ANULADA') throw new ConflictException('Una OC anulada no puede recibirse.');
            if (oc.estado === 'RECIBIDO') return oc;

            const usuario = await tx.usuario.findFirst({ where: { dni: '70000000' } });
            if (!usuario) throw new NotFoundException('Usuario sistema no encontrado.');

            for (const item of oc.items) {
              await this.procesarRecepcionItem(tx, oc, item, usuario.id);
            }

            return tx.ordenCompra.update({
              where: { id: oc.id },
              data: { estado: 'RECIBIDO' },
              include: { items: { include: { insumo: true } } },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (error) {
        if (this.esConflictoTransaccional(error) && intento < RECEPCION_MAX_REINTENTOS) continue;
        throw error;
      }
    }

    throw new ConflictException('No se pudo completar la recepción de la OC.');
  }

  async anular(id: string) {
    const oc = await this.prisma.ordenCompra.findUnique({ where: { id } });
    if (!oc) throw new NotFoundException('OC no encontrada.');
    if (oc.estado === 'RECIBIDO') throw new ConflictException('Una OC recibida no puede anularse.');
    return this.prisma.ordenCompra.update({ where: { id }, data: { estado: 'ANULADA' } });
  }

  private async procesarRecepcionItem(
    tx: Prisma.TransactionClient,
    oc: Prisma.OrdenCompraGetPayload<{ include: { items: true } }>,
    item: Prisma.OrdenCompraItemGetPayload<{}>,
    usuarioId: string,
  ) {
    const cantidad = this.validarCantidad(Number(item.cantidad));
    const precioCompra = this.validarPrecio(Number(item.precioUnitario));
    const insumo = item.insumoId
      ? await tx.insumo.findUnique({ where: { id: item.insumoId }, include: { familia: true } })
      : await this.buscarInsumoPorNombre(tx, item.insumoNombre);

    const insumoFinal = insumo || (await this.crearInsumoDesdeOC(tx, item));
    if (item.insumoId && !insumo) throw new NotFoundException(`Insumo ${item.insumoNombre} no encontrado.`);

    if (!item.insumoId || item.insumoId !== insumoFinal.id) {
      await tx.ordenCompraItem.update({ where: { id: item.id }, data: { insumoId: insumoFinal.id } });
    }

    const stockAnterior = Number(insumoFinal.stockReal);
    const costoAnterior = Number(insumoFinal.costoUnitario);
    const valorAnterior = stockAnterior * costoAnterior;
    const valorCompra = cantidad * precioCompra;
    const stockNuevo = stockAnterior + cantidad;
    const costoPromedio = stockNuevo > 0 ? (valorAnterior + valorCompra) / stockNuevo : precioCompra;
    const categoria = this.categoriaKardex(insumoFinal.tipo, insumoFinal.familia.nombre);

    await tx.insumo.update({
      where: { id: insumoFinal.id },
      data: {
        stockReal: stockNuevo,
        stockTeorico: stockNuevo,
        costoUnitario: costoPromedio,
      },
    });

    await tx.kardexMovimiento.create({
      data: {
        categoriaKardex: categoria,
        productoNombre: insumoFinal.nombre,
        familia: insumoFinal.familia.nombre,
        categoriaNombre: insumoFinal.familia.nombre,
        proveedorCliente: oc.proveedorNombre,
        unidadMedida: insumoFinal.unidadMedida,
        fecha: new Date(),
        tipoDoc: 'OC',
        numero: oc.codigoOC,
        tipoOperacion: TipoMovimiento.ENTRADA_COMPRA,
        cantidadEntrada: cantidad,
        cantidadSalida: 0,
        saldoFinal: stockNuevo,
        costoUnitario: precioCompra,
        montoEntradaPen: valorCompra,
        montoSaldoPen: stockNuevo * costoPromedio,
        insumoId: insumoFinal.id,
        usuarioId,
      },
    });

    await tx.kardexInmutable.create({
      data: {
        insumoId: insumoFinal.id,
        tipoMovimiento: TipoMovimientoKardex.ENTRADA,
        cantidad,
        stockAnterior,
        stockNuevo,
        documentoReferencia: oc.codigoOC,
        usuarioId,
      },
    });
  }

  private async buscarInsumoPorNombre(tx: Prisma.TransactionClient, nombre: string) {
    return tx.insumo.findFirst({
      where: { nombre: { equals: nombre.trim(), mode: 'insensitive' } },
      include: { familia: true },
    });
  }

  private async crearInsumoDesdeOC(tx: Prisma.TransactionClient, item: Prisma.OrdenCompraItemGetPayload<{}>) {
    const nombre = item.insumoNombre.trim();
    const esColorante = /colorante/i.test(nombre);
    const familiaNombre = esColorante ? 'COLORANTES' : 'INSUMOS GENERALES';
    const familiaExistente = await tx.familiaInsumo.findFirst({
      where: { nombre: { equals: familiaNombre, mode: 'insensitive' } },
    });
    const familia = familiaExistente || (await tx.familiaInsumo.create({ data: { nombre: familiaNombre } }));
    const codigo = await this.siguienteCodigo(tx, esColorante ? 'COL-' : 'INS-');
    const tipo: TipoInsumo = esColorante ? TipoInsumo.PIGMENTO : TipoInsumo.OTRO;

    return tx.insumo.create({
      data: {
        codigo,
        nombre,
        familiaId: familia.id,
        unidadMedida: this.normalizarUnidad(item.unidadMedida),
        tipo,
        stockReal: 0,
        stockTeorico: 0,
        costoUnitario: 0,
      },
      include: { familia: true },
    });
  }

  private async siguienteCodigo(tx: Prisma.TransactionClient, prefijo: string) {
    const insumos = await tx.insumo.findMany({
      where: { codigo: { startsWith: prefijo } },
      select: { codigo: true },
    });
    const usados = new Set(
      insumos
        .map((insumo) => Number(insumo.codigo.slice(prefijo.length)))
        .filter((numero) => Number.isInteger(numero) && numero > 0),
    );
    let siguiente = 1;
    while (usados.has(siguiente)) siguiente += 1;
    return `${prefijo}${String(siguiente).padStart(3, '0')}`;
  }

  private normalizarUnidad(unidad: string): UnidadMedida {
    const valor = unidad.trim().toUpperCase();
    const equivalencias: Record<string, UnidadMedida> = {
      KG: UnidadMedida.KG,
      KILO: UnidadMedida.KG,
      KILOS: UnidadMedida.KG,
      L: UnidadMedida.L,
      LT: UnidadMedida.L,
      LITRO: UnidadMedida.L,
      LITROS: UnidadMedida.L,
      GR: UnidadMedida.GR,
      G: UnidadMedida.GR,
      ML: UnidadMedida.ML,
      UN: UnidadMedida.UN,
      UND: UnidadMedida.UN,
      UNIDAD: UnidadMedida.UN,
    };
    const unidadNormalizada = equivalencias[valor];
    if (!unidadNormalizada) throw new BadRequestException(`Unidad de medida no soportada: ${unidad}.`);
    return unidadNormalizada;
  }

  private validarCantidad(cantidad: number) {
    if (!Number.isFinite(cantidad) || cantidad <= 0) throw new BadRequestException('La cantidad debe ser mayor que cero.');
    return cantidad;
  }

  private validarPrecio(precio: number) {
    if (!Number.isFinite(precio) || precio <= 0) throw new BadRequestException('El precio unitario debe ser mayor que cero.');
    return precio;
  }

  private categoriaKardex(tipo: TipoInsumo | null, familia: string): CategoriaKardex {
    if (tipo === TipoInsumo.ENVASE) return CategoriaKardex.ENVASE;
    if (tipo === TipoInsumo.BASE) return CategoriaKardex.MATERIA_PRIMA;
    if (/embalaje|caja|etiqueta/i.test(familia)) return CategoriaKardex.EMBALAJE;
    return CategoriaKardex.INSUMO;
  }

  private esConflictoTransaccional(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';
  }
}
