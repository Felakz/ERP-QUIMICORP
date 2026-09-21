import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const db = this.prisma;
    const where: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { razonSocial: { contains: q, mode: 'insensitive' } },
        { ruc: { contains: q, mode: 'insensitive' } },
        { direccion: { contains: q, mode: 'insensitive' } },
        {
          contactos: {
            some: {
              OR: [
                { nombre: { contains: q, mode: 'insensitive' } },
                { cargo: { contains: q, mode: 'insensitive' } },
                { telefono: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }
    const clientes = await db.cliente.findMany({
      where,
      include: {
        contactos: {
          orderBy: { esPrincipal: 'desc' },
        },
        pedidos: {
          select: {
            id: true,
            montoTotal: true,
            estado: true,
            fechaPrometida: true,
            cantidadSolicitada: true,
          },
        },
        cuentasCobrar: {
          select: {
            id: true,
            montoTotal: true,
            saldoPendiente: true,
            estado: true,
            fechaVencimiento: true,
          },
        },
      },
      orderBy: { razonSocial: 'asc' },
    });

    return clientes.map((c: any) => {
      const tieneCuentas = (c.cuentasCobrar || []).length > 0;
      let totalFacturadoPen = 0;
      let saldoPendientePen = 0;
      let totalPagadoPen = 0;

      if (tieneCuentas) {
        for (const cc of c.cuentasCobrar) {
          const t = Number(cc.montoTotal) || 0;
          const s = Number(cc.saldoPendiente) || 0;
          totalFacturadoPen += t;
          saldoPendientePen += s;
          totalPagadoPen += t - s;
        }
      } else {
        totalFacturadoPen = c.pedidos?.reduce(
          (acc: number, p: any) => acc + Number(p.montoTotal || 0),
          0
        ) || 0;
        const pendientes = c.pedidos?.filter((p: any) => p.estado !== 'RECHAZADO' && p.estado !== 'APROBADO') || [];
        saldoPendientePen = pendientes.reduce(
          (acc: number, p: any) => acc + Number(p.montoTotal || 0),
          0
        );
        totalPagadoPen = Math.max(0, totalFacturadoPen - saldoPendientePen);
      }

      const totalVolumenKgLt = tieneCuentas
        ? (c.cuentasCobrar.length * 50) + (c.pedidos?.reduce((acc: number, p: any) => acc + Number(p.cantidadSolicitada || 0), 0) || 0)
        : c.pedidos?.reduce((acc: number, p: any) => acc + Number(p.cantidadSolicitada || 0), 0) || 0;

      const tieneVencidos = tieneCuentas
        ? c.cuentasCobrar.some((cc: any) => Number(cc.saldoPendiente) > 0 && new Date(cc.fechaVencimiento) < new Date())
        : c.pedidos?.some((p: any) => p.fechaPrometida && new Date(p.fechaPrometida) < new Date() && p.estado !== 'APROBADO');

      const estadoCalculado = c.estado || (tieneVencidos ? 'CON_SALDO' : 'ACTIVO');

      return {
        ...c,
        estado: estadoCalculado,
        metrics: {
          totalVolumenKgLt,
          totalFacturadoPen,
          totalPagadoPen,
          saldoPendientePen,
          totalPedidosCount: tieneCuentas ? c.cuentasCobrar.length : (c.pedidos?.length || 0),
          totalFacturasCount: tieneCuentas ? c.cuentasCobrar.length : (c.pedidos?.filter((p: any) => p.docType === 'OP' || !p.docType).length || 0),
        },
      };
    });
  }

  async findOne(id: string) {
    const db = this.prisma;
    const cleanId = (id || '').trim();
    const cliente = await db.cliente.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { ruc: cleanId },
        ],
      },
      include: {
        contactos: {
          orderBy: { esPrincipal: 'desc' },
        },
        pedidos: {
          orderBy: { createdAt: 'desc' },
        },
        cuentasCobrar: {
          include: {
            pagos: {
              orderBy: { fechaAbono: 'desc' },
            },
          },
          orderBy: { fechaEmision: 'desc' },
        },
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con identificador '${id}' no encontrado`);
    }

    const tieneCuentas = (cliente.cuentasCobrar || []).length > 0;

    let totalFacturadoPen = 0;
    let saldoPendientePen = 0;
    let totalPagadoPen = 0;

    if (tieneCuentas) {
      for (const cc of cliente.cuentasCobrar) {
        const total = Number(cc.montoTotal) || 0;
        const saldo = Number(cc.saldoPendiente) || 0;
        totalFacturadoPen += total;
        saldoPendientePen += saldo;
        totalPagadoPen += total - saldo;
      }
    } else {
      totalFacturadoPen = cliente.pedidos?.reduce(
        (acc: number, p: any) => acc + Number(p.montoTotal || 0),
        0
      ) || 0;
      const pendientes = cliente.pedidos?.filter((p: any) => p.estado !== 'RECHAZADO' && p.estado !== 'APROBADO') || [];
      saldoPendientePen = pendientes.reduce(
        (acc: number, p: any) => acc + Number(p.montoTotal || 0),
        0
      );
      totalPagadoPen = Math.max(0, totalFacturadoPen - saldoPendientePen);
    }

    const totalVolumenKgLt = tieneCuentas
      ? (cliente.cuentasCobrar.length * 50) + (cliente.pedidos?.reduce((acc: number, p: any) => acc + Number(p.cantidadSolicitada || 0), 0) || 0)
      : cliente.pedidos?.reduce((acc: number, p: any) => acc + Number(p.cantidadSolicitada || 0), 0) || 0;

    const tieneVencidos = tieneCuentas
      ? cliente.cuentasCobrar.some((cc) => Number(cc.saldoPendiente) > 0 && new Date(cc.fechaVencimiento) < new Date())
      : cliente.pedidos?.some((p: any) => p.fechaPrometida && new Date(p.fechaPrometida) < new Date() && p.estado !== 'APROBADO');

    const estadoCalculado = tieneVencidos ? 'CON_SALDO' : 'ACTIVO';

    // Helper para determinar cantidad de lote y unidad real (KG vs Litros)
    const parseBatchVolumeAndUnit = (productName: string, totalAmount: number): { volumen: number; unidadMedida: string } => {
      if (!productName) {
        return { volumen: 50, unidadMedida: 'KG' };
      }

      const nameUpper = productName.toUpperCase();

      // 1. Detección de volumen explícito en el nombre del producto (ej: "BALDE DE 20 KG", "10 LITROS", "100L", "500 ML")
      const matchExplicit = nameUpper.match(/(\d+(?:\.\d+)?)\s*(KG|KILOGRAMOS?|KILOS?|L|LT|LTS|LITROS?|GL|GALONES?|ML|GR|GRAMOS?)\b/);
      if (matchExplicit) {
        const val = parseFloat(matchExplicit[1]);
        const unitRaw = matchExplicit[2];
        if (unitRaw.startsWith('L') || unitRaw === 'LT' || unitRaw === 'LTS') {
          return { volumen: val, unidadMedida: 'L' };
        }
        if (unitRaw.startsWith('KG') || unitRaw.startsWith('KILO')) {
          return { volumen: val, unidadMedida: 'KG' };
        }
        if (unitRaw.startsWith('GL') || unitRaw.startsWith('GAL')) {
          return { volumen: val, unidadMedida: 'GL' };
        }
        if (unitRaw === 'ML') {
          return { volumen: val / 1000, unidadMedida: 'L' };
        }
        if (unitRaw === 'GR' || unitRaw.startsWith('GRAM')) {
          return { volumen: val / 1000, unidadMedida: 'KG' };
        }
      }

      // 2. Clasificación por naturaleza química del producto
      const isLiquid = /PARFUM|PERFUM|SPRAY|TONICO|ACEITE|CHAMPU|SHAMPOO|LIQ|JBON|LOCION|LCN|SERUM|SRM|SANITIZANTE|ALCOHOL|DESINFECTANTE|IMPERMEABILIZANTE/.test(nameUpper);
      const defaultUnit = isLiquid ? 'L' : 'KG';

      // 3. Estimación comercial según el volumen de facturación del comprobante
      let calculatedVolume = 50;
      if (totalAmount >= 5000) {
        calculatedVolume = 200;
      } else if (totalAmount >= 2000) {
        calculatedVolume = 100;
      } else if (totalAmount >= 800) {
        calculatedVolume = 50;
      } else if (totalAmount >= 300) {
        calculatedVolume = 25;
      } else {
        calculatedVolume = 10;
      }

      return { volumen: calculatedVolume, unidadMedida: defaultUnit };
    };

    // Mapa de estado de pago REAL desde cobranzas (fuente: CuentaCobrar), clave = ordenProd | codigoDoc
    const pagoRealPorOrden = new Map<string, string>();
    (cliente.cuentasCobrar || []).forEach((cc: any) => {
      const key = cc.ordenProd || cc.codigoDoc;
      if (!key) return;
      const saldo = Number(cc.saldoPendiente) || 0;
      const estadoDerivado =
        saldo > 0 && cc.fechaVencimiento && new Date(cc.fechaVencimiento) < new Date() ? 'VENCIDO' : cc.estado;
      pagoRealPorOrden.set(key, estadoDerivado);
    });

    // Mapa del PedidoComercial por id (fuente REAL de estado de entrega, propagado por despacho)
    const pedidoById = new Map<string, any>();
    (cliente.pedidos || []).forEach((p: any) => pedidoById.set(p.id, p));

    // Fallback de vínculo por código de orden (comprobantes legacy sin pedidoId)
    const pedidoByOrden = new Map<string, any>();
    (cliente.pedidos || []).forEach((p: any) => {
      if (p.codigoOrden) pedidoByOrden.set(p.codigoOrden, p);
    });

    // 1. Historial de Pedidos & OPs
    const pedidosHistory = tieneCuentas
      ? cliente.cuentasCobrar.map((cc) => {
          const total = Number(cc.montoTotal) || 0;
          const saldo = Number(cc.saldoPendiente) || 0;
          const pagado = total - saldo;
          const { volumen, unidadMedida } = parseBatchVolumeAndUnit(cc.producto || '', total);

          // Estado de ENTREGA real proviene del PedidoComercial vinculado (flujo de planta), NO del pago.
          // Vínculo por FK pedidoId (comprobantes nuevos) o por ordenProd (comprobantes legacy).
          let pedidoVinculado = cc.pedidoId ? pedidoById.get(cc.pedidoId) : undefined;
          if (!pedidoVinculado && cc.ordenProd) pedidoVinculado = pedidoByOrden.get(cc.ordenProd);
          const estadoEntregaReal: string = pedidoVinculado?.estado || 'PENDIENTE';
          const estadoPagoDerivado =
            saldo > 0 && cc.fechaVencimiento && new Date(cc.fechaVencimiento) < new Date()
              ? 'VENCIDO'
              : cc.estado;
          const esPagado = estadoPagoDerivado === 'PAGADO' || saldo === 0;
          const entregado =
            estadoEntregaReal === 'ENTREGADO' ||
            estadoEntregaReal === 'DESPACHADO' ||
            cc.estado === 'ENTREGADO' ||
            cc.estado === 'DESPACHADO';

          return {
            code: cc.ordenProd || `OP-${cc.codigoDoc.replace(/[^0-9]/g, '') || cc.id.substring(0, 6)}`,
            fecha: new Date(cc.fechaEmision).toISOString().split('T')[0],
            fechaEntrega: pedidoVinculado?.fechaEntrega
              ? new Date(pedidoVinculado.fechaEntrega).toISOString().split('T')[0]
              : null,
            volumen,
            unidadMedida,
            variant: cc.producto || 'Fórmula Industrial Base',
            comprobante: cc.codigoDoc,
            vencimiento: new Date(cc.fechaVencimiento).toISOString().split('T')[0],
            monto: total,
            saldo: saldo,
            pagado: pagado,
            estadoPago: estadoPagoDerivado as 'PAGADO' | 'PENDIENTE' | 'VENCIDO',
            estadoEntrega: (entregado ? 'ENTREGADO' : 'PENDIENTE') as 'ENTREGADO' | 'PENDIENTE' | 'EN_RUTA',
            estado: entregado ? 'ENTREGADO' : 'EN_PROCESO',
            medioPago: cc.medioPago || 'DEPOSITO EN CUENTA',
            canalBanco: cc.canalBanco || 'INTERBANK',
          };
        })
      : (cliente.pedidos || []).map((p: any) => {
          const total = Number(p.montoTotal || 0);
          const parsed = parseBatchVolumeAndUnit(p.productoNombre || '', total);
          const volumen = Number(p.cantidadSolicitada || 0) || parsed.volumen;
          const unidadMedida = p.unidadMedida || parsed.unidadMedida;

          // Estado de PAGO real desde cobranza (CuentaCobrar), NO inferido de APROBADO
          const pagoReal = pagoRealPorOrden.get(p.codigoOrden) || pagoRealPorOrden.get(p.id) || 'PENDIENTE';
          const esPagadoReal = pagoReal === 'PAGADO';
          // Estado de ENTREGA real desde flujo de planta propagado al PedidoComercial (despacho)
          const entregadoReal = p.estado === 'ENTREGADO' || p.estado === 'DESPACHADO';

          return {
            code: p.codigoOrden || `OP-${p.id.substring(0, 6)}`,
            fecha: new Date(p.createdAt).toISOString().split('T')[0],
            fechaEntrega: p.fechaEntrega ? new Date(p.fechaEntrega).toISOString().split('T')[0] : null,
            volumen,
            unidadMedida,
            variant: p.productoNombre || 'Fórmula Industrial',
            comprobante: p.codigoOrden ? p.codigoOrden.replace('OP-', 'FAC-F001-') : `FAC-${p.id.substring(0, 6)}`,
            vencimiento: p.fechaPrometida ? new Date(p.fechaPrometida).toISOString().split('T')[0] : new Date(p.createdAt).toISOString().split('T')[0],
            monto: total,
            saldo: esPagadoReal ? 0 : total,
            pagado: esPagadoReal ? total : 0,
            estadoPago: pagoReal as 'PAGADO' | 'PENDIENTE' | 'VENCIDO',
            estadoEntrega: (entregadoReal ? 'ENTREGADO' : 'PENDIENTE') as 'ENTREGADO' | 'PENDIENTE' | 'EN_RUTA',
            estado: p.estado === 'ENTREGADO' ? 'ENTREGADO' : p.estado === 'EN_PRODUCCION' ? 'EN_PROCESO' : p.estado === 'DESPACHADO' ? 'ENTREGADO' : 'PENDIENTE',
            medioPago: pagoReal === 'PAGADO' ? 'TRANSFERENCIA BCP' : 'PENDIENTE',
            canalBanco: pagoReal === 'PAGADO' ? 'BCP CUENTA CORRIENTE' : '',
          };
        });

    // 2. Historial de Facturas & Comprobantes
    const facturasHistory = tieneCuentas
      ? cliente.cuentasCobrar.map((cc) => ({
          doc: cc.codigoDoc,
          emision: new Date(cc.fechaEmision).toISOString().split('T')[0],
          venc: new Date(cc.fechaVencimiento).toISOString().split('T')[0],
          monto: Number(cc.montoTotal),
          saldo: Number(cc.saldoPendiente),
          estado: cc.estado,
          tipo: cc.medioPago || undefined,
        }))
      : (cliente.pedidos || []).map((p: any) => {
          const pagoReal = pagoRealPorOrden.get(p.codigoOrden) || pagoRealPorOrden.get(p.id) || 'PENDIENTE';
          return {
            doc: p.codigoOrden ? p.codigoOrden.replace('OP-', 'FAC-F001-') : `FAC-${p.id.substring(0, 6)}`,
            emision: new Date(p.createdAt).toISOString().split('T')[0],
            venc: p.fechaPrometida ? new Date(p.fechaPrometida).toISOString().split('T')[0] : new Date(p.createdAt).toISOString().split('T')[0],
            monto: Number(p.montoTotal || 0),
            saldo: pagoReal === 'PAGADO' ? 0 : Number(p.montoTotal || 0),
            estado: pagoReal,
          };
        });

    // 3. Historial de Pagos & Abonos
    const pagosHistory = tieneCuentas
      ? cliente.cuentasCobrar.flatMap((cc) => {
          if (cc.pagos && cc.pagos.length > 0) {
            return cc.pagos.map((pg) => ({
              fecha: new Date(pg.fechaAbono).toISOString().split('T')[0],
              banco: pg.banco || cc.canalBanco || 'INTERBANK',
              op: pg.numOperacion || `AB-${pg.id.substring(0, 6).toUpperCase()}`,
              monto: Number(pg.montoAbonado),
              metodo: pg.medio || 'DEPOSITO EN CUENTA',
            }));
          } else if (cc.estado === 'PAGADO') {
            return [
              {
                fecha: cc.fechaPago ? new Date(cc.fechaPago).toISOString().split('T')[0] : new Date(cc.fechaEmision).toISOString().split('T')[0],
                banco: cc.canalBanco || 'INTERBANK CTA CTE',
                op: `DEP-${cc.codigoDoc.replace(/[^0-9]/g, '') || cc.id.substring(0, 6)}`,
                monto: Number(cc.montoTotal) - Number(cc.saldoPendiente),
                metodo: cc.medioPago || 'DEPOSITO EN CUENTA',
              },
            ];
          }
          return [];
        })
      : (cliente.pedidos || [])
          .filter((p: any) => (pagoRealPorOrden.get(p.codigoOrden) || pagoRealPorOrden.get(p.id)) === 'PAGADO')
          .map((p: any) => ({
            fecha: new Date(p.updatedAt || p.createdAt).toISOString().split('T')[0],
            banco: 'BCP CUENTA CORRIENTE',
            op: `OP-${p.id.substring(0, 7).toUpperCase()}`,
            monto: Number(p.montoTotal || 0),
            metodo: 'TRANSFERENCIA BCP',
          }));

    // 4. Historial de Despachos & Logística (fuente REAL: cola_despacho del módulo de producción)
    const nombresCliente = Array.from(
      new Set(
        [
          (cliente as any).razonSocial,
          ...(cliente.pedidos || []).map((p: any) => p.clienteNombre),
        ]
          .map((n: any) => (n ? String(n).trim() : ''))
          .filter(Boolean)
      )
    );
    const despachosReales = await db.colaDespacho
      .findMany({
        where: {
          estado: 'DESPACHADO',
          OR: [{ clienteNombre: { in: nombresCliente, mode: 'insensitive' } }],
        },
        orderBy: { updatedAt: 'desc' },
      })
      .catch(() => [] as any[]);

    const despachosHistory =
      despachosReales.length > 0
        ? despachosReales.map((c: any) => ({
            guia: c.numeroGuia ? String(c.numeroGuia) : `L${c.loteCodigo}`,
            fecha: new Date(c.updatedAt).toISOString().split('T')[0],
            transporte: cliente.metodoEnvio || 'LOGÍSTICA QUIMICORP',
            destino: cliente.direccion || 'Planta Principal / Lima',
            estado: 'ENTREGADO',
          }))
        : tieneCuentas
          ? cliente.cuentasCobrar.map((cc) => ({
              guia: `EG01-${cc.codigoDoc.replace('E001-', '').replace('EB01-', '') || cc.id.substring(0, 6)}`,
              fecha: new Date(cc.fechaEmision).toISOString().split('T')[0],
              transporte: cliente.metodoEnvio || 'TRANSPORTE LOGÍSTICA QUIMICORP',
              destino: cliente.direccion || 'Planta Principal / Lima',
              estado: cc.estado === 'PAGADO' ? 'ENTREGADO' : 'EN_RUTA',
            }))
          : (cliente.pedidos || []).map((p: any) => ({
              guia: `EG01-${p.id.substring(0, 6).toUpperCase()}`,
              fecha: new Date(p.createdAt).toISOString().split('T')[0],
              transporte: cliente.metodoEnvio || 'INDRIVER EXPRESS',
              destino: cliente.direccion || 'Planta Principal',
              estado: p.estado === 'ENTREGADO' || p.estado === 'DESPACHADO' ? 'ENTREGADO' : 'PENDIENTE',
            }));

    return {
      ...cliente,
      estado: estadoCalculado,
      metrics: {
        totalVolumenKgLt,
        totalFacturadoPen,
        totalPagadoPen,
        saldoPendientePen,
        totalPedidosCount: tieneCuentas ? cliente.cuentasCobrar.length : (cliente.pedidos?.length || 0),
        totalFacturasCount: tieneCuentas ? cliente.cuentasCobrar.length : (cliente.pedidos?.filter((p: any) => p.docType === 'OP' || !p.docType).length || 0),
      },
      pedidosHistory,
      facturasHistory,
      pagosHistory,
      despachosHistory,
    };
  }

  async findByRuc(ruc: string) {
    const db = this.prisma;
    return db.cliente.findUnique({
      where: { ruc },
      include: {
        contactos: {
          orderBy: { esPrincipal: 'desc' },
        },
      },
    });
  }

  async create(dto: {
    razonSocial: string;
    ruc: string;
    telefono?: string;
    direccion?: string;
    contacto?: string;
    metodoEnvio?: string;
    condicionPago?: string;
    contactos?: { nombre: string; cargo?: string; telefono?: string; esPrincipal?: boolean }[];
  }) {
    const db = this.prisma;
    const existing = await db.cliente.findUnique({
      where: { ruc: dto.ruc },
      include: { contactos: true },
    });
    if (existing) {
      return existing;
    }

    const contactosData = dto.contactos && dto.contactos.length > 0
      ? dto.contactos
      : dto.contacto
        ? [{ nombre: dto.contacto, cargo: 'Contacto Principal', telefono: dto.telefono, esPrincipal: true }]
        : [];

    return db.cliente.create({
      data: {
        razonSocial: dto.razonSocial,
        ruc: dto.ruc,
        telefono: dto.telefono || null,
        direccion: dto.direccion || null,
        contacto: dto.contacto || null,
        metodoEnvio: dto.metodoEnvio || null,
        condicionPago: dto.condicionPago || 'Contado',
        contactos: {
          create: contactosData,
        },
      },
      include: {
        contactos: true,
      },
    });
  }

  async update(id: string, dto: {
    razonSocial?: string;
    ruc?: string;
    telefono?: string;
    direccion?: string;
    contacto?: string;
    metodoEnvio?: string;
    condicionPago?: string;
    estado?: string;
    contactos?: { nombre: string; cargo?: string; telefono?: string; esPrincipal?: boolean }[];
  }) {
    const db = this.prisma;
    const cleanRuc = dto.ruc?.trim();

    try {
      // 1. Si el RUC ingresado ya le pertenece a OTRO cliente registrado (ej. cliente canónico previo),
      // consolidar automáticamente ambos registros para no duplicar ni generar error de clave única.
      if (cleanRuc) {
        const duplicateClient = await db.cliente.findUnique({
          where: { ruc: cleanRuc },
        });

        if (duplicateClient && duplicateClient.id !== id) {
          return await db.$transaction(async (tx: any) => {
            // Reasignar pedidos comerciales
            await tx.pedidoComercial.updateMany({
              where: { clienteId: id },
              data: {
                clienteId: duplicateClient.id,
                clienteRuc: cleanRuc,
                clienteNombre: dto.razonSocial?.trim() || duplicateClient.razonSocial,
              },
            });

            // Reasignar cuentas por cobrar
            await tx.cuentaCobrar.updateMany({
              where: { clienteId: id },
              data: {
                clienteId: duplicateClient.id,
                clienteRuc: cleanRuc,
                clienteNombre: dto.razonSocial?.trim() || duplicateClient.razonSocial,
              },
            });

            // Reasignar variantes de fórmula
            await tx.formulaVariant.updateMany({
              where: { clienteId: id },
              data: {
                clienteId: duplicateClient.id,
              },
            });

            // Actualizar datos maestros en el cliente canónico
            await tx.cliente.update({
              where: { id: duplicateClient.id },
              data: {
                razonSocial: dto.razonSocial?.trim() || duplicateClient.razonSocial,
                telefono: dto.telefono?.trim() ?? duplicateClient.telefono,
                direccion: dto.direccion?.trim() ?? duplicateClient.direccion,
                contacto: dto.contacto?.trim() ?? duplicateClient.contacto,
                metodoEnvio: dto.metodoEnvio?.trim() ?? duplicateClient.metodoEnvio,
                condicionPago: dto.condicionPago ?? duplicateClient.condicionPago,
              },
            });

            // Consolidar contactos en el cliente canónico
            if (dto.contactos || dto.contacto !== undefined) {
              const contactosData =
                dto.contactos && dto.contactos.length > 0
                  ? dto.contactos
                  : dto.contacto
                    ? [{ nombre: dto.contacto, cargo: 'Contacto Principal', telefono: dto.telefono, esPrincipal: true }]
                    : [];

              await tx.contactoRepresentante.deleteMany({ where: { clienteId: duplicateClient.id } });
              if (contactosData.length > 0) {
                await tx.contactoRepresentante.createMany({
                  data: contactosData.map((c: any) => ({
                    clienteId: duplicateClient.id,
                    nombre: c.nombre.trim(),
                    cargo: c.cargo?.trim() || null,
                    telefono: c.telefono?.trim() || null,
                    esPrincipal: c.esPrincipal ?? false,
                  })),
                });
              }
            }

            // Eliminar el registro duplicado / temporal
            await tx.contactoRepresentante.deleteMany({ where: { clienteId: id } });
            await tx.cliente.delete({ where: { id } });

            return tx.cliente.findUnique({
              where: { id: duplicateClient.id },
              include: {
                contactos: { orderBy: { esPrincipal: 'desc' } },
              },
            });
          });
        }
      }

      // 2. Actualización estándar sin conflicto de RUC
      await db.cliente.update({
        where: { id },
        data: {
          razonSocial: dto.razonSocial?.trim(),
          ruc: cleanRuc,
          telefono: dto.telefono?.trim() ?? undefined,
          direccion: dto.direccion?.trim() ?? undefined,
          contacto: dto.contacto?.trim(),
          metodoEnvio: dto.metodoEnvio?.trim(),
          condicionPago: dto.condicionPago,
        },
      });

      if (dto.contactos || dto.contacto !== undefined) {
        const contactosData =
          dto.contactos && dto.contactos.length > 0
            ? dto.contactos
            : dto.contacto
              ? [{ nombre: dto.contacto, cargo: 'Contacto Principal', telefono: dto.telefono, esPrincipal: true }]
              : [];

        await db.contactoRepresentante.deleteMany({ where: { clienteId: id } });
        if (contactosData.length > 0) {
          await db.contactoRepresentante.createMany({
            data: contactosData.map((c) => ({
              clienteId: id,
              nombre: c.nombre.trim(),
              cargo: c.cargo?.trim() || null,
              telefono: c.telefono?.trim() || null,
              esPrincipal: c.esPrincipal ?? false,
            })),
          });
        }
      }

      return db.cliente.findUnique({
        where: { id },
        include: {
          contactos: { orderBy: { esPrincipal: 'desc' } },
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new BadRequestException(`El RUC ${cleanRuc || ''} ya está registrado para otro cliente.`);
      }
      throw new BadRequestException(err.message || 'Error al actualizar el cliente.');
    }
  }
}
