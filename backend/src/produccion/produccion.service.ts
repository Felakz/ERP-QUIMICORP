import { despacharLote } from './production-dispatch';
import { recetaLote } from './production-recipe';
import { cantidadEnStock, cantidadLoteKg, consumoFormulaGramos, costoPorUnidadStock, unidadStock } from '../common/stock-units';
import { cantidadPositiva, masaLoteKg, masaLoteOpcional, unidadComercial } from '../common/order-quantity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoOrdenProduccion, Prisma, TipoMovimientoKardex, CategoriaKardex, TipoMovimiento } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { KardexService } from '../kardex/kardex.service';
import { ProduccionGateway } from './produccion.gateway';
import {
  AsignarOperariosDto,
  CambiarPasoDto,
  CrearOrdenDto,
  DecidirQADto,
  RegistrarAjusteFinoDto,
  ValidarStockDto,
} from './dto/crear-orden.dto';

export interface RequerimientoInsumo {
  insumoId: string;
  codigo: string;
  nombre: string;
  unidadMedida: string;
  cantidadRequerida: string;
  stockDisponible: string;
  suficiente: boolean;
  faltante: string;
}

@Injectable()
export class ProduccionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kardexService: KardexService,
    private readonly produccionGateway: ProduccionGateway,
  ) {}

  async validarStockDisponible(dto: ValidarStockDto): Promise<{
    formulaId: string;
    cantidadPlanificada: number;
    puedeIniciar: boolean;
    requerimientos: RequerimientoInsumo[];
  }> {
    const formula = await this.prisma.formulaMaster.findUnique({
      where: { id: dto.formulaId },
      include: { detalles: { include: { insumo: true } } },
    });

    if (!formula) {
      throw new NotFoundException(`Fórmula ${dto.formulaId} no encontrada.`);
    }
    if (!formula.detalles.length) {
      throw new BadRequestException('La fórmula no tiene insumos configurados.');
    }

    const loteKg = masaLoteKg({ ...dto, unidadMedida: dto.unidadMedida || 'KG' });
    const requerimientos: RequerimientoInsumo[] = formula.detalles.map((detalle) => {
      if (!detalle.insumo) throw new BadRequestException('La fórmula contiene un ingrediente sin inventario.');
      const cantidadRequerida = new Prisma.Decimal(consumoFormulaGramos(loteKg, Number(detalle.porcentaje), detalle.insumo));
      const stockDisponible = new Prisma.Decimal(detalle.insumo.stockReal);
      const suficiente = stockDisponible.gte(cantidadRequerida);
      const faltante = suficiente
        ? new Prisma.Decimal(0)
        : cantidadRequerida.minus(stockDisponible);

      return {
        insumoId: detalle.insumoId,
        codigo: detalle.insumo.codigo,
        nombre: detalle.insumo.nombre,
        unidadMedida: unidadStock(detalle.insumo),
        cantidadRequerida: cantidadRequerida.toFixed(4),
        stockDisponible: stockDisponible.toFixed(4),
        suficiente,
        faltante: faltante.toFixed(4),
      };
    });

    return {
      formulaId: dto.formulaId,
      cantidadPlanificada: dto.cantidadPlanificada,
      puedeIniciar: requerimientos.every((r) => r.suficiente),
      requerimientos,
    };
  }

  async crearOrden(dto: CrearOrdenDto) {
    cantidadPositiva(dto.cantidadPlanificada);
    const unit = unidadComercial(dto.unidadMedida || 'KG');
    if ((dto.pesoNetoKg != null || dto.densidadKgL != null) && !dto.fuenteConversion?.trim()) throw new BadRequestException('El pesaje o densidad requiere documento de soporte.');
    const master = await this.prisma.formulaMaster.findUnique({ where: { id: dto.formulaId }, include: { detalles: { include: { insumo: true } } } });
    if (!master) throw new BadRequestException('Seleccione una fórmula existente.');
    const recipe = await recetaLote(this.prisma, { formulaId: master.id, formula: master });
    // Idempotencia: evita duplicados por doble clic (misma fórmula/cliente/cantidad en <30s)
    const reciente = await this.prisma.ordenProduccion.findFirst({
      where: {
        formulaId: dto.formulaId,
        clienteNombre: dto.clienteNombre || undefined,
        cantidadPlanificada: dto.cantidadPlanificada as any,
        unidadMedida: unidadComercial(dto.unidadMedida || 'KG'),
        createdAt: { gte: new Date(Date.now() - 30_000) },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (reciente) return reciente;

    // Validamos stock para informar, pero NO bloqueamos la creación del lote.
    const validacion = await this.validarStockDisponible({
      formulaId: dto.formulaId,
      cantidadPlanificada: dto.cantidadPlanificada,
      unidadMedida: dto.unidadMedida || 'KG',
      pesoNetoKg: dto.pesoNetoKg,
      densidadKgL: dto.densidadKgL,
      fuenteConversion: dto.fuenteConversion,
    }).catch(() => null);

    const ultimoCodigo = await this.prisma.ordenProduccion.count();
    const codigoLote = `LOTE-${String(ultimoCodigo + 1).padStart(6, '0')}`;

    // El frontend envía el id del modelo de autenticación (User). Resolvemos al
    // Usuario (ERP) real para respetar la FK de supervisorId.
    let supervisorId = dto.supervisorId;
    const supervisor = await this.prisma.usuario.findUnique({ where: { id: supervisorId } });
    if (!supervisor) {
      const fallback = await this.prisma.usuario.findFirst({
        where: {
          rol: { nombre: 'PRODUCCION_ALMACEN' },
          cargo: { contains: 'SUPERVISOR', mode: 'insensitive' },
        },
      });
      if (!fallback) {
        const cualquiera = await this.prisma.usuario.findFirst({
          where: { rol: { nombre: 'PRODUCCION_ALMACEN' } },
        });
        if (cualquiera) {
          supervisorId = cualquiera.id;
        } else {
          throw new BadRequestException(
            'No hay usuario supervisor de planta disponible. Configure el personal de producción primero.',
          );
        }
      } else {
        supervisorId = fallback.id;
      }
    }

    const orden = await this.prisma.ordenProduccion.create({
      data: {
        codigoLote,
        formulaId: dto.formulaId,
        cantidadPlanificada: dto.cantidadPlanificada,
        unidadMedida: unidadComercial(dto.unidadMedida || 'KG'),
        pesoNetoKg: dto.pesoNetoKg,
        densidadKgL: dto.densidadKgL,
        fuenteConversion: dto.fuenteConversion,
        recetaSnapshot: JSON.parse(JSON.stringify({ ...recipe.snapshot, fuente: 'FORMULA_AL_CREAR_ORDEN' })),
        supervisorId: supervisorId,
        clienteNombre: dto.clienteNombre || 'Sin cliente asignado',
        estado: EstadoOrdenProduccion.EN_PROCESO,
        pasoProceso: 'PENDIENTE_ASIGNACION',
      },
      include: { formula: true, supervisor: true },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: orden.id,
      codigoLote: orden.codigoLote,
      clienteNombre: orden.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: 'EN_PROCESO',
      pasoProceso: 'PENDIENTE_ASIGNACION',
      timestamp: new Date().toISOString(),
    });

    return orden;
  }

  async listarOperarios(): Promise<{ id: string; nombre: string }[]> {
    const usuarios = await (this.prisma as any).usuario.findMany({
      where: {
        estado: 'ACTIVO',
        NOT: [{ cargo: { contains: 'SUPERVISOR', mode: 'insensitive' } }],
        OR: [
          { rol: { nombre: 'PRODUCCION_ALMACEN' } },
          { cargo: { contains: 'operario', mode: 'insensitive' } },
        ],
      },
      select: { id: true, nombres: true, apellidos: true },
      orderBy: { nombres: 'asc' },
    }).catch(() => []);
    return usuarios.map((u: any) => ({ id: u.id, nombre: `${u.nombres} ${u.apellidos}`.trim() }));
  }

  async asignarOperarios(dto: AsignarOperariosDto) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    const operariosStr = dto.operarios.join(', ');
    if (!['EN_PROCESO', 'QA_PENDIENTE', 'PENDIENTE'].includes(orden.estado) || ['LIBERADO_QA','DESPACHADO','RECHAZADO'].includes(orden.pasoProceso)) throw new BadRequestException('No se pueden reasignar operarios de un lote cerrado.');
    const nuevoPaso = dto.operarios.length > 0 ? 'ELABORANDO' : 'PENDIENTE_ASIGNACION';

    const ordenActualizada = await this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: {
        operariosAsignados: operariosStr,
        pasoProceso: nuevoPaso,
      },
      include: { formula: true },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: ordenActualizada.id,
      codigoLote: ordenActualizada.codigoLote,
      clienteNombre: ordenActualizada.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: ordenActualizada.estado,
      pasoProceso: nuevoPaso,
      operarios: dto.operarios,
      timestamp: new Date().toISOString(),
    });

    return ordenActualizada;
  }

  async cambiarPasoProceso(dto: CambiarPasoDto) {
    if (!['PENDIENTE_ASIGNACION', 'ELABORANDO', 'EN_MUESTREO_QA'].includes(dto.pasoProceso)) throw new BadRequestException('Use la liberación QA o el despacho para cerrar el lote y registrar sus movimientos.');
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    // Regla de negocio: no se puede pasar a ELABORANDO ni EN_MUESTREO_QA sin operarios
    if (!['EN_PROCESO', 'QA_PENDIENTE', 'PENDIENTE'].includes(orden.estado) || ['LIBERADO_QA','DESPACHADO','RECHAZADO'].includes(orden.pasoProceso)) throw new BadRequestException('El lote está cerrado.');
    const operariosList = orden.operariosAsignados ? orden.operariosAsignados.split(', ') : [];
    if ((dto.pasoProceso === 'ELABORANDO' || dto.pasoProceso === 'EN_MUESTREO_QA') && operariosList.length === 0) {
      throw new BadRequestException('⚠️ Asigna al menos un operario para habilitar la fabricación.');
    }

    let nuevoEstadoEnum = orden.estado;
    if (dto.pasoProceso === 'EN_MUESTREO_QA') {
      nuevoEstadoEnum = EstadoOrdenProduccion.QA_PENDIENTE;
    } else if (dto.pasoProceso === 'LIBERADO_QA') {
      nuevoEstadoEnum = EstadoOrdenProduccion.APROBADO;
    }

    const ordenActualizada = await this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: {
        pasoProceso: dto.pasoProceso,
        estado: nuevoEstadoEnum,
        observacionesQA: dto.observacionesQA || orden.observacionesQA,
      },
      include: { formula: true },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: ordenActualizada.id,
      codigoLote: ordenActualizada.codigoLote,
      clienteNombre: ordenActualizada.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: ordenActualizada.estado,
      pasoProceso: dto.pasoProceso,
      observaciones: dto.observacionesQA,
      timestamp: new Date().toISOString(),
    });

    return ordenActualizada;
  }

  async registrarAjusteFino(dto: RegistrarAjusteFinoDto) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      const ajuste = await tx.ajusteFino.create({
        data: {
          ordenProduccionId: dto.ordenProduccionId,
          insumoId: dto.insumoId,
          cantidadAgregada: cantidadEnStock(dto.cantidadAgregada, dto.unidadMedida || 'GR', dto.unidadMedida || 'GR'),
          registradoPorId: dto.registradoPorId,
        },
      });

      await this.kardexService.registrarMovimiento({
        insumoId: dto.insumoId,
        tipoMovimiento: dto.cantidadAgregada > 0 ? TipoMovimientoKardex.AJUSTE_FINO : TipoMovimientoKardex.REAPROVECHAMIENTO,
        cantidad: Math.abs(dto.cantidadAgregada),
        unidadMedida: dto.unidadMedida || 'GR',
        documentoReferencia: orden.codigoLote,
        usuarioId: dto.registradoPorId,
      }, tx);

      return ajuste;
    });
  }

  listarPendientesQA() {
    return this.prisma.ordenProduccion.findMany({
      where: {
        OR: [
          { estado: EstadoOrdenProduccion.QA_PENDIENTE },
          { estado: EstadoOrdenProduccion.EN_PROCESO },
          { estado: EstadoOrdenProduccion.PENDIENTE },
        ],
      },
      include: { formula: true, supervisor: { select: { nombres: true, apellidos: true } } },
      orderBy: { updatedAt: 'asc' },
    });
  }

  enviarAQA(ordenProduccionId: string, cantidadObtenida: number) {
    return this.prisma.ordenProduccion.update({
      where: { id: ordenProduccionId },
      data: {
        estado: EstadoOrdenProduccion.QA_PENDIENTE,
        pasoProceso: 'EN_MUESTREO_QA',
        cantidadObtenida,
      },
    });
  }

  /**
   * Al APROBAR & LIBERAR un Lote en Control de Producción & QA:
   * 1. Cambia el estado a APROBADO y pasoProceso a LIBERADO_QA.
   * 2. Registra automáticamente en el KardexMovimiento:
   *    - Salida por consumo (SALIDA_CONSUMO_PRODUCCION) de cada Materia Prima / Insumo según receta.
   *    - Entrada de Producto Terminado (ENTRADA_PRODUCCION) en PRODUCTO_TERMINADO con el nombre del Cliente y los KG/L.
   * 3. Emite evento WebSocket en tiempo real para Administración y Logística.
   */
  async aprobarLote(dto: DecidirQADto) {
    if (dto.pesoBrutoKg != null || dto.taraKg != null) {
      const gross = cantidadPositiva(dto.pesoBrutoKg, 'Peso bruto KG');
      if (dto.taraKg == null || !Number.isFinite(dto.taraKg) || dto.taraKg < 0) throw new BadRequestException('La tara debe ser una cantidad no negativa.');
      const net = new Prisma.Decimal(gross).minus(dto.taraKg).toDecimalPlaces(4);
      cantidadPositiva(net, 'Peso neto KG');
      if (dto.pesoNetoKg != null && !net.equals(dto.pesoNetoKg)) throw new BadRequestException('El peso neto debe coincidir con peso bruto menos tara.');
      dto.pesoNetoKg = net.toNumber();
    }
    const released = await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM ordenes_produccion WHERE id = ${dto.ordenProduccionId} FOR UPDATE`;
      const orden = await tx.ordenProduccion.findUnique({ where: { id: dto.ordenProduccionId }, include: {
        formula: { include: { detalles: { include: { insumo: { include: { familia: true } } } } } },
        pedidoItem: true, pedidoComercial: { select: { unidadMedida: true, codigoOrden: true, productoNombre: true, notasAdmin: true } },
      } });
      if (!orden) throw new NotFoundException('Orden de producción no encontrada.');
      if (['APROBADO', 'EN_ETIQUETADO', 'DESPACHADO'].includes(orden.estado) || orden.pasoProceso === 'LIBERADO_QA') throw new BadRequestException('El lote ya fue liberado; no se volverá a descontar stock.');
      if (!['EN_PROCESO', 'QA_PENDIENTE'].includes(orden.estado)) throw new BadRequestException('El lote no está en un estado que permita liberarlo.');
      const produced = cantidadPositiva(dto.cantidadObtenida ?? orden.cantidadObtenida ?? orden.cantidadPlanificada, 'Cantidad obtenida');
      const unit = unidadComercial(orden.unidadMedida || orden.pedidoItem?.unidadMedida || orden.pedidoComercial?.unidadMedida || '');
      const evidence = dto.fuenteConversion ? { pesoNetoKg: dto.pesoNetoKg, densidadKgL: dto.densidadKgL, fuenteConversion: dto.fuenteConversion } : orden;
      if ((dto.pesoNetoKg != null || dto.densidadKgL != null) && !dto.fuenteConversion?.trim()) throw new BadRequestException('Indique la fuente del peso neto o densidad.');
      const loteKg = dto.consumosReales ? masaLoteOpcional({ ...orden, ...evidence }).kg : masaLoteKg(orden, evidence);
      const recipe = await recetaLote(tx, orden);
      let actual: Map<string, any> | null = null;
      if (dto.consumosReales) {
        actual = new Map(dto.consumosReales.map(d => [d.insumoId, d]));
        if (actual.size !== recipe.details.length || actual.size !== dto.consumosReales.length || recipe.details.some(d => !actual.has(d.insumoId))) throw new BadRequestException('Registre los consumos reales de todos los ingredientes, sin duplicados.');
        for (const d of actual.values()) if (!Number.isFinite(d.cantidad) || d.cantidad < 0 || !d.documentoSoporte?.trim()) throw new BadRequestException('Cada consumo real requiere cantidad no negativa y documento de soporte.');
      }
      let materialCost = new Prisma.Decimal(0);
      let pendingValuation = false;
      const movements = [];
      // Stable lock order prevents two recipes locking shared ingredients in opposite order.
      for (const detail of [...recipe.details].sort((a, b) => a.insumoId.localeCompare(b.insumoId))) {
        await tx.$queryRaw`SELECT id FROM insumos WHERE id = ${detail.insumoId} FOR UPDATE`;
        const ingredient = await tx.insumo.findUniqueOrThrow({ where: { id: detail.insumoId }, include: { familia: true } });
        const declared = actual?.get(detail.insumoId);
        const consumed = declared ? cantidadEnStock(declared.cantidad, declared.unidadMedida, ingredient) : consumoFormulaGramos(loteKg, detail.porcentaje, ingredient);
        const previous = Number(ingredient.stockReal);
        if (previous < consumed) throw new BadRequestException(`Stock insuficiente de ${ingredient.nombre}: disponible ${previous} ${unidadStock(ingredient)}, requerido ${consumed}.`);
        const next = new Prisma.Decimal(previous).minus(consumed).toDecimalPlaces(4).toNumber();
        let cost = 0, costPending = false;
        try { cost = costoPorUnidadStock(Number(ingredient.costoUnitario || 0), ingredient); } catch { costPending = true; }
        if (!cost && consumed > 0) costPending = true;
        pendingValuation ||= costPending;
        materialCost = materialCost.plus(new Prisma.Decimal(consumed).mul(cost));
        const category = ingredient.tipo === 'ENVASE' ? CategoriaKardex.ENVASE : ingredient.tipo === 'BASE' ? CategoriaKardex.MATERIA_PRIMA : CategoriaKardex.INSUMO;
        await tx.insumo.update({ where: { id: ingredient.id }, data: { stockReal: next } });
        await tx.kardexMovimiento.create({ data: { categoriaKardex: category, productoNombre: ingredient.nombre,
          familia: ingredient.familia?.nombre || 'General', categoriaNombre: ingredient.familia?.nombre || 'Químicos Base',
          proveedorCliente: `Consumo Planta - Lote ${orden.codigoLote} (${orden.clienteNombre || 'Cliente pendiente'})`,
          unidadMedida: unidadStock(ingredient), fecha: new Date(), tipoDoc: 'OP', serie: 'LOTE', numero: orden.codigoLote,
          otp: `OTP-${orden.codigoLote}`, tipoOperacion: TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
          cantidadEntrada: 0, cantidadSalida: consumed, saldoFinal: next, costoUnitario: cost, valoracionPendiente: costPending,
          montoSalidaPen: new Prisma.Decimal(consumed).mul(cost).toDecimalPlaces(2).toNumber(),
          montoSaldoPen: new Prisma.Decimal(next).mul(cost).toDecimalPlaces(2).toNumber(), insumoId: ingredient.id } });
        await tx.kardexInmutable.create({ data: { insumoId: ingredient.id, tipoMovimiento: TipoMovimientoKardex.SALIDA,
          cantidad: consumed, stockAnterior: previous, stockNuevo: next, documentoReferencia: `OP-${orden.codigoLote}`, usuarioId: orden.supervisorId } });
        movements.push({ insumoId: ingredient.id, cantidad: consumed, unidad: unidadStock(ingredient),
          modo: declared ? 'CONSUMO_REAL_DOCUMENTADO' : 'TEORICO_SEGUN_RECETA', documentoSoporte: declared?.documentoSoporte || null });
      }
      const outputBase = cantidadEnStock(produced, unit, unit);
      // Sale revenue is never treated as manufacturing cost. Raw-material valuation
      // is explicit and remains pending until other manufacturing costs are documented.
      await tx.kardexMovimiento.create({ data: { categoriaKardex: CategoriaKardex.PRODUCTO_TERMINADO,
        productoNombre: recipe.snapshot.nombreProducto || orden.formula.nombreProducto, familia: 'Productos Terminados',
        categoriaNombre: 'Producto terminado; valorización de materias primas', proveedorCliente: orden.clienteNombre || 'Cliente pendiente',
        unidadMedida: unidadStock(unit), fecha: new Date(), tipoDoc: 'OP', serie: 'LOTE', numero: orden.codigoLote,
        otp: `OTP-${orden.codigoLote}`, tipoOperacion: TipoMovimiento.ENTRADA_PRODUCCION,
        cantidadEntrada: outputBase, cantidadSalida: 0, saldoFinal: outputBase,
        costoUnitario: materialCost.div(outputBase).toNumber(), montoEntradaPen: materialCost.toDecimalPlaces(2).toNumber(),
        montoSaldoPen: materialCost.toDecimalPlaces(2).toNumber(), valoracionPendiente: true } });
      const approved = await tx.ordenProduccion.update({ where: { id: orden.id }, data: {
        estado: EstadoOrdenProduccion.EN_ETIQUETADO, pasoProceso: 'LIBERADO_QA', fechaCierre: new Date(),
        cantidadObtenida: produced, unidadMedida: unit, observacionesQA: dto.observacionesQA || orden.observacionesQA,
        ...(dto.fuenteConversion ? { pesoNetoKg: dto.pesoNetoKg || null, densidadKgL: dto.densidadKgL || null, fuenteConversion: dto.fuenteConversion } : {}),
        recetaSnapshot: JSON.parse(JSON.stringify({ ...recipe.snapshot, baseMasaKg: loteKg, consumos: movements, valoracionMaterialesPendiente: pendingValuation,
          ...(dto.pesoBrutoKg != null ? { pesaje: { brutoKg: dto.pesoBrutoKg, taraKg: dto.taraKg, netoKg: dto.pesoNetoKg, fuente: dto.fuenteConversion, recordedAt: new Date().toISOString() } } : {}) })),
      } });
      const existing = await tx.colaDespacho.findFirst({ where: { loteCodigo: orden.codigoLote } });
      if (!existing) await tx.colaDespacho.create({ data: { loteCodigo: orden.codigoLote,
        productoNombre: recipe.snapshot.nombreProducto || orden.formula.nombreProducto, clienteNombre: orden.clienteNombre || 'Cliente pendiente',
        cantidad: `${produced} ${unit}`, fechaFabricacion: new Date(), codigoQR: `QR-QUIMICORP-${orden.codigoLote}`,
        codigoBarras: `7759000${orden.codigoLote.replace(/\D/g, '') || '1001'}`, estado: 'LISTO_PARA_IMPRIMIR', ruc: '20612434124' } });
      return approved;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 10000, timeout: 30000 });
    this.produccionGateway.emitirEstadoActualizado({ ordenId: released.id, codigoLote: released.codigoLote,
      clienteNombre: released.clienteNombre, nuevoEstado: 'APROBADO', pasoProceso: 'LIBERADO_QA', timestamp: new Date().toISOString() });
    return released;
  }


  obtenerColaDespacho() {
    return (this.prisma as any).colaDespacho.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async despacharEtiqueta(
    colaId: string,
    numeroGuia?: string,
    opciones?: {
      envaseSku?: string;
      envaseCantidad?: number;
      envaseSku2?: string;
      envaseCantidad2?: number;
      envasesSecundarios?: Array<{ sku: string; cantidad: number }>;
      envaseCliente?: boolean;
      tipoEnvaseCliente?: string;
      envaseClienteCantidad?: number;
    },
  ) {
    const result = await despacharLote(this.prisma, colaId, numeroGuia, opciones);
    if (!result.repetido) this.produccionGateway.emitirEstadoActualizado({ ordenId: result.ordenId, codigoLote: result.loteCodigo,
      clienteNombre: result.clienteNombre, nuevoEstado: 'DESPACHADO', pasoProceso: 'DESPACHADO', timestamp: new Date().toISOString() });
    return result;
  }
  private async descontarAdicionalesDespacho(
    adicionales: Array<{
      id: string;
      categoria: 'ENVASES' | 'BALDES_HERRAMIENTAS';
      unidadMedida: string;
      cantidad: unknown;
      cantidadDespachada: unknown;
      insumoId: string | null;
      insumo: { id: string; codigo: string; nombre: string; unidadMedida: string; stockReal: unknown; costoUnitario: unknown; familia: { nombre: string } } | null;
    }>,
    loteCodigo: string,
    numeroGuia: string | undefined,
    usuarioId: string,
  ) {
    const documentoRef = numeroGuia?.trim() || `LOTE-${loteCodigo}`;
    await this.prisma.$transaction(async (tx) => {
      for (const adicional of adicionales) {
        if (!adicional.insumoId || !adicional.insumo) continue;
        const cantidadPendiente = Number(adicional.cantidad) - Number(adicional.cantidadDespachada);
        if (cantidadPendiente <= 0) continue;
        const insumo = await tx.insumo.findUniqueOrThrow({ where: { id: adicional.insumoId }, include: { familia: true } });
        const consumoBase = cantidadEnStock(cantidadPendiente, adicional.unidadMedida, insumo);
        const stockAnterior = Number(insumo.stockReal);
        if (stockAnterior < consumoBase) {
          throw new BadRequestException(`Stock insuficiente de ${insumo.codigo} (${insumo.nombre}).`);
        }
        const stockNuevo = new Prisma.Decimal(stockAnterior).minus(consumoBase).toNumber();
        const costo = costoPorUnidadStock(Number(insumo.costoUnitario || 0), insumo);
        const categoria = adicional.categoria === 'ENVASES' ? CategoriaKardex.ENVASE : CategoriaKardex.INSUMO;
        await tx.insumo.update({ where: { id: insumo.id }, data: { stockReal: stockNuevo } });
        await tx.kardexMovimiento.create({
          data: {
            categoriaKardex: categoria,
            productoNombre: insumo.nombre,
            familia: insumo.familia.nombre,
            categoriaNombre: insumo.familia.nombre,
            proveedorCliente: `Adicional pedido - ${loteCodigo}`,
            unidadMedida: unidadStock(insumo),
            fecha: new Date(),
            tipoDoc: 'GUIA',
            numero: documentoRef,
            tipoOperacion: TipoMovimiento.SALIDA_VENTA,
            cantidadEntrada: 0,
            cantidadSalida: consumoBase,
            saldoFinal: stockNuevo,
            costoUnitario: costo,
            montoSalidaPen: consumoBase * costo,
            montoSaldoPen: stockNuevo * costo,
            insumoId: insumo.id,
            usuarioId,
          },
        });
        await tx.kardexInmutable.create({
          data: {
            insumoId: insumo.id,
            tipoMovimiento: TipoMovimientoKardex.SALIDA,
            cantidad: consumoBase,
            stockAnterior,
            stockNuevo,
            documentoReferencia: documentoRef,
            usuarioId,
          },
        });
        await tx.pedidoAdicional.update({
          where: { id: adicional.id },
          data: { cantidadDespachada: Number(adicional.cantidad), kardexDescontado: true },
        });
      }
    });
  }

  async rechazarLote(dto: DecidirQADto) {
    if (!dto.motivoRechazo?.trim()) {
      throw new BadRequestException('El motivo de rechazo es obligatorio para detener el lote.');
    }

    const ordenRechazada = await this.prisma.ordenProduccion.update({
      where: { id: dto.ordenProduccionId },
      data: {
        estado: EstadoOrdenProduccion.RECHAZADO,
        pasoProceso: 'RECHAZADO',
        motivoRechazo: dto.motivoRechazo,
        observacionesQA: dto.observacionesQA,
      },
    });

    this.produccionGateway.emitirEstadoActualizado({
      ordenId: ordenRechazada.id,
      codigoLote: ordenRechazada.codigoLote,
      clienteNombre: ordenRechazada.clienteNombre || 'Cliente Quimicorp SAC',
      nuevoEstado: 'RECHAZADO',
      pasoProceso: 'RECHAZADO',
      observaciones: dto.motivoRechazo,
      timestamp: new Date().toISOString(),
    });

    return ordenRechazada;
  }

  private parsearRangoDia(fechaStr?: string) {
    let y: number, m: number, d: number;
    if (fechaStr && /^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const parts = fechaStr.split('-').map(Number);
      y = parts[0];
      m = parts[1] - 1;
      d = parts[2];
    } else {
      const now = new Date();
      y = now.getFullYear();
      m = now.getMonth();
      d = now.getDate();
    }

    const inicioDia = new Date(y, m, d, 0, 0, 0, 0);
    const finDia = new Date(y, m, d, 23, 59, 59, 999);
    const fechaISO = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    return { inicioDia, finDia, fechaISO };
  }

  async listar(fechaStr?: string) {
    let whereCondition: any = {};
    if (fechaStr) {
      const { inicioDia, finDia } = this.parsearRangoDia(fechaStr);
      whereCondition.createdAt = { gte: inicioDia, lte: finDia };
    }

    const ordenes = await this.prisma.ordenProduccion.findMany({
      where: whereCondition,
      include: {
        formula: { include: { detalles: { include: { insumo: { include: { familia: true } } } } } },
        supervisor: { select: { nombres: true, apellidos: true } },
        pedidoItem: true,
        pedidoComercial: { select: { unidadMedida: true, notasAdmin: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const capturedIds = [...new Set(ordenes.flatMap(o => ((o.recetaSnapshot as any)?.componentes || []).map((d: any) => d.insumoId)))].filter(Boolean) as string[];
    const ingredients = capturedIds.length ? await this.prisma.insumo.findMany({ where: { id: { in: capturedIds } }, include: { familia: true } }) : [];
    return ordenes.map(o => {
      const conversion = masaLoteOpcional(o);
      const captured = o.recetaSnapshot as any;
      const recetaDetalles = captured?.componentes?.map((d: any) => ({ ...d, insumo: ingredients.find(i => i.id === d.insumoId) })) || o.formula?.detalles || [];
      return { ...o, recetaDetalles, cantidadPlanificadaKg: conversion.kg, conversionPendiente: conversion.pendiente };
    });
  }

  async obtenerProgramacionDiaria(fechaStr?: string) {
    const { inicioDia, finDia, fechaISO } = this.parsearRangoDia(fechaStr);

    const ordenesDelDia = await this.prisma.ordenProduccion.findMany({
      where: {
        createdAt: {
          gte: inicioDia,
          lte: finDia,
        },
      },
      include: {
        formula: { include: { detalles: { include: { insumo: { include: { familia: true } } } } } },
        supervisor: { select: { nombres: true, apellidos: true } },
        pedidoItem: true,
        pedidoComercial: { select: { cantidadSolicitada: true, unidadMedida: true, notasAdmin: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalKgProgramados = 0;
    let terminadosCount = 0;
    let enProcesoCount = 0;
    let pendientesCount = 0;

    const listaFormatted = ordenesDelDia.map((oItem) => {
      const o = oItem as any;
      const cantidadPlanificada = Number(o.cantidadPlanificada) || 0;
      const conversion = masaLoteOpcional(o);
      totalKgProgramados += conversion.kg || 0;

      // Resolver unidad y cantidad de presentación desde el pedido comercial vinculado
      const pedido = o.pedidoComercial;
      const unidadPedido = o.unidadMedida || o.pedidoItem?.unidadMedida || pedido?.unidadMedida || 'PENDIENTE';
      const cantidadVisual = cantidadPlanificada;

      const esTerminado =
        o.estado === EstadoOrdenProduccion.APROBADO ||
        o.pasoProceso === 'LIBERADO_QA' ||
        !!o.fechaCierre;

      const esEnProceso =
        !esTerminado &&
        (o.pasoProceso === 'ELABORANDO' ||
          o.pasoProceso === 'EN_MUESTREO_QA' ||
          o.estado === EstadoOrdenProduccion.QA_PENDIENTE ||
          (!!o.operariosAsignados && o.operariosAsignados.trim().length > 0));

      const estadoCalculado: 'ENTREGADO' | 'TERMINADO' | 'EN PROCESO' | 'PENDIENTE' =
        o.estado === EstadoOrdenProduccion.DESPACHADO
          ? 'ENTREGADO'
          : esTerminado
          ? 'TERMINADO'
          : esEnProceso
          ? 'EN PROCESO'
          : 'PENDIENTE';

      if (estadoCalculado === 'TERMINADO' || estadoCalculado === 'ENTREGADO') {
        terminadosCount++;
      } else if (estadoCalculado === 'EN PROCESO') {
        enProcesoCount++;
      } else {
        pendientesCount++;
      }

      // Resolver Color y Fragancia con prioridad: OrdenProduccion > PedidoComercial > Fórmula > Fallback
      let colorResuelto = o.colorEspecificado;
      let fraganciaResuelta = o.fraganciaEspecificada;

      const insumosFormula: any[] = (o.formula?.detalles || [])
        .map((d: any) => d.insumo)
        .filter(Boolean);

      if (!colorResuelto || colorResuelto === 'TRANSPARENTE' || colorResuelto === 'SIN COLOR') {
        const pigmento = insumosFormula.find((i: any) => i.tipo === 'PIGMENTO');
        colorResuelto = pigmento?.nombre || 'TRANSPARENTE';
      }
      if (!fraganciaResuelta || fraganciaResuelta === 'SIN FRAGANCIA' || fraganciaResuelta === 'SIN AROMA') {
        const fragancia = insumosFormula.find((i: any) => i.tipo === 'FRAGANCIA');
        fraganciaResuelta = fragancia?.nombre || 'SIN FRAGANCIA';
      }

      const nombreSupervisor = o.supervisor
        ? `${o.supervisor.nombres || ''} ${o.supervisor.apellidos || ''}`.trim()
        : '';

      return {
        id: o.id,
        codigoLote: o.codigoLote,
        clienteNombre: o.clienteNombre || 'Quimicorp SAC',
        productoNombre: o.formula?.nombreProducto || 'Producto Químico',
        colorEspecificado: colorResuelto || 'TRANSPARENTE',
        fraganciaEspecificada: fraganciaResuelta || 'SIN FRAGANCIA',
        cantidad: cantidadVisual,
        unidadMedida: unidadPedido,
        conversionPendiente: conversion.pendiente,
        estado: estadoCalculado,
        operarios: o.operariosAsignados || nombreSupervisor || 'Sin Asignar',
        prioridad: o.prioridad || 'NORMAL',
        fechaCreacion: o.createdAt,
        fechaCierre: o.fechaCierre,
      };
    });

    return {
      fecha: fechaISO,
      resumen: {
        totalOrdenes: listaFormatted.length,
        totalKgProgramados: totalKgProgramados.toFixed(2),
        totalConversionesPendientes: listaFormatted.filter(o => o.conversionPendiente).length,
        totalTerminados: terminadosCount,
        totalEnProceso: enProcesoCount,
        totalPendientes: pendientesCount,
      },
      ordenes: listaFormatted,
    };
  }

  /**
   * Receta Unificada (mergeReceta):
   * Combina componentes de la fórmula base + aditivos personalizados (Fragancias, Pigmentos)
   * con sus porcentajes, gramos calculados y estado de stock en Kardex.
   */
  async obtenerMergeReceta(loteId: string) {
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: loteId },
      include: {
        pedidoItem: true,
        pedidoComercial: { select: { unidadMedida: true, notasAdmin: true } },
        formula: {
          include: {
            detalles: {
              include: {
                insumo: {
                  include: { familia: true },
                },
              },
            },
          },
        },
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    const conversion = masaLoteOpcional(orden);
    const recipe = await recetaLote(this.prisma, orden);
    const ingredientes = recipe.details.map(d => {
      const grams = conversion.kg == null ? null : new Prisma.Decimal(conversion.kg).mul(1000).mul(d.porcentaje).div(100).toDecimalPlaces(4).toNumber();
      let cantidadStock: number | null = null, calculoStockPendiente: string | null = conversion.pendiente;
      if (grams != null) {
        try { cantidadStock = cantidadEnStock(grams, 'GR', d.insumo); }
        catch (error) { calculoStockPendiente = error.message; }
      }
      return { insumoId: d.insumoId, codigo: d.insumo.codigo, nombre: d.insumo.nombre,
        familia: d.insumo.familia?.nombre || 'General', tipo: d.insumo.tipo || 'BASE', porcentaje: d.porcentaje,
        gramosCalculados: grams, unidadMedida: 'GR', unidadStock: unidadStock(d.insumo), cantidadStock, calculoStockPendiente, stockReal: Number(d.insumo.stockReal),
        suficiente: cantidadStock == null ? null : Number(d.insumo.stockReal) >= cantidadStock,
        esAditivo: ['FRAGANCIA', 'PIGMENTO'].includes(d.insumo.tipo),
      };
    });
    return { ordenId: orden.id, codigoLote: orden.codigoLote, clienteNombre: orden.clienteNombre,
      productoNombre: recipe.snapshot.nombreProducto || orden.formula.nombreProducto,
      cantidadPlanificadaKg: conversion.kg, conversionPendiente: conversion.pendiente,
      totalGramos: conversion.kg == null ? null : ingredientes.reduce((sum, d) => sum + d.gramosCalculados, 0),
      ingredientes, pasosElaboracion: recipe.snapshot.pasosElaboracion || [],
    };
  }
}
