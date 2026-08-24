import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AutorizacionesService {
  constructor(private prisma: PrismaService) {}

  // Crear una nueva solicitud de autorización (por ejemplo, del Asistente Admin)
  async solicitar(data: {
    solicitanteId: string;
    solicitanteEmail: string;
    solicitanteNombre: string;
    modulo: string;
    accion: string;
    recursoId?: string;
    recursoNombre?: string;
    motivo?: string;
  }) {
    return this.prisma.solicitudAutorizacion.create({
      data: {
        solicitanteId: data.solicitanteId,
        solicitanteEmail: data.solicitanteEmail,
        solicitanteNombre: data.solicitanteNombre,
        modulo: data.modulo,
        accion: data.accion,
        recursoId: data.recursoId,
        recursoNombre: data.recursoNombre,
        motivo: data.motivo,
        estado: 'PENDIENTE',
      },
    });
  }

  // Obtener todas las solicitudes pendientes (para la vista/campana del Gerente Admin)
  async obtenerPendientes() {
    return this.prisma.solicitudAutorizacion.findMany({
      where: { estado: 'PENDIENTE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Obtener las solicitudes creadas por un usuario (para verificar si el Asistente ya tiene permiso aprobado)
  async obtenerMisSolicitudes(solicitanteEmail: string) {
    return this.prisma.solicitudAutorizacion.findMany({
      where: { solicitanteEmail: solicitanteEmail.toLowerCase() },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Responder a una solicitud (Aprobar o Rechazar) por parte del Gerente
  async responder(
    id: string,
    data: { estado: 'APROBADO' | 'RECHAZADO'; aprobadorEmail: string; respuestaMotivo?: string }
  ) {
    const existe = await this.prisma.solicitudAutorizacion.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Solicitud de autorización no encontrada');
    }

    return this.prisma.solicitudAutorizacion.update({
      where: { id },
      data: {
        estado: data.estado,
        aprobadorEmail: data.aprobadorEmail,
        respuestaMotivo: data.respuestaMotivo,
      },
    });
  }
}
