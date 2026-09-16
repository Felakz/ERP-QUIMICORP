import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegistrarAbonoDto } from './dto/registrar-abono.dto';
import { CrearCuentaCobrarDto } from './dto/crear-cuenta-cobrar.dto';

@Injectable()
export class CobranzasService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Estado de pago derivado: si hay saldo pendiente y venció la fecha de vencimiento → VENCIDO.
   * Se calcula al leer (sin job nocturno) para que nunca quede desactualizado.
   */
  private derivarEstado(cc: any): string {
    const saldo = Number(cc.saldoPendiente) || 0;
    if (saldo > 0 && cc.fechaVencimiento && new Date(cc.fechaVencimiento) < new Date()) {
      return 'VENCIDO';
    }
    return cc.estado || 'PENDIENTE';
  }

  async listar(estado?: string, condicion?: string, ruc?: string, search?: string) {
    const where: any = {};
    if (estado && estado !== 'TODOS' && estado !== 'VENCIDO') {
      if (estado === 'PENDIENTE') {
        where.estado = { in: ['PENDIENTE', 'VENCIDO'] };
      } else {
        where.estado = estado;
      }
    }
    if (condicion && condicion !== 'TODOS') {
      if (condicion === '07' || condicion === '7') {
        where.OR = [
          { condicionPago: { contains: '07', mode: 'insensitive' } },
          { condicionPago: { contains: '7 días', mode: 'insensitive' } },
          { condicionPago: { contains: '7 dias', mode: 'insensitive' } },
        ];
      } else {
        where.condicionPago = { contains: condicion, mode: 'insensitive' };
      }
    }
    if (ruc) where.clienteRuc = ruc;
    if (search) {
      where.OR = [
        { codigoDoc: { contains: search, mode: 'insensitive' } },
        { clienteNombre: { contains: search, mode: 'insensitive' } },
        { clienteRuc: { contains: search } },
        { ordenProd: { contains: search, mode: 'insensitive' } },
        { producto: { contains: search, mode: 'insensitive' } },
      ];
    }

    const cuentas = await this.prisma.cuentaCobrar.findMany({
      where,
      include: {
        pagos: {
          orderBy: { fechaAbono: 'desc' },
        },
      },
      orderBy: { fechaEmision: 'desc' },
    });

    return cuentas.map((cc) => ({ ...cc, estado: this.derivarEstado(cc) })).filter((cc) => {
      if (estado === 'VENCIDO') return cc.estado === 'VENCIDO';
      if (estado === 'PENDIENTE') return cc.estado === 'PENDIENTE' || cc.estado === 'VENCIDO';
      if (estado === 'PAGADO') return cc.estado === 'PAGADO';
      return true;
    });
  }

  async obtenerKpis() {
    const items = await this.prisma.cuentaCobrar.findMany();
    let totalFacturado = 0;
    let totalCobrado = 0;
    let saldoPendiente = 0;
    let totalVencido = 0;

    const hoy = new Date();

    for (const item of items) {
      const total = Number(item.montoTotal) || 0;
      const saldo = Number(item.saldoPendiente) || 0;
      totalFacturado += total;
      totalCobrado += total - saldo;
      saldoPendiente += saldo;

      if (saldo > 0 && new Date(item.fechaVencimiento) < hoy) {
        totalVencido += saldo;
      }
    }

    return {
      totalFacturado: Number(totalFacturado.toFixed(2)),
      totalCobrado: Number(totalCobrado.toFixed(2)),
      saldoPendiente: Number(saldoPendiente.toFixed(2)),
      totalVencido: Number(totalVencido.toFixed(2)),
      totalDocumentos: items.length,
    };
  }

  async buscarPorId(id: string) {
    const cuenta = await this.prisma.cuentaCobrar.findUnique({
      where: { id },
      include: {
        pagos: {
          orderBy: { fechaAbono: 'desc' },
        },
      },
    });
    if (!cuenta) throw new NotFoundException(`Cuenta por cobrar con ID ${id} no encontrada`);
    return { ...cuenta, estado: this.derivarEstado(cuenta) };
  }

  private round2(n: number) {
    return Number(n.toFixed(2));
  }

  private enMesKey(d: Date | string | null | undefined, anioMes: string) {
    if (!d) return false;
    try {
      const dateObj = typeof d === 'string' ? new Date(d) : d;
      if (isNaN(dateObj.getTime())) return false;
      return dateObj.toISOString().slice(0, 7) === anioMes;
    } catch {
      return false;
    }
  }

  /**
   * Analítica ejecutiva para Finanzas: KPIs del mes con MoM, comparativa de
   * los últimos 6 meses y Top 10 de clientes por cobrado real.
   * - Facturado: cuentas por cobrar emitidas en el mes (fechaEmision).
   * - Cobrado: abonos reales registrados en el mes (fechaAbono).
   */
  async obtenerAnalitica(mes?: string) {
    const hoy = new Date();
    const anioMes = mes || `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    const [anioStr, mesStr] = anioMes.split('-');
    const baseYear = parseInt(anioStr, 10);
    const baseMonthIdx = parseInt(mesStr, 10) - 1;

    // Calcular mes previo en UTC
    const prevDate = new Date(Date.UTC(baseYear, baseMonthIdx - 1, 1));
    const anioMesPrev = prevDate.toISOString().slice(0, 7);

    const [cuentas, pagos] = await Promise.all([
      this.prisma.cuentaCobrar.findMany({ orderBy: { fechaEmision: 'asc' } }),
      this.prisma.pagoAbono.findMany({
        include: {
          cuentaCobrar: {
            select: { clienteNombre: true, clienteRuc: true, montoTotal: true },
          },
        },
        orderBy: { fechaAbono: 'asc' },
      }),
    ]);

    const cuentasMes = cuentas.filter((c) => this.enMesKey(c.fechaEmision, anioMes));
    const pagosMes = pagos.filter((p) => this.enMesKey(p.fechaAbono, anioMes));
    const cuentasPrev = cuentas.filter((c) => this.enMesKey(c.fechaEmision, anioMesPrev));
    const pagosPrev = pagos.filter((p) => this.enMesKey(p.fechaAbono, anioMesPrev));

    const facturado = this.round2(cuentasMes.reduce((acc, c) => acc + Number(c.montoTotal || 0), 0));
    const cobrado = this.round2(pagosMes.reduce((acc, p) => acc + Number(p.montoAbonado || 0), 0));
    const saldoVivo = this.round2(cuentas.reduce((acc, c) => acc + Number(c.saldoPendiente || 0), 0));
    const vencido = this.round2(
      cuentas
        .filter((c) => Number(c.saldoPendiente) > 0 && c.fechaVencimiento && new Date(c.fechaVencimiento) < hoy)
        .reduce((acc, c) => acc + Number(c.saldoPendiente), 0),
    );

    const facturadoPrev = this.round2(cuentasPrev.reduce((acc, c) => acc + Number(c.montoTotal || 0), 0));
    const cobradoPrev = this.round2(pagosPrev.reduce((acc, p) => acc + Number(p.montoAbonado || 0), 0));

    const pct = (actual: number, previo: number) =>
      previo > 0 ? Number((((actual - previo) / previo) * 100).toFixed(1)) : 0;

    // Comparativa últimos 6 meses (UTC seguro)
    const comparativa = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(baseYear, baseMonthIdx - i, 1));
      const key = d.toISOString().slice(0, 7);
      const cMes = cuentas.filter((c) => this.enMesKey(c.fechaEmision, key));
      const pMes = pagos.filter((p) => this.enMesKey(p.fechaAbono, key));
      comparativa.push({
        mes: key,
        facturado: this.round2(cMes.reduce((acc, c) => acc + Number(c.montoTotal || 0), 0)),
        cobrado: this.round2(pMes.reduce((acc, p) => acc + Number(p.montoAbonado || 0), 0)),
        saldo: this.round2(cMes.reduce((acc, c) => acc + Number(c.saldoPendiente || 0), 0)),
      });
    }

    // Top 10 clientes por cobrado real del mes (con null-safety y facturado como referencia)
    const topMap = new Map<string, { clienteNombre: string; clienteRuc: string; cobrado: number; facturado: number; totales: number }>();
    const claveCliente = (nombre: string, ruc: string) => ruc || nombre || 'SIN RUC';

    for (const c of cuentasMes) {
      const nombre = c.clienteNombre || 'Cliente Diverso';
      const ruc = c.clienteRuc || '';
      const k = claveCliente(nombre, ruc);
      const cur = topMap.get(k) || { clienteNombre: nombre, clienteRuc: ruc, cobrado: 0, facturado: 0, totales: 0 };
      cur.facturado += Number(c.montoTotal || 0);
      cur.totales += 1;
      topMap.set(k, cur);
    }
    for (const p of pagosMes) {
      const cc = p.cuentaCobrar || { clienteNombre: 'Cliente Diverso', clienteRuc: '' };
      const nombre = cc.clienteNombre || 'Cliente Diverso';
      const ruc = cc.clienteRuc || '';
      const k = claveCliente(nombre, ruc);
      const cur = topMap.get(k) || { clienteNombre: nombre, clienteRuc: ruc, cobrado: 0, facturado: 0, totales: 0 };
      cur.cobrado += Number(p.montoAbonado || 0);
      topMap.set(k, cur);
    }

    const totalCobradoTop = cobrado;
    const topClientes = Array.from(topMap.values())
      .map((t) => ({
        clienteNombre: t.clienteNombre,
        clienteRuc: t.clienteRuc,
        facturado: this.round2(t.facturado),
        cobrado: this.round2(t.cobrado),
        comprobantes: t.totales,
        participacionCobrado: totalCobradoTop > 0 ? Number(((t.cobrado / totalCobradoTop) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.cobrado - a.cobrado || b.facturado - a.facturado)
      .slice(0, 10);

    const total = cuentas.length;
    const pagadas = cuentas.filter((c) => Number(c.saldoPendiente) === 0).length;

    return {
      mes: anioMes,
      kpis: {
        facturado,
        cobrado,
        saldoPendiente: saldoVivo,
        vencido,
        cobertura: facturado > 0 ? Number(((cobrado / facturado) * 100).toFixed(1)) : 0,
      },
      mom: {
        facturadoPrev,
        cobradoPrev,
        facturadoDelta: pct(facturado, facturadoPrev),
        cobradoDelta: pct(cobrado, cobradoPrev),
      },
      comparativa,
      topClientes,
      comprobantes: { total, pagadas, pendientes: total - pagadas },
    };
  }

  async registrarAbono(id: string, dto: RegistrarAbonoDto) {
    const cuenta = await this.buscarPorId(id);
    const saldoActual = Number(cuenta.saldoPendiente);

    if (dto.montoAbonado > saldoActual) {
      throw new BadRequestException(
        `El monto abonado (S/ ${dto.montoAbonado}) supera el saldo pendiente (S/ ${saldoActual})`,
      );
    }

    const nuevoSaldo = Number((saldoActual - dto.montoAbonado).toFixed(2));
    const nuevoEstado = nuevoSaldo === 0 ? 'PAGADO' : 'PENDIENTE';

    // Registrar abono y actualizar saldo en transacción
    return this.prisma.$transaction(async (tx) => {
      await tx.pagoAbono.create({
        data: {
          cuentaCobrarId: id,
          montoAbonado: dto.montoAbonado,
          medio: dto.medio || 'Deposito en cuenta',
          banco: dto.banco || 'Interbank',
          numOperacion: dto.numOperacion,
          observaciones: dto.observaciones,
        },
      });

      return tx.cuentaCobrar.update({
        where: { id },
        data: {
          saldoPendiente: nuevoSaldo,
          estado: nuevoEstado,
          fechaPago: nuevoEstado === 'PAGADO' ? new Date() : cuenta.fechaPago,
        },
        include: {
          pagos: {
            orderBy: { fechaAbono: 'desc' },
          },
        },
      });
    });
  }

  async crear(dto: CrearCuentaCobrarDto) {
    const fEmision = dto.fechaEmision ? new Date(dto.fechaEmision) : new Date();
    let dias = dto.diasPlazo || 0;
    if (!dias && dto.condicionPago) {
      const matchNum = dto.condicionPago.match(/\d+/);
      if (matchNum) dias = parseInt(matchNum[0], 10);
    }

    const fVenc = dto.fechaVencimiento
      ? new Date(dto.fechaVencimiento)
      : new Date(fEmision.getTime() + dias * 24 * 60 * 60 * 1000);

    const esPagadoCompleto = dto.pagoRecibido === true || (dto.montoAbonadoInicial !== undefined && dto.montoAbonadoInicial >= dto.montoTotal);
    const abonoInicial = esPagadoCompleto ? dto.montoTotal : (dto.montoAbonadoInicial || 0);
    const saldoPendiente = esPagadoCompleto ? 0 : Number((dto.montoTotal - abonoInicial).toFixed(2));
    const estado = saldoPendiente === 0 ? 'PAGADO' : 'PENDIENTE';

    return this.prisma.$transaction(async (tx) => {
      const cuenta = await tx.cuentaCobrar.create({
        data: {
          codigoDoc: dto.codigoDoc,
          clienteId: dto.clienteId,
          clienteNombre: dto.clienteNombre,
          clienteRuc: dto.clienteRuc,
          ordenProd: dto.ordenProd,
          producto: dto.producto,
          montoTotal: dto.montoTotal,
          saldoPendiente,
          condicionPago: dto.condicionPago || 'Contado',
          diasPlazo: dias,
          fechaEmision: fEmision,
          fechaVencimiento: fVenc,
          estado,
          fechaPago: estado === 'PAGADO' ? fEmision : null,
          medioPago: dto.medioPago,
          canalBanco: dto.canalBanco,
        },
      });

      if (abonoInicial > 0) {
        await tx.pagoAbono.create({
          data: {
            cuentaCobrarId: cuenta.id,
            montoAbonado: abonoInicial,
            medio: dto.medioPago || 'Deposito en cuenta',
            banco: dto.canalBanco || 'Interbank',
            numOperacion: dto.numOperacion || null,
            observaciones: dto.observaciones || (esPagadoCompleto ? 'Pago contado cancelado al emitir' : 'Abono inicial'),
            fechaAbono: esPagadoCompleto ? fEmision : new Date(),
          },
        });
      }

      return tx.cuentaCobrar.findUnique({
        where: { id: cuenta.id },
        include: { pagos: true },
      });
    });
  }

  async actualizar(id: string, dto: any) {
    const cuenta = await this.buscarPorId(id);

    const data: any = {};
    const camposMap: Record<string, string> = {
      codigoDoc: 'codigoDoc',
      clienteNombre: 'clienteNombre',
      clienteRuc: 'clienteRuc',
      ordenProd: 'ordenProd',
      producto: 'producto',
      montoTotal: 'montoTotal',
      saldoPendiente: 'saldoPendiente',
      condicionPago: 'condicionPago',
      diasPlazo: 'diasPlazo',
      estado: 'estado',
      medioPago: 'medioPago',
      canalBanco: 'canalBanco',
      fechaEmision: 'fechaEmision',
      fechaVencimiento: 'fechaVencimiento',
      fechaPago: 'fechaPago',
    };

    for (const key of Object.keys(camposMap)) {
      if (dto[key] !== undefined) {
        data[camposMap[key]] = dto[key];
      }
    }

    // Si cambia montoTotal sin saldoPendiente explícito, recalculamos el saldo
    if (dto.montoTotal !== undefined && dto.saldoPendiente === undefined) {
      const pagado = Number(cuenta.montoTotal) - Number(cuenta.saldoPendiente);
      data.saldoPendiente = Number((Number(dto.montoTotal) - pagado).toFixed(2));
    }

    for (const fechaField of ['fechaEmision', 'fechaVencimiento', 'fechaPago']) {
      if (data[fechaField] !== undefined && data[fechaField]) {
        const parsed = new Date(data[fechaField]);
        if (!isNaN(parsed.getTime())) data[fechaField] = parsed;
        else delete data[fechaField];
      }
      if (data[fechaField] === null) delete data[fechaField];
    }

    // Normalizar estado
    if (data.saldoPendiente !== undefined) {
      const saldo = Number(data.saldoPendiente);
      if (saldo <= 0 && (cuenta.estado !== 'PENDIENTE' || data.estado === undefined)) {
        data.estado = 'PAGADO';
      }
      if (saldo > 0 && data.estado === undefined && cuenta.estado === 'PAGADO') {
        data.estado = 'PENDIENTE';
      }
    }

    return this.prisma.cuentaCobrar.update({
      where: { id },
      data,
      include: {
        pagos: {
          orderBy: { fechaAbono: 'desc' },
        },
      },
    });
  }
}
