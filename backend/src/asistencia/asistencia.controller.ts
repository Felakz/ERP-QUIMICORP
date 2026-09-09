import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { RegistrarMarcacionDto, VincularUsuarioDto } from './dto/marcacion.dto';
import { ServiceTokenGuard } from './guards/service-token.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  // Webhook del worker del huellero (token de servicio, no requiere login humano)
  @Post('marcaciones')
  @UseGuards(ServiceTokenGuard)
  registrarMarcacion(@Body() dto: RegistrarMarcacionDto) {
    return this.asistenciaService.registrarMarcacion(dto);
  }

  // Vista para el panel de biometría de Administración
  @Get('hoy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO, Role.RECURSOS_HUMANOS, Role.PRODUCCION_ALMACEN)
  obtenerHoy(@Query('fecha') fecha?: string, @Query('area') area?: string) {
    return this.asistenciaService.obtenerAsistenciaHoy(fecha, area);
  }

  @Get('marcaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO, Role.RECURSOS_HUMANOS)
  obtenerMarcaciones(@Query('fecha') fecha?: string) {
    return this.asistenciaService.obtenerMarcaciones(fecha);
  }

  @Get('cola')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO, Role.RECURSOS_HUMANOS)
  obtenerCola() {
    return this.asistenciaService.obtenerColaPendientes();
  }

  @Post('usuarios/:id/vincular')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO, Role.RECURSOS_HUMANOS)
  vincular(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VincularUsuarioDto,
  ) {
    return this.asistenciaService.vincularUsuario(id, dto);
  }

  @Get('sucursales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO)
  sucursales() {
    return this.asistenciaService.listarSucursales();
  }

  @Get('turnos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO)
  turnos() {
    return this.asistenciaService.listarTurnos();
  }
}
