import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProduccionGateway } from '../produccion/produccion.gateway';

@Injectable()
export class PedidosAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly produccionGateway: ProduccionGateway,
  ) {}

  // 1. Obtener KPIs superiores dinámicos del día
  async obtenerKpis() {
    const db = this.prisma as any;
    try {
      const [nuevosCount, pendienteRevisionCount, aprobadosCount, enProduccionCount, agregadosHoy] =
        await Promise.all([
          db.pedidoComercial.count({ where: { estado: 'NUEVO' } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'PENDIENTE_REVISION' } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'APROBADO' } }).catch(() => 0),
          db.pedidoComercial.count({ where: { estado: 'EN_PRODUCCION' } }).catch(() => 0),
          db.pedidoComercial.aggregate({ _sum: { montoTotal: true } }).catch(() => ({ _sum: { montoTotal: null } })),
        ]);

      const countTotal = (nuevosCount + pendienteRevisionCount + aprobadosCount + enProduccionCount) || 0;
      const sumValue = agregadosHoy?._sum?.montoTotal ? Number(agregadosHoy._sum.montoTotal) : 0.0;

      return {
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

  // 1.5 Crear nuevo pedido comercial registrado en revisión de planta desde Administración y Finanzas / Fórmulas
  async crearPedido(dto: any) {
    const db = this.prisma as any;
    let codigoOrden = dto.code || `#PO-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const existe = await db.pedidoComercial.findUnique({ where: { codigoOrden } });
    if (existe) {
      codigoOrden = `#PO-${String(Math.floor(1000 + Math.random() * 9000))}`;
    }

    let fechaPrometida = new Date(Date.now() + 7 * 86400000);
    if (dto.fechaPrometida) {
      const parsed = new Date(dto.fechaPrometida);
      if (!isNaN(parsed.getTime())) {
        fechaPrometida = parsed;
      }
    }

    const nuevoPedido = await db.pedidoComercial.create({
      data: {
        codigoOrden,
        clienteNombre: dto.cliente || 'GEYMA S.A.C.',
        clienteRuc: dto.ruc || '20614697321',
        contactoNombre: dto.contacto || 'Carlos Mendoza',
        contactoTelefono: dto.telefono || '+51 998 234 567',
        direccionDespacho: dto.direccion || 'Av. Industrial 342, Ate, Lima',
        repComercial: dto.repComercial || 'Ana Torres (Administración)',
        condicionPago: dto.condicionPago || 'Crédito 30 Días',
        productoNombre: dto.producto || 'FM-0001 - GEL ANTIDOLOR',
        cantidadSolicitada: parseFloat(dto.cantidad) || 29.0,
        unidadMedida: dto.unidad || 'KG',
        prioridad: dto.prioridad || 'URGENTE',
        montoTotal: parseFloat(dto.precioTotal || dto.montoTotal) || 14717.5,
        fechaPrometida,
        estado: 'NUEVO',
        notasAdmin: typeof dto.recetaCalculada === 'object' ? JSON.stringify(dto.recetaCalculada) : dto.observacionesAdmin || '',
      },
    });

    if (this.produccionGateway && this.produccionGateway.server) {
      this.produccionGateway.server.emit('order:created_to_plant', nuevoPedido);
    }

    return nuevoPedido;
  }

  // 2. Listar pedidos con búsqueda, filtros y cálculo automático de stock en Kardex
  async listar(search?: string, estado?: string, prioridad?: string) {
    const db = this.prisma as any;
    const whereCondition: any = {};

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
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calcular el estado de stock en Kardex para cada pedido
    const pedidosConStock = await Promise.all(
      pedidos.map(async (ped: any) => {
        const stockValidacion = await this.calcularStockPedido(ped);
        return {
          ...ped,
          desgloseStock: stockValidacion,
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

  // 4. Aprobar Pedido y Transferir a Control de Producción & QA
  async aprobarPedido(id: string) {
    const db = this.prisma as any;
    const pedido = await db.pedidoComercial.findUnique({
      where: { id },
      include: { formula: true },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    const pedidoActualizado = await db.pedidoComercial.update({
      where: { id },
      data: { estado: 'APROBADO' },
    });

    // Crear la Orden de Producción correspondiente en PostgreSQL
    let targetFormulaId = pedido.formulaId;
    if (!targetFormulaId) {
      const matchCode = (pedido.productoNombre || '').match(/FM-\d+/)?.[0];
      if (matchCode) {
        const found = await this.prisma.formulaMaster.findFirst({
          where: { codigoFormula: { contains: matchCode, mode: 'insensitive' } },
        });
        targetFormulaId = found?.id;
      }
      if (!targetFormulaId) {
        const fallbackFormula = await this.prisma.formulaMaster.findFirst();
        targetFormulaId = fallbackFormula?.id;
      }
    }

    if (targetFormulaId) {
      const codigoLote = `LOT-2024-${pedido.codigoOrden.replace(/\D/g, '') || '0841'}`;
      const existeOp = await this.prisma.ordenProduccion.findFirst({
        where: { codigoLote },
      });
      if (!existeOp) {
        let supervisor = await this.prisma.usuario.findFirst();
        if (!supervisor) {
          let rol = await this.prisma.rol.findFirst();
          if (!rol) {
            rol = await this.prisma.rol.create({
              data: { nombre: 'ADMIN_SISTEMA' },
            });
          }
          supervisor = await this.prisma.usuario.create({
            data: {
              dni: '00000000',
              nombres: 'Supervisor',
              apellidos: 'Planta',
              rolId: rol.id,
              passwordHash: '$2b$10$xyz',
            },
          });
        }

        await this.prisma.ordenProduccion.create({
          data: {
            codigoLote,
            formulaId: targetFormulaId,
            cantidadPlanificada: pedido.cantidadSolicitada,
            clienteNombre: pedido.clienteNombre,
            supervisorId: supervisor.id,
            estado: 'EN_PROCESO',
            pasoProceso: 'PENDIENTE_ASIGNACION',
          },
        });
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

  // 6. Limpiar datos de prueba para iniciar en limpio como nuevo sistema
  async limpiarDatos() {
    const db = this.prisma as any;
    try {
      await db.pedidoComercial.deleteMany({});
      await db.ordenProduccion.deleteMany({});
    } catch (e) {
      console.log('Error limpiando datos:', e);
    }
    return { success: true, message: 'Datos limpiados exitosamente. El sistema está listo para nuevos pedidos.' };
  }

  // Helper privado para calcular stock de insumos cruzando la fórmula con los Insumos en Kardex
  private async calcularStockPedido(pedido: any) {
    if (!pedido.formula || !pedido.formula.detalles || pedido.formula.detalles.length === 0) {
      // Retornar insumos genéricos ilustrativos con chips
      return {
        stockCompleto: true,
        insumosFaltantesCount: 0,
        detalles: [
          { codigo: 'QC-011', nombre: 'Soda Cáustica 50%', requerido: 15.5, disponible: 120.0, suficiente: true },
          { codigo: 'QC-003', nombre: 'LESS 70%', requerido: 45.0, disponible: 80.0, suficiente: true },
          { codigo: 'QC-088', nombre: 'Mentol Cristalino', requerido: 12.0, disponible: 50.0, suficiente: true },
          { codigo: 'QC-001', nombre: 'Agua Desionizada', requerido: 200.0, disponible: 1500.0, suficiente: true },
        ],
      };
    }

    const cantidadBatch = pedido.cantidadSolicitada || 100;
    const detallesCalculados = [];
    let insumosFaltantesCount = 0;

    for (const det of pedido.formula.detalles) {
      const porcentaje = Number(det.porcentaje || 0);
      const requerido = (cantidadBatch * porcentaje) / 100;

      // Obtener el stock real del insumo
      const insumoDb = await this.prisma.insumo.findUnique({
        where: { id: det.insumoId },
      });

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

  // Sembrar datos de ejemplo de la imagen de producción real
  private async sembrarPedidosEjemplo() {
    console.log('⚡ SEMBRANDO PEDIDOS DE EJEMPLO REALES EN POSTGRESQL...');
    let formulaRef = await this.prisma.formulaMaster.findFirst();
    if (!formulaRef) {
      formulaRef = await this.prisma.formulaMaster.create({
        data: {
          codigoFormula: 'FM-8128-v2',
          nombreProducto: 'Crema Muscular Mentolada v2',
          densidadTeorica: 1.05,
          estado: 'ACTIVA',
        },
      });
    }

    const pedidosData = [
      {
        codigoOrden: '#PO-0841',
        codigoRefAdmin: 'ADM-2024-0841',
        clienteNombre: 'Farmacias Peruanas S.A.C.',
        clienteRuc: '20381396431',
        contactoNombre: 'Ing. Rodrigo Salcedo',
        contactoTelefono: '+51 999 234 781',
        direccionDespacho: 'Av. Angamos Este 2646, Surquillo, Lima',
        repComercial: 'Carla Medina',
        condicionPago: 'Crédito 30 días',
        productoNombre: 'Crema Muscular Mentolada',
        cantidadSolicitada: 128,
        unidadMedida: 'UN F0 (1 KG)',
        lotesRequeridos: 3,
        montoTotal: 14720.0,
        fechaPrometida: new Date('2026-08-10'),
        prioridad: 'URGENTE',
        estado: 'NUEVO',
        formulaId: formulaRef?.id,
        notasAdmin:
          'Orden prioritaria para distribución en farmacias. Cliente solicita empaque con sticker adicional de lote visible en frasco.',
      },
      {
        codigoOrden: '#PO-0842',
        codigoRefAdmin: 'ADM-2024-0842',
        clienteNombre: 'Alfalion Corp. S.A.',
        clienteRuc: '20504648087',
        contactoNombre: 'Lic. Diana Vargas',
        contactoTelefono: '+51 987 654 321',
        direccionDespacho: 'Jr. Natalio Sánchez 220, Jesús María, Lima',
        repComercial: 'José Herrera',
        condicionPago: 'Contado',
        productoNombre: 'Serum de Salmón - Alfalion',
        cantidadSolicitada: 1000,
        unidadMedida: 'UN F0 (30 ML)',
        lotesRequeridos: 5,
        montoTotal: 28000.0,
        fechaPrometida: new Date('2026-08-15'),
        prioridad: 'NORMAL',
        estado: 'NUEVO',
        formulaId: formulaRef?.id,
        notasAdmin: 'Solicitud con empaque ámbar cóncavo de exportación.',
      },
      {
        codigoOrden: '#PO-0843',
        codigoRefAdmin: 'ADM-2024-0843',
        clienteNombre: 'Austin Cosmetics Perú',
        clienteRuc: '20601234567',
        contactoNombre: 'Ing. Carlos Austin',
        contactoTelefono: '+51 912 345 678',
        direccionDespacho: 'Av. Industrial 450, Ate, Lima',
        repComercial: 'Carla Medina',
        condicionPago: 'Crédito 15 días',
        productoNombre: 'Shampoo de Batana Orgánico',
        cantidadSolicitada: 500,
        unidadMedida: 'L',
        lotesRequeridos: 2,
        montoTotal: 32500.0,
        fechaPrometida: new Date('2026-08-12'),
        prioridad: 'PROGRAMADO',
        estado: 'APROBADO',
        formulaId: formulaRef?.id,
        notasAdmin: 'Despacho directo a almacén central de distribuidores.',
      },
      {
        codigoOrden: '#PO-0840',
        codigoRefAdmin: 'ADM-2024-0840',
        clienteNombre: 'Geyma Biotech S.A.C.',
        clienteRuc: '20459876543',
        contactoNombre: 'Dra. María Geyma',
        contactoTelefono: '+51 976 543 210',
        direccionDespacho: 'Av. El Sol 890, San Isidro, Lima',
        repComercial: 'José Herrera',
        condicionPago: 'Contado',
        productoNombre: 'Crema Cúrcuma y Mentol Industrial',
        cantidadSolicitada: 250,
        unidadMedida: 'KG',
        lotesRequeridos: 1,
        montoTotal: 32450.0,
        fechaPrometida: new Date('2026-08-08'),
        prioridad: 'URGENTE',
        estado: 'EN_PRODUCCION',
        formulaId: formulaRef?.id,
        notasAdmin: 'En proceso activo de fabricación en reactor R-02.',
      },
    ];

    const db = this.prisma as any;
    for (const p of pedidosData) {
      const res = await db.pedidoComercial.upsert({
        where: { codigoOrden: p.codigoOrden },
        update: {},
        create: p,
      });
      console.log('✅ PEDIDO GUARDADO EN BD:', res.codigoOrden);
    }
  }
}
