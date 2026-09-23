import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoriaKardex,
  Prisma,
  Role,
  TipoInsumo,
  TipoMovimiento,
  TipoMovimientoKardex,
  UnidadMedida,
} from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';
import { ActualizarOrdenCompraDto } from './dto/actualizar-orden-compra.dto';

const RECEPCION_MAX_REINTENTOS = 3;
export const MAX_EDICIONES_ASISTENTE = 2;

export function parseEdicionesOC(observaciones: string | null | undefined): number {
  if (!observaciones) return 0;
  const match = observaciones.match(/\[EDICIONES:\s*(\d+)\]/i);
  return match ? parseInt(match[1], 10) : 0;
}

export function formatObservacionesConEdiciones(observaciones: string | null | undefined, count: number): string {
  const base = (observaciones || '').replace(/\s*\[EDICIONES:\s*\d+\]/gi, '').trim();
  if (count <= 0) return base || '';
  return base ? `${base} [EDICIONES: ${count}]` : `[EDICIONES: ${count}]`;
}

@Injectable()
export class OrdenesCompraService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    const ordenes = await this.prisma.ordenCompra.findMany({
      include: { items: { include: { insumo: true } }, proveedor: true },
      orderBy: { createdAt: 'desc' },
    });

    return ordenes.map((oc) => ({
      ...oc,
      edicionesCount: parseEdicionesOC(oc.observaciones),
      maxEdicionesAsistente: MAX_EDICIONES_ASISTENTE,
    }));
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

  async actualizar(id: string, dto: ActualizarOrdenCompraDto, user?: any) {
    const oc = await this.prisma.ordenCompra.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!oc) throw new NotFoundException('Orden de Compra no encontrada.');
    if (oc.estado === 'RECIBIDO') {
      throw new BadRequestException('No se puede modificar una Orden de Compra que ya fue ingresada a Kardex.');
    }
    if (oc.estado === 'ANULADA') {
      throw new BadRequestException('No se puede modificar una Orden de Compra anulada.');
    }

    const role = user?.role;
    const esAdminOGerencia =
      role === Role.GERENCIA ||
      role === Role.ADMINISTRACION ||
      role === Role.GERENTE_ADMINISTRATIVO;

    const currentEdits = parseEdicionesOC(oc.observaciones);

    let nuevoCount = currentEdits;
    if (!esAdminOGerencia) {
      if (currentEdits >= MAX_EDICIONES_ASISTENTE) {
        throw new BadRequestException(
          `Has alcanzado el límite máximo de ${MAX_EDICIONES_ASISTENTE} ediciones permitidas para tu rol en la orden ${oc.codigoOC}. Para correcciones adicionales, solicita autorización a Gerencia o Administración.`,
        );
      }
      nuevoCount = currentEdits + 1;
    }

    return this.prisma.$transaction(async (tx) => {
      let proveedorId = dto.proveedorId || oc.proveedorId;

      if (dto.proveedorNombre && dto.proveedorNombre.trim() !== oc.proveedorNombre) {
        if (dto.proveedorId) {
          const prov = await tx.proveedor.findUnique({ where: { id: dto.proveedorId } });
          if (!prov) throw new NotFoundException('Proveedor no encontrado.');
        } else {
          const prov = await tx.proveedor.create({
            data: {
              ruc: dto.ruc || oc.ruc,
              razonSocial: dto.proveedorNombre.trim(),
              contacto: dto.comprador || oc.comprador || null,
            },
          });
          proveedorId = prov.id;
        }
      }

      let total = Number(oc.totalPEN);
      if (dto.items && dto.items.length > 0) {
        await tx.ordenCompraItem.deleteMany({ where: { ordenCompraId: id } });

        total = dto.items.reduce(
          (acumulado, item) => acumulado + Number(item.cantidad) * Number(item.precioUnitario),
          0,
        );

        await tx.ordenCompraItem.createMany({
          data: dto.items.map((item) => ({
            ordenCompraId: id,
            insumoId: item.insumoId || null,
            insumoNombre: item.insumoNombre.trim(),
            cantidad: this.validarCantidad(Number(item.cantidad)),
            unidadMedida: this.normalizarUnidad(item.unidadMedida),
            precioUnitario: this.validarPrecio(Number(item.precioUnitario)),
            subtotal: Number(item.cantidad) * Number(item.precioUnitario),
          })),
        });
      }

      const obsTexto = dto.observaciones !== undefined ? dto.observaciones : oc.observaciones;
      const obsFinal = formatObservacionesConEdiciones(obsTexto, nuevoCount);

      const actualizada = await tx.ordenCompra.update({
        where: { id },
        data: {
          proveedorId,
          proveedorNombre: dto.proveedorNombre ? dto.proveedorNombre.trim() : oc.proveedorNombre,
          ruc: dto.ruc ? dto.ruc.trim() : oc.ruc,
          fechaEntregaEstimada: dto.fechaEntregaEstimada ? new Date(dto.fechaEntregaEstimada) : oc.fechaEntregaEstimada,
          condicionPago: dto.condicionPago || oc.condicionPago,
          comprador: dto.comprador || oc.comprador,
          observaciones: obsFinal,
          totalPEN: total,
        },
        include: { items: { include: { insumo: true } }, proveedor: true },
      });

      return {
        ...actualizada,
        edicionesCount: nuevoCount,
        maxEdicionesAsistente: MAX_EDICIONES_ASISTENTE,
      };
    });
  }

  async eliminar(id: string, user?: any) {
    const oc = await this.prisma.ordenCompra.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!oc) throw new NotFoundException('Orden de Compra no encontrada.');
    if (oc.estado === 'RECIBIDO') {
      throw new BadRequestException('No se puede eliminar una Orden de Compra que ya fue ingresada a Kardex.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.ordenCompraItem.deleteMany({ where: { ordenCompraId: id } });
      await tx.ordenCompra.delete({ where: { id } });
    });

    return {
      ok: true,
      mensaje: `Orden de Compra ${oc.codigoOC} eliminada correctamente.`,
    };
  }

  private async procesarRecepcionItem(
    tx: Prisma.TransactionClient,
    oc: Prisma.OrdenCompraGetPayload<{ include: { items: true } }>,
    item: Prisma.OrdenCompraItemGetPayload<{}>,
    usuarioId: string,
  ) {
    const cantidadOC = this.validarCantidad(Number(item.cantidad));
    const precioOC = this.validarPrecio(Number(item.precioUnitario));
    const insumo = item.insumoId
      ? await tx.insumo.findUnique({ where: { id: item.insumoId }, include: { familia: true } })
      : await this.buscarInsumoPorNombre(tx, item.insumoNombre);

    const insumoFinal = insumo || (await this.crearInsumoDesdeOC(tx, item));
    if (item.insumoId && !insumo) throw new NotFoundException(`Insumo ${item.insumoNombre} no encontrado.`);

    if (!item.insumoId || item.insumoId !== insumoFinal.id) {
      await tx.ordenCompraItem.update({ where: { id: item.id }, data: { insumoId: insumoFinal.id } });
    }

    // Conversión a la unidad base del insumo (KG↔GR, L↔ML). Misma familia → factor, distinta familia → error.
    const unidadOC = this.normalizarUnidad(item.unidadMedida);
    const { cantidad: cantidad, precioUnitario: precioCompra } = this.convertirAUnidadInsumo(
      cantidadOC,
      precioOC,
      unidadOC,
      insumoFinal.unidadMedida,
    );

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

  /**
   * Convierte cantidad y precio de la OC a la unidad del insumo.
   * Soporta GR↔KG (×1000) y ML↔L (×1000). UN solo con UN. Incompatible → 400.
   */
  private convertirAUnidadInsumo(
    cantidadOC: number,
    precioOC: number,
    unidadOC: UnidadMedida,
    unidadInsumo: UnidadMedida,
  ): { cantidad: number; precioUnitario: number } {
    if (unidadOC === unidadInsumo) return { cantidad: cantidadOC, precioUnitario: precioOC };

    const masa: Record<string, number> = { [UnidadMedida.GR]: 1, [UnidadMedida.KG]: 1000 };
    const volumen: Record<string, number> = { [UnidadMedida.ML]: 1, [UnidadMedida.L]: 1000 };

    const factorMasa = masa[unidadOC] !== undefined && masa[unidadInsumo] !== undefined
      ? masa[unidadOC] / masa[unidadInsumo]
      : null;
    if (factorMasa !== null) {
      const cantidad = cantidadOC * factorMasa;
      const precioUnitario = precioOC / factorMasa;
      return { cantidad, precioUnitario };
    }

    const factorVol = volumen[unidadOC] !== undefined && volumen[unidadInsumo] !== undefined
      ? volumen[unidadOC] / volumen[unidadInsumo]
      : null;
    if (factorVol !== null) {
      const cantidad = cantidadOC * factorVol;
      const precioUnitario = precioOC / factorVol;
      return { cantidad, precioUnitario };
    }

    throw new BadRequestException(
      `Unidad de OC (${unidadOC}) incompatible con unidad del insumo (${unidadInsumo}).`,
    );
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
