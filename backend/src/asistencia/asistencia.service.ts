import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegistrarMarcacionDto, VincularUsuarioDto } from './dto/marcacion.dto';
import { ActualizarUsuarioDto, CrearColaboradorDto } from './dto/actualizar-usuario.dto';

const TIPO_SALIDA_ALMUERZO = 'SALIDA_ALMUERZO';
const TIPO_RETORNO_ALMUERZO = 'RETORNO_ALMUERZO';
const NOMBRE_TURNO_SABADO = 'SABADO';

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

  private esSabado(d: Date): boolean {
    return d.getDay() === 6;
  }

  /**
   * Turno efectivo para una fecha: de lunes a viernes usa el turno del empleado;
   * los sábados aplica automáticamente el turno configurado como "SABADO"
   * (p.ej. 08:00 - 13:00, sin almuerzo) para las marcas que lleguen del huellero.
   */
  private async turnoEfectivo(
    turno: { id: string; horaInicio: string; horaFin: string; toleranciaMinutos: number; almuerzoTope: string } | null,
    fecha: Date,
  ) {
    if (!turno) return null;
    if (this.esSabado(fecha)) {
      const sabado = await this.prisma.turno.findUnique({ where: { nombre: NOMBRE_TURNO_SABADO } });
      if (sabado) {
        return {
          id: sabado.id,
          horaInicio: sabado.horaInicio,
          horaFin: sabado.horaFin,
          toleranciaMinutos: sabado.toleranciaMinutos,
          almuerzoTope: sabado.almuerzoTope,
        };
      }
    }
    return turno;
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
    const turno = await this.turnoEfectivo(usuario.turno, fecha);
    const turnoId = turno?.id ?? null;
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
      if (!asistencia.horaEntrada && turno) {
        const inicio = this.minutosDeHora(turno.horaInicio) + (turno.toleranciaMinutos || 0);
        const llegada = this.minutosDeHora(hm);
        update.minutosTardanza = llegada > inicio ? llegada - inicio : 0;
        update.estadoAsistencia = update.minutosTardanza > 0 ? 'TARDANZA' : 'PUNTUAL';
      }
    } else if (tipo === TIPO_SALIDA_ALMUERZO) {
      update.estadoAlmuerzo = 'EN_ALMUERZO';
    } else if (tipo === TIPO_RETORNO_ALMUERZO) {
      if (turno) {
        const tope = this.minutosDeHora(turno.almuerzoTope || '14:00');
        const retorno = this.minutosDeHora(hm);
        update.estadoAlmuerzo = retorno > tope ? 'EXCEDIDO' : 'COMPLETO';
      } else {
        update.estadoAlmuerzo = 'COMPLETO';
      }
    } else if (tipo === 'SALIDA') {
      update.horaSalida = hm;
      if (asistencia.horaEntrada && turno) {
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
      // Los sábados (turno corto 08:00 - 13:00) no aplica almuerzo obligatorio
      if (this.esSabado(a.fecha)) continue;
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
  async obtenerAsistenciaHoy(fechaInput?: string, area?: string) {
    const fecha = fechaInput ? new Date(fechaInput + 'T00:00:00') : new Date();
    fecha.setHours(0, 0, 0, 0);

    await this.aplicarReglaAlmuerzo(fecha);

    const turnoSabado = this.esSabado(fecha)
      ? await this.prisma.turno.findUnique({ where: { nombre: NOMBRE_TURNO_SABADO } })
      : null;

    // Excluye al usuario de sistema (importación) y, con area=planta, solo al personal de producción
    const where: any = { estado: 'ACTIVO', dni: { not: '70000000' } };
    if (area === 'planta') {
      where.rol = { nombre: 'PRODUCCION_ALMACEN' };
    }

    const usuarios = await this.prisma.usuario.findMany({
      where,
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
        ? turnoSabado
          ? `${turnoSabado.nombre} (${turnoSabado.horaInicio} - ${turnoSabado.horaFin})`
          : `${u.turno.nombre} (${u.turno.horaInicio} - ${u.turno.horaFin})`
        : 'Sin turno asignado';
      const tieneTurnoHoy = !!u.turno;
      const sinMarcar = !a;
      const estado =
        a?.estadoAsistencia || (tieneTurnoHoy ? 'FALTA' : 'SIN_MARCAR');
      return {
        id: u.id,
        dni: u.dni,
        nombre: `${u.nombres} ${u.apellidos}`.trim(),
        nombres: u.nombres,
        apellidos: u.apellidos,
        cargo: u.cargo || u.rol?.nombre || 'Sin cargo',
        rolId: u.rolId,
        rolNombre: u.rol?.nombre || 'PRODUCCION_ALMACEN',
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

  /** Obtener catálogo de roles del sistema */
  async listarRoles() {
    return this.prisma.rol.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Actualizar cargo y rol de colaborador (Exclusivo Gerencia General) */
  async actualizarUsuario(id: string, dto: ActualizarUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { rol: true },
    });
    if (!usuario) {
      throw new NotFoundException(`Colaborador con ID ${id} no encontrado.`);
    }

    if (dto.rolId) {
      const rolExiste = await this.prisma.rol.findUnique({ where: { id: dto.rolId } });
      if (!rolExiste) {
        throw new BadRequestException('El rol seleccionado no es válido en el sistema.');
      }
    }

    const updated = await this.prisma.usuario.update({
      where: { id },
      data: {
        cargo: dto.cargo !== undefined ? dto.cargo.trim() : undefined,
        rolId: dto.rolId !== undefined ? dto.rolId : undefined,
        nombres: dto.nombres !== undefined ? dto.nombres.trim() : undefined,
        apellidos: dto.apellidos !== undefined ? dto.apellidos.trim() : undefined,
        dni: dto.dni !== undefined ? dto.dni.trim() : undefined,
        turnoId: dto.turnoId !== undefined ? (dto.turnoId || null) : undefined,
        sucursalId: dto.sucursalId !== undefined ? (dto.sucursalId || null) : undefined,
        estado: dto.estado !== undefined ? dto.estado : undefined,
      },
      include: {
        rol: true,
        sucursal: true,
        turno: true,
      },
    });

    // Si tiene cuenta en `users`, mantener en sincronía su rolId y role enum
    if (dto.rolId && updated.dni) {
      const rolNombre = updated.rol?.nombre as any;
      await this.prisma.user.updateMany({
        where: { email: { contains: updated.dni } },
        data: {
          rolId: updated.rolId,
          ...(rolNombre ? { role: rolNombre } : {}),
        },
      }).catch(() => null);
    }

    return {
      id: updated.id,
      dni: updated.dni,
      nombre: `${updated.nombres} ${updated.apellidos}`.trim(),
      nombres: updated.nombres,
      apellidos: updated.apellidos,
      cargo: updated.cargo || updated.rol?.nombre || 'Sin cargo',
      rolId: updated.rolId,
      rolNombre: updated.rol?.nombre || 'PRODUCCION_ALMACEN',
      sucursal: updated.sucursal?.nombre || '—',
      sucursalId: updated.sucursalId,
      turnoId: updated.turnoId,
      turno: updated.turno
        ? `${updated.turno.nombre} (${updated.turno.horaInicio} - ${updated.turno.horaFin})`
        : 'Sin turno asignado',
      estado: updated.estado,
    };
  }

  /** Crear nuevo colaborador (Exclusivo Gerencia General) */
  async crearUsuario(dto: CrearColaboradorDto) {
    const existeDni = await this.prisma.usuario.findUnique({
      where: { dni: dto.dni.trim() },
    });
    if (existeDni) {
      throw new BadRequestException(`Ya existe un colaborador registrado con el DNI ${dto.dni}.`);
    }

    const rolExiste = await this.prisma.rol.findUnique({ where: { id: dto.rolId } });
    if (!rolExiste) {
      throw new BadRequestException('El rol seleccionado no existe.');
    }

    const nuevo = await this.prisma.usuario.create({
      data: {
        dni: dto.dni.trim(),
        nombres: dto.nombres.trim(),
        apellidos: dto.apellidos.trim(),
        cargo: dto.cargo?.trim() || 'OPERARIO',
        rolId: dto.rolId,
        passwordHash: '$2b$10$e8wF3QvYkZ4jR5u1sN7kOuB8t6qG0pA2m5x9Yv3u1r5t8q9w0e2y4', // Hash base
        turnoId: dto.turnoId || null,
        sucursalId: dto.sucursalId || null,
        estado: 'ACTIVO',
      },
      include: {
        rol: true,
        sucursal: true,
        turno: true,
      },
    });

    return {
      id: nuevo.id,
      dni: nuevo.dni,
      nombre: `${nuevo.nombres} ${nuevo.apellidos}`.trim(),
      nombres: nuevo.nombres,
      apellidos: nuevo.apellidos,
      cargo: nuevo.cargo || nuevo.rol?.nombre || 'Sin cargo',
      rolId: nuevo.rolId,
      rolNombre: nuevo.rol?.nombre || 'PRODUCCION_ALMACEN',
      sucursal: nuevo.sucursal?.nombre || '—',
      sucursalId: nuevo.sucursalId,
      turnoId: nuevo.turnoId,
      turno: nuevo.turno
        ? `${nuevo.turno.nombre} (${nuevo.turno.horaInicio} - ${nuevo.turno.horaFin})`
        : 'Sin turno asignado',
      estado: nuevo.estado,
    };
  }

  /** Dar de baja / Desactivar colaborador (Exclusivo Gerencia General) */
  async eliminarUsuario(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Colaborador no encontrado.`);
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { estado: 'INACTIVO' },
    });

    return { ok: true, mensaje: `Colaborador ${usuario.nombres} ${usuario.apellidos} dado de baja exitosamente.` };
  }
}

