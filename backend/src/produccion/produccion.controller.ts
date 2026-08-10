import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import {
  AsignarOperariosDto,
  CambiarPasoDto,
  CrearOrdenDto,
  DecidirQADto,
  RegistrarAjusteFinoDto,
  ValidarStockDto,
} from './dto/crear-orden.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('produccion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProduccionController {
  constructor(private readonly produccionService: ProduccionService) {}

  @Get('ordenes/programacion-diaria')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  obtenerProgramacionDiaria(@Query('fecha') fecha?: string) {
    return this.produccionService.obtenerProgramacionDiaria(fecha);
  }

  @Post('ordenes/validar-stock')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  validarStock(@Body() dto: ValidarStockDto) {
    return this.produccionService.validarStockDisponible(dto);
  }

  @Post('ordenes')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  crearOrden(@Body() dto: CrearOrdenDto) {
    return this.produccionService.crearOrden(dto);
  }

  @Get('ordenes')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.FINANZAS)
  listar() {
    return this.produccionService.listar();
  }

  @Patch('ordenes/operarios')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  asignarOperarios(@Body() dto: AsignarOperariosDto) {
    return this.produccionService.asignarOperarios(dto);
  }

  @Patch('ordenes/paso')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  cambiarPaso(@Body() dto: CambiarPasoDto) {
    return this.produccionService.cambiarPasoProceso(dto);
  }

  @Post('ajustes-finos')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  registrarAjusteFino(@Body() dto: RegistrarAjusteFinoDto) {
    return this.produccionService.registrarAjusteFino(dto);
  }

  @Get('qa/pendientes')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN, Role.ADMINISTRACION)
  listarPendientesQA() {
    return this.produccionService.listarPendientesQA();
  }

  @Patch('qa/aprobar')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN, Role.ADMINISTRACION)
  aprobar(@Body() dto: DecidirQADto) {
    return this.produccionService.aprobarLote(dto);
  }

  @Patch('qa/rechazar')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN, Role.ADMINISTRACION)
  rechazar(@Body() dto: DecidirQADto) {
    return this.produccionService.rechazarLote(dto);
  }

  @Patch('ordenes/:id/enviar-qa')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  enviarAQA(@Param('id', ParseUUIDPipe) id: string, @Body('cantidadObtenida') cantidadObtenida: number) {
    return this.produccionService.enviarAQA(id, cantidadObtenida);
  }

  @Get('etiquetas/cola')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  obtenerColaDespacho() {
    return this.produccionService.obtenerColaDespacho();
  }

}
