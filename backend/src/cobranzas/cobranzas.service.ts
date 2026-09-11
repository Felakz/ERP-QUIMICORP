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
    if (estado && estado !== 'TODOS' && estado !== 'VENCIDO') where.estado = estado;
    if (condicion && condicion !== 'TODOS') where.condicionPago = { contains: condicion, mode: 'insensitive' };
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
    const dias = dto.diasPlazo || 0;
    const fVenc = dto.fechaVencimiento
      ? new Date(dto.fechaVencimiento)
      : new Date(fEmision.getTime() + dias * 24 * 60 * 60 * 1000);

    return this.prisma.cuentaCobrar.create({
      data: {
        codigoDoc: dto.codigoDoc,
        clienteId: dto.clienteId,
        clienteNombre: dto.clienteNombre,
        clienteRuc: dto.clienteRuc,
        ordenProd: dto.ordenProd,
        producto: dto.producto,
        montoTotal: dto.montoTotal,
        saldoPendiente: dto.montoTotal,
        condicionPago: dto.condicionPago || 'Contado',
        diasPlazo: dias,
        fechaEmision: fEmision,
        fechaVencimiento: fVenc,
        estado: 'PENDIENTE',
        medioPago: dto.medioPago,
        canalBanco: dto.canalBanco,
      },
      include: {
        pagos: true,
      },
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
