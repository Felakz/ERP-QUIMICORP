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

    const requerimientos: RequerimientoInsumo[] = formula.detalles.map((detalle) => {
      const cantidadRequerida = new Prisma.Decimal(dto.cantidadPlanificada)
        .mul(detalle.porcentaje)
        .div(100);
      const stockDisponible = new Prisma.Decimal(detalle.insumo.stockReal);
      const suficiente = stockDisponible.gte(cantidadRequerida);
      const faltante = suficiente
        ? new Prisma.Decimal(0)
        : cantidadRequerida.minus(stockDisponible);

      return {
        insumoId: detalle.insumoId,
        codigo: detalle.insumo.codigo,
        nombre: detalle.insumo.nombre,
        unidadMedida: detalle.insumo.unidadMedida,
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
    // Idempotencia: evita duplicados por doble clic (misma fórmula/cliente/cantidad en <30s)
    const reciente = await this.prisma.ordenProduccion.findFirst({
      where: {
        formulaId: dto.formulaId,
        clienteNombre: dto.clienteNombre || undefined,
        cantidadPlanificada: dto.cantidadPlanificada as any,
        createdAt: { gte: new Date(Date.now() - 30_000) },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (reciente) return reciente;

    // Validamos stock para informar, pero NO bloqueamos la creación del lote.
    const validacion = await this.validarStockDisponible({
      formulaId: dto.formulaId,
      cantidadPlanificada: dto.cantidadPlanificada,
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
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
    });
    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    // Regla de negocio: no se puede pasar a ELABORANDO ni EN_MUESTREO_QA sin operarios
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
          cantidadAgregada: dto.cantidadAgregada,
          registradoPorId: dto.registradoPorId,
        },
      });

      await this.kardexService.registrarMovimiento({
        insumoId: dto.insumoId,
        tipoMovimiento: TipoMovimientoKardex.AJUSTE_FINO,
        cantidad: Math.abs(dto.cantidadAgregada),
        documentoReferencia: orden.codigoLote,
        usuarioId: dto.registradoPorId,
      });

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
    const orden = await this.prisma.ordenProduccion.findUnique({
      where: { id: dto.ordenProduccionId },
      include: {
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
        pedidoComercial: {
          select: { montoTotal: true, codigoOrden: true, productoNombre: true, unidadMedida: true },
        },
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de producción no encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      const ordenAprobada = await tx.ordenProduccion.update({
        where: { id: dto.ordenProduccionId },
        data: {
          estado: EstadoOrdenProduccion.EN_ETIQUETADO,
          pasoProceso: 'LIBERADO_QA',
          observacionesQA: dto.observacionesQA || orden.observacionesQA,
          fechaCierre: new Date(),
        } as any,
      });

      const cantidadProducida = Number(dto.cantidadObtenida || orden.cantidadObtenida || orden.cantidadPlanificada);
      const clienteFinal = orden.clienteNombre || 'Cliente Quimicorp SAC';

      // 1. Salidas por Consumo de Materia Prima / Insumos
      for (const detalle of orden.formula.detalles) {
        // Saltar detalles comodín sin insumo real vinculado (p.ej. "FRAGANCIA REFERENCIA")
        if (!detalle.insumo) continue;
        const porcentaje = Number(detalle.porcentaje);
        const consumoCalculado = (Number(orden.cantidadPlanificada) * porcentaje) / 100;
        const stockActual = Number(detalle.insumo.stockReal);
        const nuevoSaldo = Math.max(0, stockActual - consumoCalculado);

        await tx.insumo.update({
          where: { id: detalle.insumoId },
          data: { stockReal: nuevoSaldo },
        });

        // Categorización por tipo real del insumo (provenance), no por nombre de familia
        const fam = detalle.insumo.familia?.nombre?.toLowerCase() || '';
        const tipo = detalle.insumo.tipo as string;
        let categoriaKardex: CategoriaKardex = CategoriaKardex.INSUMO;
        if (tipo === 'BASE') categoriaKardex = CategoriaKardex.MATERIA_PRIMA;
        else if (tipo === 'ENVASE') categoriaKardex = CategoriaKardex.ENVASE;
        else if (tipo === 'OTRO' && (fam.includes('embalaje') || fam.includes('caja') || fam.includes('etiqueta') || fam.includes('embal'))) categoriaKardex = CategoriaKardex.EMBALAJE;
        else if (tipo === 'FRAGANCIA' || tipo === 'PIGMENTO') categoriaKardex = CategoriaKardex.INSUMO;

        // Costo unitario del insumo (0 mientras no se cargue la ficha de costos)
        const costoUnitarioInsumo = Number(detalle.insumo.costoUnitario || 0);

        await tx.kardexMovimiento.create({
          data: {
            categoriaKardex,
            productoNombre: detalle.insumo.nombre,
            familia: detalle.insumo.familia?.nombre || 'General',
            categoriaNombre: detalle.insumo.familia?.nombre || 'Químicos Base',
            proveedorCliente: `Consumo Planta - Lote ${orden.codigoLote} (${clienteFinal})`,
            unidadMedida: detalle.insumo.unidadMedida,
            fecha: new Date(),
            tipoDoc: 'OP',
            serie: 'LOTE',
            numero: orden.codigoLote,
            otp: `OTP-${orden.codigoLote}`,
            tipoOperacion: TipoMovimiento.SALIDA_CONSUMO_PRODUCCION,
            cantidadEntrada: 0,
            cantidadSalida: consumoCalculado,
            saldoFinal: nuevoSaldo,
            costoUnitario: costoUnitarioInsumo,
            montoSalidaPen: consumoCalculado * costoUnitarioInsumo,
            montoSaldoPen: nuevoSaldo * costoUnitarioInsumo,
            insumoId: detalle.insumoId,
          },
        });

        // Trazabilidad inmutable (append-only) del stock del insumo
        await tx.kardexInmutable.create({
          data: {
            insumoId: detalle.insumoId,
            tipoMovimiento: TipoMovimientoKardex.SALIDA,
            cantidad: consumoCalculado,
            stockAnterior: stockActual,
            stockNuevo: nuevoSaldo,
            documentoReferencia: `OP-${orden.codigoLote}`,
            usuarioId: orden.supervisorId,
          },
        });
      }

      // 2. Entrada del Producto Terminado Aprobado
      //    Monto de costo del PT = monto fijado (cotización) y aprobado en la venta (PedidoComercial.montoTotal)
      const montoVenta = Number(orden.pedidoComercial?.montoTotal || 0);
      const costoUnitarioPT = montoVenta > 0 && cantidadProducida > 0 ? montoVenta / cantidadProducida : 0;

      await tx.kardexMovimiento.create({
        data: {
          categoriaKardex: CategoriaKardex.PRODUCTO_TERMINADO,
          productoNombre: orden.formula.nombreProducto,
          familia: orden.pedidoComercial?.productoNombre || 'Productos Terminados',
          categoriaNombre: 'Producto Terminado Aprobado',
          proveedorCliente: clienteFinal,
          unidadMedida: orden.pedidoComercial?.unidadMedida || 'KG',
          fecha: new Date(),
          tipoDoc: 'OP',
          serie: 'LOTE',
          numero: orden.codigoLote,
          otp: `OTP-${orden.codigoLote}`,
          tipoOperacion: TipoMovimiento.ENTRADA_PRODUCCION,
          cantidadEntrada: cantidadProducida,
          cantidadSalida: 0,
          saldoFinal: cantidadProducida,
          costoUnitario: costoUnitarioPT,
          montoEntradaPen: montoVenta,
          montoSaldoPen: montoVenta,
        },
      });

      // 3. Enviar a la Cola de Etiquetas & Despacho (/produccion/etiquetas)
      await (tx as any).colaDespacho.create({
        data: {
          loteCodigo: orden.codigoLote,
          productoNombre: orden.formula.nombreProducto,
          clienteNombre: clienteFinal,
          cantidad: `${cantidadProducida} KG`,
          fechaFabricacion: new Date(),
          codigoQR: `QR-QUIMICORP-${orden.codigoLote}`,
          codigoBarras: `7759000${orden.codigoLote.replace(/\D/g, '') || '1001'}`,
          estado: 'LISTO_PARA_IMPRIMIR',
          ruc: '20612434124',
        },
      });

      // 4. Emisión de Evento WebSocket
      this.produccionGateway.emitirEstadoActualizado({
        ordenId: ordenAprobada.id,
        codigoLote: ordenAprobada.codigoLote,
        clienteNombre: clienteFinal,
        nuevoEstado: 'APROBADO',
        pasoProceso: 'LIBERADO_QA',
        observaciones: dto.observacionesQA,
        timestamp: new Date().toISOString(),
      });

      return ordenAprobada;
    });
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
    },
  ) {
    if (!colaId) {
      throw new BadRequestException('Se requiere colaId para registrar el despacho.');
    }

    const cola = await (this.prisma as any).colaDespacho.findUnique({ where: { id: colaId } });
    if (!cola) {
      throw new NotFoundException('No se encontró el registro de despacho de la cola.');
    }

    const colaActualizada = await (this.prisma as any).colaDespacho.update({
      where: { id: colaId },
      data: {
        estado: 'DESPACHADO',
        numeroGuia: numeroGuia?.trim() ? numeroGuia.trim() : null,
      },
    });

    // Marcar la Orden de Producción asociada como DESPACHADA (vínculo por código de lote).
    const orden = await this.prisma.ordenProduccion.findFirst({
      where: { codigoLote: cola.loteCodigo },
    });
    if (orden) {
      await this.prisma.ordenProduccion.update({
        where: { id: orden.id },
        data: {
          estado: EstadoOrdenProduccion.DESPACHADO,
          pasoProceso: 'DESPACHADO',
          fechaCierre: new Date(),
        },
      });

      // Propagar el estado ENTREGADO al Pedido Comercial vinculado. Se usa la FK
      // `pedidoComercialId` (relación directa creada en la migración) como fuente
      // principal; se conserva la coincidencia por dígitos solo como fallback para
      // órdenes legacy sin relación.
      let pedidoVinculado: { id: string } | null = null;
      if (orden.pedidoComercialId) {
        pedidoVinculado = await (this.prisma as any).pedidoComercial
          .findFirst({ where: { id: orden.pedidoComercialId } })
          .catch(() => null);
      }
      if (!pedidoVinculado) {
        const numPart = (orden.codigoLote || '').replace(/\D/g, '');
        pedidoVinculado = await (this.prisma as any).pedidoComercial
          .findFirst({
            where: {
              OR: numPart
                ? [
                    { codigoOrden: { contains: numPart } },
                    { codigoRefAdmin: { contains: numPart } },
                  ]
                : [],
              clienteNombre: orden.clienteNombre || undefined,
            },
            orderBy: { createdAt: 'desc' },
          })
          .catch(() => null);
      }

      if (pedidoVinculado) {
        await (this.prisma as any).pedidoComercial.update({
          where: { id: pedidoVinculado.id },
          data: { estado: 'ENTREGADO', fechaEntrega: new Date() },
        });
      }

      this.produccionGateway.emitirEstadoActualizado({
        ordenId: orden.id,
        codigoLote: orden.codigoLote,
        clienteNombre: orden.clienteNombre || '',
        nuevoEstado: 'DESPACHADO',
        pasoProceso: 'DESPACHADO',
        observaciones: 'Lote despachado y entregado al cliente.',
        timestamp: new Date().toISOString(),
      });
    }

    // Descuento de envases consumidos en el despacho (1 etiqueta = 1 envase).
    // Soporta hasta dos envases diferentes por despacho; cada uno genera su
    // SALIDA_VENTA en kardex (KardexMovimiento + KardexInmutable) y actualiza su stock.
    const opcionesEnvases: { sku: string; cantidad: number }[] = [];
    if (opciones?.envaseSku) {
      opcionesEnvases.push({ sku: opciones.envaseSku, cantidad: Number(opciones.envaseCantidad || 0) });
    }
    if (opciones?.envaseSku2) {
      opcionesEnvases.push({ sku: opciones.envaseSku2, cantidad: Number(opciones.envaseCantidad2 || 0) });
    }

    let envaseDescontado: { sku: string; nombre: string; cantidad: number; saldo: number }[] = [];
    if (opcionesEnvases.length > 0) {
      for (const opt of opcionesEnvases) {
        if (!(opt.cantidad > 0)) {
          throw new BadRequestException('Indica la cantidad de envases consumidos en el despacho.');
        }
      }

      // usuarioId es obligatorio en kardex_inmutable: se usa el supervisor del lote
      // o, en su defecto, el usuario de sistema de importación (dni 70000000).
      let usuarioRegistro: string = orden?.supervisorId || '';
      if (!usuarioRegistro) {
        const usrSistema = await this.prisma.usuario.findFirst({ where: { dni: '70000000' } });
        usuarioRegistro = usrSistema?.id || '';
      }
      if (!usuarioRegistro) {
        throw new BadRequestException('No se pudo determinar el usuario responsable del despacho.');
      }

      const documentoRef = numeroGuia?.trim() || `LOTE-${cola.loteCodigo}`;

      const envasesResueltos = await Promise.all(
        opcionesEnvases.map(async (opt) => {
          const envase = await this.prisma.insumo.findFirst({
            where: { codigo: opt.sku },
            include: { familia: true },
          });
          if (!envase) {
            throw new NotFoundException(`Envase ${opt.sku} no encontrado en el maestro de insumos.`);
          }
          return { sku: opt.sku, cantidad: opt.cantidad, envase };
        }),
      );

      // Descuento atómico: stock + KardexMovimiento + KardexInmutable en una sola transacción
      await this.prisma.$transaction(async (tx) => {
        for (const { cantidad, envase } of envasesResueltos) {
          const envaseTx = await tx.insumo.findFirstOrThrow({
            where: { id: envase.id },
          });
          const stockActual = Number(envaseTx.stockReal);
          if (stockActual < cantidad) {
            throw new BadRequestException(
              `Stock insuficiente de ${envase.codigo} (${envase.nombre}): hay ${stockActual} ${envase.unidadMedida} y el despacho consume ${cantidad}.`,
            );
          }
          const nuevoSaldo = stockActual - cantidad;

          await tx.insumo.update({
            where: { id: envase.id },
            data: { stockReal: nuevoSaldo },
          });

          await tx.kardexMovimiento.create({
            data: {
              categoriaKardex: CategoriaKardex.ENVASE,
              productoNombre: envase.nombre,
              familia: envase.familia?.nombre || 'ENVASES Y EMBALAJES',
              categoriaNombre: envase.familia?.nombre || 'Envases y Embalajes',
              proveedorCliente: `Despacho ${cola.loteCodigo} (${cola.clienteNombre || 'Cliente Quimicorp'})`,
              unidadMedida: envase.unidadMedida,
              fecha: new Date(),
              tipoDoc: 'GUIA',
              serie: 'REG',
              numero: documentoRef,
              otp: `OTP-${cola.loteCodigo}`,
              tipoOperacion: TipoMovimiento.SALIDA_VENTA,
              cantidadEntrada: 0,
              cantidadSalida: cantidad,
              saldoFinal: nuevoSaldo,
              costoUnitario: Number(envase.costoUnitario || 0),
              montoSalidaPen: cantidad * Number(envase.costoUnitario || 0),
              montoSaldoPen: nuevoSaldo * Number(envase.costoUnitario || 0),
              insumoId: envase.id,
            },
          });

          await tx.kardexInmutable.create({
            data: {
              insumoId: envase.id,
              tipoMovimiento: TipoMovimientoKardex.SALIDA,
              cantidad,
              stockAnterior: stockActual,
              stockNuevo: nuevoSaldo,
              documentoReferencia: documentoRef,
              usuarioId: usuarioRegistro,
            },
          });

          envaseDescontado.push({ sku: envase.codigo, nombre: envase.nombre, cantidad, saldo: nuevoSaldo });
        }
      });
    }

    return { ...colaActualizada, envaseDescontado };
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

  listar(fechaStr?: string) {
    let whereCondition: any = {};
    if (fechaStr) {
      const { inicioDia, finDia } = this.parsearRangoDia(fechaStr);
      whereCondition.createdAt = { gte: inicioDia, lte: finDia };
    }

    return this.prisma.ordenProduccion.findMany({
      where: whereCondition,
      include: {
        formula: { include: { detalles: { include: { insumo: { include: { familia: true } } } } } },
        supervisor: { select: { nombres: true, apellidos: true } },
      },
      orderBy: { createdAt: 'desc' },
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
        pedidoComercial: { select: { cantidadSolicitada: true, unidadMedida: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalKgProgramados = 0;
    let terminadosCount = 0;
    let enProcesoCount = 0;
    let pendientesCount = 0;

    const listaFormatted = ordenesDelDia.map((oItem) => {
      const o = oItem as any;
      const cantGramos = Number(o.cantidadPlanificada) || 0;
      totalKgProgramados += cantGramos;

      // Resolver unidad y cantidad de presentación desde el pedido comercial vinculado
      const pedido = o.pedidoComercial;
      const unidadPedido = pedido?.unidadMedida || 'KG';
      const cantPedido = Number(pedido?.cantidadSolicitada);
      const cantidadVisual = Number.isFinite(cantPedido) && cantPedido > 0 ? cantPedido : cantGramos / 1000;

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
        totalKgProgramados: (totalKgProgramados / 1000).toFixed(2),
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

    const cantidadPlanificadaKg = Number(orden.cantidadPlanificada) || 100;

    // 1. Componentes base de la fórmula
    const ingredientesBase = orden.formula.detalles.map((d) => {
      const pct = Number(d.porcentaje);
      const gramos = cantidadPlanificadaKg * 1000 * (pct / 100);
      return {
        insumoId: d.insumoId,
        codigo: d.insumo.codigo,
        nombre: d.insumo.nombre,
        familia: d.insumo.familia?.nombre || 'General',
        tipo: 'BASE',
        porcentaje: pct,
        gramosCalculados: Math.round(gramos * 100) / 100,
        unidadMedida: d.insumo.unidadMedida,
        stockReal: Number(d.insumo.stockReal),
        suficiente: Number(d.insumo.stockReal) * 1000 >= gramos,
        esAditivo: false,
      };
    });

    // 2. Aditivos del pedido comercial asociado
    let aditivos: any[] = [];
    let pedidoConVariante: any = null;
    if (orden.codigoLote) {
      const numPart = (orden.codigoLote || '').replace(/\D/g, '');

      const pedido = await (this.prisma as any).pedidoComercial.findFirst({
        where: numPart
          ? {
              OR: [
                { codigoOrden: { contains: numPart } },
                { codigoRefAdmin: { contains: numPart } },
                { clienteNombre: orden.clienteNombre },
              ],
            }
          : { clienteNombre: orden.clienteNombre },
        include: {
          aditivos: {
            include: {
              insumo: {
                include: { familia: true },
              },
            },
          },
          variante: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (pedido && pedido.aditivos && pedido.aditivos.length > 0) {
        pedidoConVariante = pedido;
        aditivos = pedido.aditivos.map((ad: any) => {
          const pct = Number(ad.porcentaje) || (ad.tipo === 'PIGMENTO' ? 0.5 : 1.0);
          const gramos = Number(ad.gramosCalculados) || (cantidadPlanificadaKg * 1000 * (pct / 100));
          return {
            insumoId: ad.insumoId,
            codigo: ad.insumo?.codigo || 'AD-001',
            nombre: ad.insumo?.nombre || 'Aditivo Personalizado',
            familia: ad.insumo?.familia?.nombre || (ad.tipo === 'FRAGANCIA' ? 'Fragancias' : 'Pigmentos'),
            tipo: ad.tipo || 'FRAGANCIA',
            porcentaje: pct,
            gramosCalculados: Math.round(gramos * 100) / 100,
            unidadMedida: ad.insumo?.unidadMedida || 'KG',
            stockReal: Number(ad.insumo?.stockReal || 50),
            suficiente: Number(ad.insumo?.stockReal || 50) * 1000 >= gramos,
            esAditivo: true,
          };
        });
      }
    }

    const mergeReceta = [...ingredientesBase, ...aditivos];
    const totalGramos = mergeReceta.reduce((sum, item) => sum + item.gramosCalculados, 0);

    // Prioriza los pasos de elaboración de la VARIANTE (cliente específico) si existen;
    // si no, usa los pasos de la fórmula maestra.
    const pasosVariant = pedidoConVariante?.variante?.pasosElaboracion;
    const pasosEfectivos = Array.isArray(pasosVariant) && pasosVariant.length > 0
      ? pasosVariant
      : (Array.isArray(orden.formula.pasosElaboracion) ? orden.formula.pasosElaboracion : []);

    return {
      ordenId: orden.id,
      codigoLote: orden.codigoLote,
      clienteNombre: orden.clienteNombre,
      productoNombre: orden.formula.nombreProducto,
      cantidadPlanificadaKg,
      totalGramos: Math.round(totalGramos * 100) / 100,
      ingredientes: mergeReceta,
      pasosElaboracion: pasosEfectivos,
    };
  }
}

