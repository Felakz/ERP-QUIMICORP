import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegistrarMarcacionDto, VincularUsuarioDto } from './dto/marcacion.dto';

const TIPO_SALIDA_ALMUERZO = 'SALIDA_ALMUERZO';
const TIPO_RETORNO_ALMUERZO = 'RETORNO_ALMUERZO';

@Injectable()
export class AsistenciaService {
  constructor(private readonly prisma: PrismaService) {}

  private toHm(d: Date): string {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private minutosDeHora(h: string): number {
    if (!h || !h.includes(':')) return 0;
    const [hh, mm] = h.split(':').map((n) => parseInt(n, 10) || 0);
    return hh * 60 + mm;
  }

  /**
   * Webhook llamado por el worker del huellero con cada marcacion.
   * Regla inamovible: la huella es la fuente. Si el codigoBiometrico no esta
   * vinculado a ningun Usuario, la marca se guarda en la cola de pendientes
   * para que gerencia la asigne (nunca se inventa un empleado).
   */
  async registrarMarcacion(dto: RegistrarMarcacionDto) {
    const ts = dto.timestamp ? new Date(dto.timestamp) : new Date();
    const usuario = await this.prisma.usuario.findUnique({
      where: { codigoBiometrico: dto.codigoBiometrico },
      include: { turno: true, sucursal: true },
    });

    if (!usuario || usuario.estado !== 'ACTIVO') {
      const existente = await this.prisma.marcacionPendiente.findFirst({
        where: {
          dispositivoId: dto.dispositivoId,
          codigoBiometrico: dto.codigoBiometrico,
          timestamp: ts,
          procesada: false,
        },
      });
      if (!existente) {
        await this.prisma.marcacionPendiente.create({
          data: {
            dispositivoId: dto.dispositivoId,
            codigoBiometrico: dto.codigoBiometrico,
            tipoMarcacion: dto.tipoMarcacion,
            timestamp: ts,
          },
        });
      }
      return { emparejado: false, pendiente: true, codigoBiometrico: dto.codigoBiometrico };
    }

    // Marcacion de huella historica e inmutable
    const marcacion = await this.prisma.marcacionBiometrico.create({
      data: {
        usuarioId: usuario.id,
        tipoMarcacion: dto.tipoMarcacion,
        timestamp: ts,
        dispositivoId: dto.dispositivoId,
      },
    });

    const fecha = new Date(ts);
    fecha.setHours(0, 0, 0, 0);

    const turno = usuario.turno;
    const asisten = await this.aplicarEstado(usuario, fecha, dto.tipoMarcacion, ts);

    return { emparejado: true, marcacion, asistencia: asisten };
  }

  private async aplicarEstado(
    usuario: { id: string; turno: { id: string; horaInicio: string; horaFin: string; toleranciaMinutos: number; almuerzoTope: string } | null },
    fecha: Date,
    tipo: string,
    ts: Date,
  ) {
    const hm = this.toHm(ts);
    const turnoId = usuario.turno?.id ?? null;
    const base = {
      turnoId,
      fecha,
      usuarioId: usuario.id,
      horasTrabajadas: 0,
    };

    let asistencia = await this.prisma.asistencia.findUnique({
      where: { usuarioId_fecha: { usuarioId: usuario.id, fecha } },
    });

    if (!asistencia) {
      asistencia = await this.prisma.asistencia.create({
        data: { ...base, minutosTardanza: 0, estadoAsistencia: 'PUNTUAL', estadoAlmuerzo: 'PENDIENTE' },
      });
    }

    let update: any = {};

    if (tipo === 'ENTRADA') {
      update.horaEntrada = asistencia.horaEntrada ?? hm;
      if (!asistencia.horaEntrada && usuario.turno) {
        const inicio = this.minutosDeHora(usuario.turno.horaInicio) + (usuario.turno.toleranciaMinutos || 0);
        const llegada = this.minutosDeHora(hm);
        update.minutosTardanza = llegada > inicio ? llegada - inicio : 0;
        update.estadoAsistencia = update.minutosTardanza > 0 ? 'TARDANZA' : 'PUNTUAL';
      }
    } else if (tipo === TIPO_SALIDA_ALMUERZO) {
      update.estadoAlmuerzo = 'EN_ALMUERZO';
    } else if (tipo === TIPO_RETORNO_ALMUERZO) {
      if (usuario.turno) {
        const tope = this.minutosDeHora(usuario.turno.almuerzoTope || '14:00');
        const retorno = this.minutosDeHora(hm);
        update.estadoAlmuerzo = retorno > tope ? 'EXCEDIDO' : 'COMPLETO';
      } else {
        update.estadoAlmuerzo = 'COMPLETO';
      }
    } else if (tipo === 'SALIDA') {
      update.horaSalida = hm;
      if (asistencia.horaEntrada && usuario.turno) {
        const ent = this.minutosDeHora(asistencia.horaEntrada);
        const sal = this.minutosDeHora(hm);
        const horas = Math.max(0, (sal - ent) / 60);
        update.horasTrabajadas = Number(horas.toFixed(2));
      }
    }

    if (Object.keys(update).length) {
      asistencia = await this.prisma.asistencia.update({ where: { id: asistencia.id }, data: update });
    }

    return asistencia;
  }

  /** Evaluar regla obligatoria de almuerzo (tope 14:00) para la fecha consultada. */
  private async aplicarReglaAlmuerzo(fecha: Date) {
    const yaCobradas = await this.prisma.asistencia.findMany({
      where: { fecha, estadoAlmuerzo: 'PENDIENTE' },
      include: { usuario: { include: { turno: true } } },
    });
    const ahora = new Date();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const esHoy = hoy.getTime() === fecha.getTime();
    const topeHoy = esHoy ? this.minutosDeHora('14:00') : 9999;

    for (const a of yaCobradas) {
      if (!a.usuario.turno) continue;
      if (esHoy && ahora.getHours() * 60 + ahora.getMinutes() >= topeHoy) {
        await this.prisma.asistencia.update({
          where: { id: a.id },
          data: { estadoAlmuerzo: 'OBLIGADO_ALMORZAR' },
        });
      } else if (!esHoy) {
        // Días pasados sin marcación de almuerzo: se consolidan como obligatorio
        await this.prisma.asistencia.update({
          where: { id: a.id },
          data: { estadoAlmuerzo: 'OBLIGADO_ALMORZAR' },
        });
      }
    }
  }

  /** Vista diaria de todos los empleados (para el panel de biometría de Administración). */
  async obtenerAsistenciaHoy(fechaInput?: string) {
    const fecha = fechaInput ? new Date(fechaInput + 'T00:00:00') : new Date();
    fecha.setHours(0, 0, 0, 0);

    await this.aplicarReglaAlmuerzo(fecha);

    const usuarios = await this.prisma.usuario.findMany({
      where: { estado: 'ACTIVO' },
      include: {
        turno: true,
        sucursal: true,
        rol: true,
        asistencias: { where: { fecha }, take: 1 },
        marcaciones: {
          where: {
            timestamp: { gte: fecha, lt: new Date(fecha.getTime() + 86400000) },
          },
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    return usuarios.map((u) => {
      const a = u.asistencias[0];
      const turnoTexto = u.turno
        ? `${u.turno.nombre} (${u.turno.horaInicio} - ${u.turno.horaFin})`
        : 'Sin turno asignado';
      const tieneTurnoHoy = !!u.turno;
      const sinMarcar = !a;
      const estado =
        a?.estadoAsistencia || (tieneTurnoHoy ? 'FALTA' : 'SIN_MARCAR');
      return {
        id: u.id,
        dni: u.dni,
        nombre: `${u.nombres} ${u.apellidos}`.trim(),
        cargo: u.cargo || u.rol?.nombre || 'Sin cargo',
        sucursal: u.sucursal?.nombre || '—',
        sucursalId: u.sucursalId,
        turnoId: u.turnoId,
        turno: turnoTexto,
        horaIngreso: a?.horaEntrada || (u.marcaciones[0] ? this.toHm(u.marcaciones[0].timestamp) : '--:--'),
        horaSalida: a?.horaSalida || '--:--',
        minutosTardanza: a?.minutosTardanza || 0,
        horasTrabajadas: a ? Number(a.horasTrabajadas) : 0,
        estado,
        estadoAlmuerzo: a?.estadoAlmuerzo || 'SIN_ALMUERZO',
        huellaVerificada: u.marcaciones.length > 0,
      };
    });
  }

  /** Historial crudo de marcaciones del huellero para una fecha. */
  async obtenerMarcaciones(fechaInput?: string) {
    const fecha = fechaInput ? new Date(fechaInput + 'T00:00:00') : new Date();
    fecha.setHours(0, 0, 0, 0);
    return this.prisma.marcacionBiometrico.findMany({
      where: { timestamp: { gte: fecha, lt: new Date(fecha.getTime() + 86400000) } },
      include: { usuario: { select: { nombres: true, apellidos: true, dni: true } } },
      orderBy: { timestamp: 'asc' },
    });
  }

  /** Cola de huellas aún no vinculadas a ningún empleado. */
  async obtenerColaPendientes() {
    const pendientes = await this.prisma.marcacionPendiente.findMany({
      where: { procesada: false },
      orderBy: { createdAt: 'asc' },
    });
    const agrupado = new Map<string, any>();
    for (const p of pendientes) {
      if (!agrupado.has(p.codigoBiometrico)) {
        agrupado.set(p.codigoBiometrico, {
          codigoBiometrico: p.codigoBiometrico,
          dispositivoId: p.dispositivoId,
          primeraMarca: p.createdAt,
          cantidad: 0,
        });
      }
      agrupado.get(p.codigoBiometrico).cantidad += 1;
    }
    return Array.from(agrupado.values());
  }

  /** Vincular un codigoBiometrico de la cola a un empleado existente. */
  async vincularUsuario(id: string, dto: VincularUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Empleado no encontrado');

    await this.prisma.usuario.update({
      where: { id },
      data: { codigoBiometrico: dto.codigoBiometrico },
    });
    await this.prisma.marcacionPendiente.updateMany({
      where: { codigoBiometrico: dto.codigoBiometrico, procesada: false },
      data: { procesada: true, vinculadoAId: id },
    });
    return { ok: true, empleado: id, codigoBiometrico: dto.codigoBiometrico };
  }

  /** CRUD simple de sucursales y turnos para configuración. */
  async listarSucursales() {
    return this.prisma.sucursal.findMany({ orderBy: { nombre: 'asc' }, include: { usuarios: { select: { id: true } } } });
  }
  async crearSucursal(data: { nombre: string; direccion?: string; dispositivoId?: string; ip?: string; port?: number }) {
    return this.prisma.sucursal.create({ data });
  }
  async listarTurnos() {
    return this.prisma.turno.findMany({ orderBy: { nombre: 'asc' } });
  }
  async crearTurno(data: {
    nombre: string;
    horaInicio: string;
    horaFin: string;
    toleranciaMinutos?: number;
    almuerzoTope?: string;
  }) {
    return this.prisma.turno.create({
      data: {
        nombre: data.nombre,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        toleranciaMinutos: data.toleranciaMinutos ?? 15,
        almuerzoTope: data.almuerzoTope ?? '14:00',
      },
    });
  }
}
