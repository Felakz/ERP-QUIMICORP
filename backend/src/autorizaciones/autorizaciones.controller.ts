import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { AutorizacionesService } from './autorizaciones.service';

@Controller('autorizaciones')
export class AutorizacionesController {
  constructor(private readonly autorizacionesService: AutorizacionesService) {}

  @Post('solicitar')
  async solicitar(
    @Body()
    body: {
      solicitanteId: string;
      solicitanteEmail: string;
      solicitanteNombre: string;
      modulo: string;
      accion: string;
      recursoId?: string;
      recursoNombre?: string;
      motivo?: string;
    },
  ) {
    return this.autorizacionesService.solicitar(body);
  }

  @Get('pendientes')
  async obtenerPendientes() {
    return this.autorizacionesService.obtenerPendientes();
  }

  @Get('mis-solicitudes')
  async obtenerMisSolicitudes(@Query('email') email: string) {
    return this.autorizacionesService.obtenerMisSolicitudes(email || '');
  }

  @Patch(':id/responder')
  async responder(
    @Param('id') id: string,
    @Body() body: { estado: 'APROBADO' | 'RECHAZADO'; aprobadorEmail: string; respuestaMotivo?: string },
  ) {
    return this.autorizacionesService.responder(id, body);
  }
}
