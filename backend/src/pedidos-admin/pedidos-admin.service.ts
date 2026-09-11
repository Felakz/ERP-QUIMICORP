import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProduccionGateway } from '../produccion/produccion.gateway';

@Injectable()
export class PedidosAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly produccionGateway: ProduccionGateway,
  ) {}

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

  // 1. Obtener KPIs superiores dinámicos del día (solo órdenes de producción OP)
  async obtenerKpis(fecha?: string) {
    const db = this.prisma as any;
    try {
      const { inicioDia, finDia, fechaISO } = this.parsearRangoDia(fecha);
      const dateFilter = {
        createdAt: {
          gte: inicioDia,
          lte: finDia,
        },
      };

      const [nuevosCount, pendienteRevisionCount, aprobadosCount, enProduccionCount, agregadosHoy] =
        await Promise.all([
          db.pedidoComercial.count({ where: { estado: 'NUEVO', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'PENDIENTE_REVISION', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'APROBADO', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'EN_PRODUCCION', docType: 'OP', ...dateFilter } }).catch(() => 0),
          db.pedidoComercial.aggregate({ where: { docType: 'OP', ...dateFilter }, _sum: { montoTotal: true } }).catch(() => ({ _sum: { montoTotal: null } })),
        ]);

      const countTotal = (nuevosCount + pendienteRevisionCount + aprobadosCount + enProduccionCount) || 0;
      const sumValue = agregadosHoy?._sum?.montoTotal ? Number(agregadosHoy._sum.montoTotal) : 0.0;

      return {
        fecha: fechaISO,
        pedidosHoy: countTotal,
        nuevos: (nuevosCount + pendienteRevisionCount),
        pendienteRevision: pendienteRevisionCount,
        aprobados: aprobadosCount,
        enProduccion: enProduccionCount,
        valorDelDia: sumValue,
      };
    } catch (e) {
      console.log('Error en obtenerKpis:', e);
      return {
        pedidosHoy: 0,
        nuevos: 0,
        pendienteRevision: 0,
        aprobados: 0,
        enProduccion: 0,
        valorDelDia: 0.0,
      };
    }
  }


  // 1.5 Crear pedido/cotización — bifurcado por mode: 'COTIZACION'|'PEDIDO'
  async crearPedido(dto: any) {
    const db = this.prisma as any;
    const mode: 'COTIZACION' | 'PEDIDO' = dto.mode === 'COTIZACION' ? 'COTIZACION' : 'PEDIDO';

    // ── Generar código de orden único ──
    let codigoOrden: string;
    if (mode === 'COTIZACION') {
      const year = new Date().getFullYear();
      let seq = (await db.pedidoComercial.count({ where: { docType: 'COT' } })) + 1;
      codigoOrden = `COT-${year}-${String(seq).padStart(3, '0')}`;
      while (await db.pedidoComercial.findUnique({ where: { codigoOrden } })) {
        seq++;
        codigoOrden = `COT-${year}-${String(seq).padStart(3, '0')}`;
      }
    } else {
      // Código OP secuencial y trazable (válido para cotizaciones convertidas a pedido
      // o pedidos directos). Si dto.code viene vacío se genera OP-YYYY-NNN.
      const year = new Date().getFullYear();
      let seq = (await db.pedidoComercial.count({ where: { docType: 'OP' } })) + 1;
      let poCode = dto.code || `OP-${year}-${String(seq).padStart(3, '0')}`;
      while (await db.pedidoComercial.findUnique({ where: { codigoOrden: poCode } })) {
        seq++;
        poCode = dto.code || `OP-${year}-${String(seq).padStart(3, '0')}`;
      }
      codigoOrden = poCode;
    }


    // ── Fecha prometida ──
    let fechaPrometida = new Date(Date.now() + 7 * 86400000);
    if (dto.fechaPrometida) {
      const parsed = new Date(dto.fechaPrometida);
      if (!isNaN(parsed.getTime())) fechaPrometida = parsed;
    }

    // ── Resolver formulaId de manera 100% segura contra foreign key constraint ──
    let validFormulaId: string | null = null;
    if (dto.formulaId) {
      const foundById = await this.prisma.formulaMaster.findUnique({
        where: { id: dto.formulaId },
      }).catch(() => null);
      if (foundById) {
        validFormulaId = foundById.id;
      }
    }

    if (!validFormulaId) {
      const matchCode = (dto.producto || dto.formulaId || '').match(/FM-\d+[\w-]*/i)?.[0];
      if (matchCode) {
        const foundByCode = await this.prisma.formulaMaster.findFirst({
          where: { codigoFormula: { contains: matchCode, mode: 'insensitive' } },
        }).catch(() => null);
        if (foundByCode) {
          validFormulaId = foundByCode.id;
        } else {
          const nuevaFormula = await this.prisma.formulaMaster.create({
            data: {
              codigoFormula: matchCode,
              nombreProducto: dto.producto?.replace(matchCode, '').replace(/^[\s-]+/, '').trim() || `Fórmula ${matchCode}`,
              estado: 'ACTIVA',
              densidadTeorica: 1.0,
            },
          }).catch(() => null);
          if (nuevaFormula) {
            validFormulaId = nuevaFormula.id;
          }
        }
      }
    }

    // ── Resolver clienteId seguro ──
    let validClienteId: string | null = null;
    if (dto.clienteId) {
      const cFound = await db.cliente.findUnique({ where: { id: dto.clienteId } }).catch(() => null);
      if (cFound) validClienteId = cFound.id;
    }

    const targetRuc = dto.ruc || dto.clienteInline?.ruc;
    if (!validClienteId && targetRuc) {
      const existing = await db.cliente.findUnique({ where: { ruc: targetRuc } }).catch(() => null);
      if (existing) {
        validClienteId = existing.id;
      } else {
        const nuevo = await db.cliente.create({
          data: {
            razonSocial: dto.cliente || dto.clienteInline?.razonSocial || 'Cliente General',
            ruc: targetRuc,
            telefono: dto.telefono || dto.clienteInline?.telefono || null,
            direccion: dto.direccion || dto.clienteInline?.direccion || null,
            condicionPago: dto.condicionPago || dto.clienteInline?.condicionPago || 'Contado',
          },
        }).catch(() => null);
        if (nuevo) validClienteId = nuevo.id;
      }
    }

    // ── Resolver varianteId seguro ──
    let validVarianteId: string | null = null;
    if (dto.varianteId) {
      const vFound = await db.formulaVariant.findUnique({ where: { id: dto.varianteId } }).catch(() => null);
      if (vFound) validVarianteId = vFound.id;
    }

    // ── Crear el registro ──
    const nuevoPedido = await db.pedidoComercial.create({
      data: {
        codigoOrden,
        docType: mode === 'COTIZACION' ? 'COT' : 'OP',
        clienteNombre: dto.cliente || dto.clienteInline?.razonSocial || '',
        clienteRuc: targetRuc || '',
        contactoNombre: dto.contacto || null,
        contactoTelefono: dto.telefono || null,
        direccionDespacho: dto.direccion || null,
        repComercial: dto.repComercial || null,
        condicionPago: dto.condicionPago || 'Contado',
        productoNombre: dto.producto || dto.productoNombre || '',
        cantidadSolicitada: parseFloat(dto.cantidad) || 1.0,
        unidadMedida: dto.unidad || dto.unidadMedida || 'KG',
        prioridad: dto.prioridad || 'NORMAL',
        montoTotal: parseFloat(dto.precioTotal || dto.montoTotal) || 0,
        fechaPrometida,
        estado: mode === 'COTIZACION' ? 'NUEVO' : 'PENDIENTE_REVISION',
        formulaId: validFormulaId,
        clienteId: validClienteId,
        varianteId: validVarianteId,
        aroma: dto.aroma || null,
        color: dto.color || null,
        aromaText: dto.aromaText || dto.aroma || null,
        colorText: dto.colorText || dto.color || null,
        notasAdmin: dto.itemsJson
          ? JSON.stringify({
              items: dto.itemsJson,
              observaciones: dto.observacionesAdmin || dto.notasAdmin || '',
            })
          : typeof dto.recetaCalculada === 'object'
          ? JSON.stringify(dto.recetaCalculada)
          : dto.observacionesAdmin || dto.notasAdmin || null,
      },
    });

    // ── Persistir PedidoAditivos si vienen en el payload ──
    const kg = parseFloat(dto.cantidad) || 1.0;
    if (dto.aditivos && Array.isArray(dto.aditivos) && dto.aditivos.length > 0) {
      for (const adit of dto.aditivos) {
        if (!adit.insumoId) continue;
        const insumo = await db.insumo.findUnique({ where: { id: adit.insumoId } }).catch(() => null);
        if (!insumo) continue;

        const tipoAditivo = adit.tipo || insumo.tipo || (insumo.nombre.toLowerCase().includes('fragancia') ? 'FRAGANCIA' : 'PIGMENTO');
        let pct = Number(adit.porcentaje);
        if (!pct || pct <= 0) {
          pct = tipoAditivo === 'PIGMENTO' ? 0.5 : 1.0;
        }

        const gramos = kg * 1000 * (pct / 100);

        await db.pedidoAditivo.create({
          data: {
            pedidoId: nuevoPedido.id,
            insumoId: insumo.id,
            tipo: tipoAditivo,
            porcentaje: pct,
            gramosCalculados: gramos,
          },
        }).catch(() => null);
      }
    }

    // ── Emitir WebSocket SOLO para pedidos OP ──
    if (mode === 'PEDIDO' && this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('order:created_to_plant', nuevoPedido);
    }

    return { ...nuevoPedido, isCotizacion: mode === 'COTIZACION' };
  }


  // 2. Listar pedidos con búsqueda, filtros y cálculo automático de stock en Kardex
  async listar(search?: string, estado?: string, prioridad?: string, docType?: string, fecha?: string) {
    const db = this.prisma as any;
    const whereCondition: any = {};

    if (docType && docType.toUpperCase() !== 'TODOS') {
      whereCondition.docType = docType.toUpperCase();
    }

    if (fecha && fecha.trim() !== '' && fecha.toUpperCase() !== 'TODOS') {
      const { inicioDia, finDia } = this.parsearRangoDia(fecha);
      whereCondition.createdAt = { gte: inicioDia, lte: finDia };
    }

    if (estado && estado.toUpperCase() !== 'TODOS') {
      if (estado.toUpperCase() === 'NUEVO') {
        whereCondition.OR = [
          { estado: 'NUEVO' },
          { estado: 'PENDIENTE_REVISION' },
        ];
      } else {
        whereCondition.estado = estado.toUpperCase();
      }
    }

    if (prioridad && prioridad.toUpperCase() !== 'TODAS') {
      whereCondition.prioridad = prioridad.toUpperCase();
    }


    if (search && search.trim() !== '') {
      const q = search.trim();
      whereCondition.OR = [
        { codigoOrden: { contains: q, mode: 'insensitive' } },
        { codigoRefAdmin: { contains: q, mode: 'insensitive' } },
        { clienteNombre: { contains: q, mode: 'insensitive' } },
        { clienteRuc: { contains: q, mode: 'insensitive' } },
        { productoNombre: { contains: q, mode: 'insensitive' } },
      ];
    }

    const pedidos = await db.pedidoComercial.findMany({
      where: whereCondition,
      include: {
        formula: {
          include: {
            detalles: {
              include: {
                insumo: true,
              },
            },
          },
        },
        aditivos: {
          include: {
            insumo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calcular el estado de stock en Kardex y desglosar items guardados
    const pedidosConStock = await Promise.all(
      pedidos.map(async (ped: any) => {
        let stockValidacion: any;
        try {
          stockValidacion = await this.calcularStockPedido(ped);
        } catch {
          stockValidacion = {
            stockCompleto: true,
            insumosFaltantesCount: 0,
            detalles: [],
          };
        }
        
        let itemsList: any[] = [];
        let cleanObservaciones = ped.notasAdmin;

        if (ped.notasAdmin && typeof ped.notasAdmin === 'string') {
          try {
            const parsed = JSON.parse(ped.notasAdmin);
            if (parsed && Array.isArray(parsed.items)) {
              itemsList = parsed.items;
              cleanObservaciones = parsed.observaciones || '';
            }
          } catch {}
        }

        return {
          ...ped,
          desgloseStock: stockValidacion,
          itemsList,
          observacionesClean: cleanObservaciones,
        };
      }),
    );

    return pedidosConStock;
  }


  // 3. Obtener desglose exacto de stock para el modal de stock insuficiente
  async obtenerDesgloseStock(pedidoId: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({
      where: { id: pedidoId },
      include: {
        formula: {
          include: {
            detalles: {
              include: { insumo: true },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido comercial no encontrado.');
    }

    return this.calcularStockPedido(pedido);
  }

  // 3.1 Actualizar Pedido / Cotización (Edición de datos comerciales)
  async actualizarPedido(id: string, dto: any) {
    const db = this.prisma as any;
    const pedidoExistente = await db.pedidoComercial.findUnique({
      where: { id },
      include: { formula: true, clienteRef: true },
    });

    if (!pedidoExistente) {
      throw new NotFoundException(`Pedido comercial con ID ${id} no encontrado.`);
    }

    const dataToUpdate: any = {};

    // 1. Cliente & RUC
    const nuevoClienteNombre = dto.clienteNombre !== undefined ? dto.clienteNombre : dto.cliente;
    if (nuevoClienteNombre !== undefined && nuevoClienteNombre !== null) {
      dataToUpdate.clienteNombre = String(nuevoClienteNombre).trim();
    }

    const nuevoRuc = dto.clienteRuc !== undefined ? dto.clienteRuc : dto.ruc;
    if (nuevoRuc !== undefined && nuevoRuc !== null) {
      const rucLimpio = String(nuevoRuc).trim();
      dataToUpdate.clienteRuc = rucLimpio;

      if (rucLimpio) {
        let clienteEnDb = await db.cliente.findUnique({ where: { ruc: rucLimpio } }).catch(() => null);
        if (!clienteEnDb && nuevoClienteNombre) {
          clienteEnDb = await db.cliente.create({
            data: {
              ruc: rucLimpio,
              razonSocial: String(nuevoClienteNombre).trim(),
              condicionPago: dto.condicionPago || pedidoExistente.condicionPago || 'Contado',
            },
          }).catch(() => null);
        }
        if (clienteEnDb) {
          dataToUpdate.clienteId = clienteEnDb.id;
        }
      }
    }

    // 2. Producto
    const nuevoProducto = dto.productoNombre !== undefined ? dto.productoNombre : dto.producto;
    if (nuevoProducto !== undefined && nuevoProducto !== null) {
      dataToUpdate.productoNombre = String(nuevoProducto).trim();
    }

    // 3. Cantidad y Unidad
    const nuevaCantidad = dto.cantidadSolicitada !== undefined ? dto.cantidadSolicitada : dto.cantidad;
    if (nuevaCantidad !== undefined && nuevaCantidad !== null && nuevaCantidad !== '') {
      const cantNum = parseFloat(nuevaCantidad);
      if (!isNaN(cantNum) && cantNum >= 0) {
        dataToUpdate.cantidadSolicitada = cantNum;
      }
    }

    const nuevaUnidad = dto.unidadMedida !== undefined ? dto.unidadMedida : dto.unidad;
    if (nuevaUnidad !== undefined && nuevaUnidad !== null) {
      dataToUpdate.unidadMedida = String(nuevaUnidad).trim().toUpperCase();
    }

    // 4. Monto Total
    const nuevoMonto = dto.montoTotal !== undefined ? dto.montoTotal : dto.precioTotal;
    if (nuevoMonto !== undefined && nuevoMonto !== null && nuevoMonto !== '') {
      const montoNum = parseFloat(nuevoMonto);
      if (!isNaN(montoNum) && montoNum >= 0) {
        dataToUpdate.montoTotal = montoNum;
      }
    }

    // 5. Condición de Pago
    if (dto.condicionPago !== undefined && dto.condicionPago !== null) {
      dataToUpdate.condicionPago = String(dto.condicionPago).trim();
    }

    // 6. Prioridad
    if (dto.prioridad !== undefined && dto.prioridad !== null) {
      const p = String(dto.prioridad).toUpperCase().trim();
      if (['URGENTE', 'NORMAL', 'PROGRAMADO'].includes(p)) {
        dataToUpdate.prioridad = p;
      }
    }

    // 7. Estado
    const estadoAnterior = pedidoExistente.estado;
    if (dto.estado !== undefined && dto.estado !== null) {
      const est = String(dto.estado).toUpperCase().trim();
      const estadosValidos = [
        'NUEVO',
        'PENDIENTE_REVISION',
        'VALIDANDO',
        'APROBADO',
        'EN_PRODUCCION',
        'DEVUELTO',
        'RECHAZADO',
        'ENTREGADO',
      ];
      if (estadosValidos.includes(est)) {
        dataToUpdate.estado = est;
      }
    }

    // 8. Fecha Prometida
    if (dto.fechaPrometida !== undefined && dto.fechaPrometida !== null && dto.fechaPrometida !== '') {
      const parsedDate = new Date(dto.fechaPrometida);
      if (!isNaN(parsedDate.getTime())) {
        dataToUpdate.fechaPrometida = parsedDate;
      }
    }

    // 9. Tipo Comprobante
    if (dto.tipoComprobante !== undefined) {
      dataToUpdate.tipoComprobante = dto.tipoComprobante ? String(dto.tipoComprobante).trim() : null;
    }

    // 10. Fórmula (FM-xxx o UUID)
    if (dto.formulaId !== undefined && dto.formulaId !== null) {
      const formulaInput = String(dto.formulaId).trim();
      if (formulaInput) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formulaInput)) {
          const fFound = await this.prisma.formulaMaster.findUnique({ where: { id: formulaInput } }).catch(() => null);
          if (fFound) dataToUpdate.formulaId = fFound.id;
        } else {
          const matchCode = formulaInput.match(/FM-\d+[\w-]*/i)?.[0] || formulaInput;
          let found = await this.prisma.formulaMaster.findFirst({
            where: { codigoFormula: { contains: matchCode, mode: 'insensitive' } },
          }).catch(() => null);

          if (!found) {
            found = await this.prisma.formulaMaster.create({
              data: {
                codigoFormula: matchCode.toUpperCase(),
                nombreProducto: dataToUpdate.productoNombre || pedidoExistente.productoNombre || `Fórmula ${matchCode}`,
                estado: 'ACTIVA',
                densidadTeorica: 1.0,
              },
            }).catch(() => null);
          }
          if (found) dataToUpdate.formulaId = found.id;
        }
      }
    }

    // 11. Notas u Observaciones
    if (dto.observaciones !== undefined || dto.notasAdmin !== undefined) {
      const nota = dto.observaciones !== undefined ? dto.observaciones : dto.notasAdmin;
      if (typeof nota === 'string') {
        dataToUpdate.notasAdmin = nota;
      }
    }

    const pedidoActualizado = await db.pedidoComercial.update({
      where: { id },
      data: dataToUpdate,
      include: {
        formula: true,
        aditivos: { include: { insumo: true } },
      },
    });

    // Si cambió a APROBADO desde otro estado, notificar a planta
    if (dataToUpdate.estado === 'APROBADO' && estadoAnterior !== 'APROBADO') {
      if (this.produccionGateway && this.produccionGateway.server) {
        this.produccionGateway.server.emit('pedido:aprobado', pedidoActualizado);
      }
    }

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('pedido:actualizado', pedidoActualizado);
      this.produccionGateway.server.emit('lote:estado_actualizado', pedidoActualizado);
    }

    return pedidoActualizado;
  }

  // 3.2 Eliminar Pedido / Cotización
  async eliminarPedido(id: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({
      where: { id },
      include: { ordenesProduccion: true },
    });

    if (!pedido) {
      throw new NotFoundException('El pedido a eliminar no existe.');
    }

    // Verificar si tiene órdenes de producción activas en planta avanzadas
    if (pedido.ordenesProduccion && pedido.ordenesProduccion.length > 0) {
      const enProceso = pedido.ordenesProduccion.some((op: any) => op.estado === 'EN_PROCESO' || op.estado === 'TERMINADO');
      if (enProceso) {
        throw new BadRequestException('No se puede eliminar un pedido con órdenes de producción en proceso o terminadas en planta.');
      }
      await db.ordenProduccion.deleteMany({
        where: { pedidoComercialId: id },
      }).catch(() => null);
    }

    // Eliminar aditivos vinculados
    await db.pedidoAditivo.deleteMany({
      where: { pedidoId: id },
    }).catch(() => null);

    await db.pedidoComercial.delete({
      where: { id },
    });

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('pedido:eliminado', { id, codigoOrden: pedido.codigoOrden });
    }

    return { ok: true, mensaje: `Pedido ${pedido.codigoOrden} eliminado correctamente.` };
  }

  // 4. Aprobar Pedido y Transferir a Control de Producción & QA
  async aprobarPedido(id: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({
      where: { id },
      include: {
        formula: true,
        aditivos: { include: { insumo: true } },
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    const pedidoActualizado = await db.pedidoComercial.update({
      where: { id },
      data: { estado: 'APROBADO' },
    });

    // Desglosar items si existen
    let itemsParsed: any[] = [];
    if (pedido.notasAdmin) {
      try {
        const parsed = JSON.parse(pedido.notasAdmin);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          itemsParsed = parsed.items;
        }
      } catch {}
    }

    const supervisor = await this.prisma.usuario.findFirst({
      where: { rol: { nombre: 'PRODUCCION_ALMACEN' } },
    });
    if (!supervisor) {
      throw new BadRequestException(
        'No hay usuario con rol PRODUCCION_ALMACEN para asignar como supervisor. Configure el personal de planta primero.',
      );
    }

    const fraganciaAditivo = pedido.aditivos?.find(
      (a: any) => a.tipo === 'FRAGANCIA' || a.insumo?.tipo === 'FRAGANCIA' || a.insumo?.nombre?.toLowerCase().includes('fragancia')
    );
    const pigmentoAditivo = pedido.aditivos?.find(
      (a: any) => a.tipo === 'PIGMENTO' || a.insumo?.tipo === 'PIGMENTO' || a.insumo?.nombre?.toLowerCase().includes('pigmento')
    );

    const defaultFragancia = pedido.aromaText || pedido.aroma || fraganciaAditivo?.insumo?.nombre || 'SIN FRAGANCIA';
    const defaultColor = pedido.colorText || pedido.color || pigmentoAditivo?.insumo?.nombre || 'TRANSPARENTE';

    // Si tiene múltiples items, crear una orden de producción por cada producto
    if (itemsParsed.length > 0) {
      for (let i = 0; i < itemsParsed.length; i++) {
        const item = itemsParsed[i];
        const numPart = pedido.codigoOrden.replace(/\D/g, '') || '0841';
        const codigoLote = `LOT-2024-${numPart}-${i + 1}`;

        let formulaId: string | null = null;
        if (item.formulaId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.formulaId)) {
          const exists = await this.prisma.formulaMaster.findUnique({ where: { id: item.formulaId } }).catch(() => null);
          if (exists) formulaId = exists.id;
        }

        if (!formulaId) {
          const matchCode = (item.codigoFM || item.codigo || item.productoNombre || '').match(/FM-\d+[\w-]*/i)?.[0];
          if (matchCode) {
            let found = await this.prisma.formulaMaster.findFirst({
              where: { codigoFormula: { contains: matchCode, mode: 'insensitive' } },
            }).catch(() => null);
            if (!found) {
              found = await this.prisma.formulaMaster.create({
                data: {
                  codigoFormula: matchCode,
                  nombreProducto: item.productoNombre || item.descripcion || `Fórmula ${matchCode}`,
                  estado: 'ACTIVA',
                  densidadTeorica: 1.0,
                },
              }).catch(() => null);
            }
            if (found) formulaId = found.id;
          }
        }

        if (!formulaId) {
          let fallback = await this.prisma.formulaMaster.findFirst().catch(() => null);
          if (!fallback) {
            fallback = await this.prisma.formulaMaster.create({
              data: {
                codigoFormula: 'FM-0001',
                nombreProducto: item.productoNombre || 'Fórmula Base',
                estado: 'ACTIVA',
                densidadTeorica: 1.0,
              },
            }).catch(() => null);
          }
          if (fallback) formulaId = fallback.id;
        }

        const itemColor = item.color || item.colorText || defaultColor;
        const itemFragancia = item.aroma || item.aromaText || defaultFragancia;

        if (formulaId) {
          const existe = await this.prisma.ordenProduccion.findFirst({ where: { codigoLote } }).catch(() => null);
          if (!existe) {
            await this.prisma.ordenProduccion.create({
              data: {
                codigoLote,
                formulaId,
                cantidadPlanificada: Number(item.cantidad) || 100,
                clienteNombre: pedido.clienteNombre,
                supervisorId: supervisor.id,
                colorEspecificado: itemColor,
                fraganciaEspecificada: itemFragancia,
                estado: 'EN_PROCESO',
                pasoProceso: 'PENDIENTE_ASIGNACION',
                pedidoComercialId: pedido.id,
              },
            }).catch((err: any) => console.log('Error creando ordenProduccion item:', err));
          } else {
            await this.prisma.ordenProduccion.update({
              where: { id: existe.id },
              data: {
                colorEspecificado: itemColor,
                fraganciaEspecificada: itemFragancia,
              },
            }).catch(() => null);
          }
        }
      }
    } else {
      // Pedido único
      let targetFormulaId: string | null = null;
      if (pedido.formulaId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pedido.formulaId)) {
        const exists = await this.prisma.formulaMaster.findUnique({ where: { id: pedido.formulaId } }).catch(() => null);
        if (exists) targetFormulaId = exists.id;
      }

      if (!targetFormulaId) {
        const matchCode = (pedido.productoNombre || '').match(/FM-\d+[\w-]*/i)?.[0];
        if (matchCode) {
          let found = await this.prisma.formulaMaster.findFirst({
            where: { codigoFormula: { contains: matchCode, mode: 'insensitive' } },
          }).catch(() => null);
          if (!found) {
            found = await this.prisma.formulaMaster.create({
              data: {
                codigoFormula: matchCode,
                nombreProducto: pedido.productoNombre || `Fórmula ${matchCode}`,
                estado: 'ACTIVA',
                densidadTeorica: 1.0,
              },
            }).catch(() => null);
          }
          if (found) targetFormulaId = found.id;
        }
      }

      if (!targetFormulaId) {
        let fallback = await this.prisma.formulaMaster.findFirst().catch(() => null);
        if (fallback) targetFormulaId = fallback.id;
      }

      if (targetFormulaId) {
        const codigoLote = `LOT-2024-${pedido.codigoOrden.replace(/\D/g, '') || '0841'}`;
        const existeOp = await this.prisma.ordenProduccion.findFirst({ where: { codigoLote } }).catch(() => null);
        if (!existeOp) {
          await this.prisma.ordenProduccion.create({
            data: {
              codigoLote,
              formulaId: targetFormulaId,
              cantidadPlanificada: pedido.cantidadSolicitada,
              clienteNombre: pedido.clienteNombre,
              supervisorId: supervisor.id,
              colorEspecificado: defaultColor,
              fraganciaEspecificada: defaultFragancia,
              estado: 'EN_PROCESO',
              pasoProceso: 'PENDIENTE_ASIGNACION',
              pedidoComercialId: pedido.id,
            },
          }).catch((err: any) => console.log('Error creando ordenProduccion:', err));
        } else {
          await this.prisma.ordenProduccion.update({
            where: { id: existeOp.id },
            data: {
              colorEspecificado: defaultColor,
              fraganciaEspecificada: defaultFragancia,
            },
          }).catch(() => null);
        }
      }
    }


    // Emitir eventos por WebSocket hacia todas las pantallas (Administración y Planta)
    this.produccionGateway.emitirEstadoActualizado({
      ordenId: pedido.id,
      codigoLote: `LOT-2024-${pedido.codigoOrden.replace(/\D/g, '') || '0841'}`,
      clienteNombre: pedido.clienteNombre,
      nuevoEstado: 'APROBADO',
      pasoProceso: 'PENDIENTE_ASIGNACION',
      timestamp: new Date().toISOString(),
    });

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('order:status_updated', {
        ordenId: pedido.id,
        codigoOrden: pedido.codigoOrden,
        estado: 'APROBADO',
      });
      this.produccionGateway.server.emit('order:accepted_by_plant', {
        ordenId: pedido.id,
        codigoOrden: pedido.codigoOrden,
        estado: 'APROBADO',
      });
    }

    return pedidoActualizado;
  }

  // 5. Devolver Pedido a Administración por falta de stock/insumos
  async devolverPedido(id: string, motivoDevolucion: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({ where: { id } });
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    return db.pedidoComercial.update({
      where: { id },
      data: {
        estado: 'DEVUELTO',
        motivoDevolucion,
      },
    });
  }

  // 5.5 Convertir Cotización Comercial en Pedido de Producción (Aceptado por Cliente)
  async convertirCotizacionAPedido(id: string, dto?: any) {
    const db = this.prisma as any;
    const cotizacion = await db.pedidoComercial.findUnique({ where: { id } });
    if (!cotizacion) {
      throw new NotFoundException('Cotización no encontrada.');
    }

    // Generar código de Orden de Producción OP-YYYY-NNN secuencial y trazable
    const year = new Date().getFullYear();
    let seq = (await db.pedidoComercial.count({ where: { docType: 'OP' } })) + 1;
    let nuevoCodigo = dto?.code || `OP-${year}-${String(seq).padStart(3, '0')}`;
    while (await db.pedidoComercial.findUnique({ where: { codigoOrden: nuevoCodigo } })) {
      seq++;
      nuevoCodigo = dto?.code || `OP-${year}-${String(seq).padStart(3, '0')}`;
    }

    // Preservar estructura JSON de items para no perder el desglose de productos
    let updatedNotasAdmin = cotizacion.notasAdmin;
    let itemsParsed: any[] = [];
    if (cotizacion.notasAdmin) {
      try {
        const parsed = JSON.parse(cotizacion.notasAdmin);
        if (parsed && Array.isArray(parsed.items)) {
          itemsParsed = parsed.items;
          if (dto?.observaciones) {
            parsed.observaciones = dto.observaciones;
          }
          updatedNotasAdmin = JSON.stringify(parsed);
        }
      } catch {
        updatedNotasAdmin = dto?.observaciones || cotizacion.notasAdmin;
      }
    }

    const pedidoConvertido = await db.pedidoComercial.update({
      where: { id },
      data: {
        codigoOrden: nuevoCodigo,
        codigoRefAdmin: cotizacion.codigoOrden, // Guarda referencia al código de cotización COT-...
        docType: 'OP',
        estado: 'PENDIENTE_REVISION',
        prioridad: dto?.prioridad || cotizacion.prioridad || 'NORMAL',
        notasAdmin: updatedNotasAdmin,
      },
    });

    // Transmitir orden a Planta vía WebSocket con itemsList
    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('order:created_to_plant', {
        ...pedidoConvertido,
        itemsList: itemsParsed,
      });
    }

    return {
      success: true,
      message: `Cotización ${cotizacion.codigoOrden} convertida exitosamente a Orden de Producción ${nuevoCodigo} y transmitida a Planta.`,
      pedido: {
        ...pedidoConvertido,
        itemsList: itemsParsed,
      },
    };
  }



  // 6. Limpiar datos de prueba para iniciar en limpio como nuevo sistema
  async limpiarDatos() {
    const db = this.prisma as any;
    try {
      await db.pedidoComercial.deleteMany({});
      await db.ordenProduccion.deleteMany({});
      if (db.colaDespacho) {
        await db.colaDespacho.deleteMany({});
      }
    } catch (e) {
      console.log('Error limpiando datos:', e);
    }

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('order:created_to_plant', null);
      this.produccionGateway.server.emit('order:status_updated', { ordenId: null });
      this.produccionGateway.server.emit('lote:estado_actualizado', { ordenId: null });
    }

    return { success: true, message: 'Datos limpiados exitosamente. El sistema está listo para nuevos pedidos.' };
  }


  // Helper privado para calcular stock de insumos cruzando la fórmula con los Insumos en Kardex
  private async calcularStockPedido(pedido: any) {
    if (!pedido.formula || !pedido.formula.detalles || pedido.formula.detalles.length === 0) {
      return {
        stockCompleto: false,
        insumosFaltantesCount: 0,
        detalles: [],
      };
    }

    const cantidadBatch = pedido.cantidadSolicitada || 100;
    const detallesCalculados = [];
    let insumosFaltantesCount = 0;

    for (const det of pedido.formula.detalles) {
      const porcentaje = Number(det.porcentaje || 0);
      const requerido = (cantidadBatch * porcentaje) / 100;

      // Obtener el stock real del insumo directamente de la relación cargada (cero consultas N+1 a la BD)
      const insumoDb = det.insumo || null;

      const disponible = insumoDb ? Number(insumoDb.stockReal) : 100.0;
      const suficiente = disponible >= requerido;

      if (!suficiente) {
        insumosFaltantesCount++;
      }

      detallesCalculados.push({
        codigo: insumoDb?.codigo || 'QC-001',
        nombre: insumoDb?.nombre || det.insumo?.nombre || 'Insumo Químico',
        requerido: parseFloat(requerido.toFixed(2)),
        disponible: parseFloat(disponible.toFixed(2)),
        faltante: suficiente ? 0 : parseFloat((requerido - disponible).toFixed(2)),
        suficiente,
      });
    }

    return {
      stockCompleto: insumosFaltantesCount === 0,
      insumosFaltantesCount,
      detalles: detallesCalculados,
    };
  }

  /**
   * R1 — Emitir comprobante (Boleta / Factura / Nota de Venta) desde una cotización/pedido.
   * Cambia el tipoComprobante, mantiene el ciclo docType (COT/OP) y registra la cuenta por cobrar.
   */
  async emitirComprobante(pedidoId: string, dto: { tipo: 'BOLETA' | 'FACTURA' | 'NOTA_VENTA' } | any) {
    const tipo = (dto?.tipo || '').toUpperCase();
    if (!['BOLETA', 'FACTURA', 'NOTA_VENTA'].includes(tipo)) {
      throw new Error('Tipo de comprobante inválido. Use BOLETA, FACTURA o NOTA_VENTA.');
    }

    const pedido = await this.prisma.pedidoComercial.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new NotFoundException('Pedido no encontrado.');

    if (pedido.tipoComprobante) {
      throw new BadRequestException(
        `El pedido ${pedido.codigoOrden} ya emitió comprobante (${pedido.tipoComprobante}).`,
      );
    }

    const monto = Number(pedido.montoTotal) || 0;
    const nombre = pedido.clienteNombre || 'Cliente';
    const ruc = pedido.clienteRuc || '00000000000';

    // Días de crédito derivados de la condición de pago para el vencimiento.
    const diasCredito = (() => {
      const m = (pedido.condicionPago || '').toLowerCase();
      const num = m.match(/\d+/)?.[0];
      if (/credito|crédito|dias|días/.test(m) && num) return parseInt(num, 10);
      return 0;
    })();
    const fechaEmision = new Date();
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasCredito);

    // Registrar en cuenta por cobrar (tabla de cobranzas)
    const prefijo = tipo === 'FACTURA' ? 'FAC' : tipo === 'BOLETA' ? 'BOL' : 'NV';
    const nroc = await this.prisma.cuentaCobrar.count();
    const codigoDoc = `${prefijo}-${new Date().getFullYear()}-${String(nroc + 1).padStart(5, '0')}`;

    await this.prisma.cuentaCobrar.create({
      data: {
        codigoDoc,
        clienteId: pedido.clienteId,
        clienteNombre: nombre,
        clienteRuc: ruc,
        ordenProd: pedido.codigoOrden,
        producto: pedido.productoNombre,
        montoTotal: monto,
        saldoPendiente: monto,
        condicionPago: pedido.condicionPago || 'Contado',
        diasPlazo: diasCredito,
        fechaEmision,
        fechaVencimiento,
        estado: 'PENDIENTE',
        medioPago: tipo,
      },
    });

    // Marcar el pedido con su tipo de comprobante emitido
    const actualizado = await this.prisma.pedidoComercial.update({
      where: { id: pedidoId },
      data: { tipoComprobante: tipo },
    });

    return {
      id: actualizado.id,
      codigoOrden: actualizado.codigoOrden,
      tipoComprobante: actualizado.tipoComprobante,
      cuentaCobrar: codigoDoc,
      montoTotal: monto,
    };
  }

  /**
   * R1 — Comparativa por ciclo: facturado vs boletado (vs nota de venta),
   * comparando el período actual contra el anterior.
   * periodo: MES | TRIMESTRE | SEMESTRE | ANUAL
   */
  async comparativaCiclo(periodo: string = 'MES') {
    const now = new Date();
    const ranges = this.rangoPeriodoComparativo(now, (periodo || 'MES').toUpperCase());

    const agregar = async (inicio: Date, fin: Date) => {
      const docs = await (this.prisma as any).pedidoComercial.findMany({
        where: {
          tipoComprobante: { in: ['BOLETA', 'FACTURA', 'NOTA_VENTA'] },
          createdAt: { gte: inicio, lte: fin },
        },
        select: { tipoComprobante: true, montoTotal: true },
      });
      const base = { facturado: 0, boletado: 0, notaVenta: 0, count: 0 };
      const acc = { ...base };
      for (const d of docs) {
        const m = Number(d.montoTotal) || 0;
        acc.count += 1;
        if (d.tipoComprobante === 'FACTURA') acc.facturado += m;
        else if (d.tipoComprobante === 'BOLETA') acc.boletado += m;
        else if (d.tipoComprobante === 'NOTA_VENTA') acc.notaVenta += m;
      }
      return acc;
    };

    const actual = await agregar(ranges.actualInicio, ranges.actualFin);
    const anterior = await agregar(ranges.anteriorInicio, ranges.anteriorFin);

    const cambio = (a: number, b: number) =>
      b > 0 ? Number((((a - b) / b) * 100).toFixed(1)) : 0;

    return {
      periodo: (periodo || 'MES').toUpperCase(),
      actual: { ...actual, total: actual.facturado + actual.boletado + actual.notaVenta },
      anterior: { ...anterior, total: anterior.facturado + anterior.boletado + anterior.notaVenta },
      variacionPorcentual: {
        facturado: cambio(actual.facturado, anterior.facturado),
        boletado: cambio(actual.boletado, anterior.boletado),
        notaVenta: cambio(actual.notaVenta, anterior.notaVenta),
        total: cambio(
          actual.facturado + actual.boletado + actual.notaVenta,
          anterior.facturado + anterior.boletado + anterior.notaVenta,
        ),
      },
    };
  }

  private rangoPeriodoComparativo(now: Date, periodo: string) {
    const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    if (periodo === 'ANUAL') {
      const ai = new Date(now.getFullYear() - 1, 0, 1);
      const af = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      const ni = new Date(now.getFullYear(), 0, 1);
      const nf = endOf(now);
      return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
    }
    if (periodo === 'SEMESTRE') {
      const monthOffset = 6;
      const ai = new Date(now.getFullYear(), now.getMonth() - monthOffset * 2, 1);
      const af = new Date(now.getFullYear(), now.getMonth() - monthOffset, 0, 23, 59, 59, 999);
      const ni = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const nf = endOf(now);
      return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
    }
    if (periodo === 'TRIMESTRE') {
      const ai = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      const af = new Date(now.getFullYear(), now.getMonth() - 3, 0, 23, 59, 59, 999);
      const ni = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      const nf = endOf(now);
      return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
    }
    // MES (default)
    const ai = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const af = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
    const ni = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nf = endOf(now);
    return { anteriorInicio: ai, anteriorFin: af, actualInicio: ni, actualFin: nf };
  }
}

