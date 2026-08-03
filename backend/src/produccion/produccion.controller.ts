import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import {
  AsignarOperariosDto,
  CambiarPasoDto,
  CrearOrdenDto,
  DecidirQADto,
  RegistrarAjusteFinoDto,
  ValidarStockDto,
} from './dto/crear-orden.dto';

@Controller('produccion')
export class ProduccionController {
  constructor(private readonly produccionService: ProduccionService) {}

  @Get('ordenes/programacion-diaria')
  obtenerProgramacionDiaria(@Query('fecha') fecha?: string) {
    return this.produccionService.obtenerProgramacionDiaria(fecha);
  }

  @Post('ordenes/validar-stock')
  validarStock(@Body() dto: ValidarStockDto) {
    return this.produccionService.validarStockDisponible(dto);
  }

  @Post('ordenes')
  crearOrden(@Body() dto: CrearOrdenDto) {
    return this.produccionService.crearOrden(dto);
  }

  @Get('ordenes')
  listar() {
    return this.produccionService.listar();
  }

  @Patch('ordenes/operarios')
  asignarOperarios(@Body() dto: AsignarOperariosDto) {
    return this.produccionService.asignarOperarios(dto);
  }

  @Patch('ordenes/paso')
  cambiarPaso(@Body() dto: CambiarPasoDto) {
    return this.produccionService.cambiarPasoProceso(dto);
  }

  @Post('ajustes-finos')
  registrarAjusteFino(@Body() dto: RegistrarAjusteFinoDto) {
    return this.produccionService.registrarAjusteFino(dto);
  }

  @Get('qa/pendientes')
  listarPendientesQA() {
    return this.produccionService.listarPendientesQA();
  }

  @Patch('qa/aprobar')
  aprobar(@Body() dto: DecidirQADto) {
    return this.produccionService.aprobarLote(dto);
  }

  @Patch('qa/rechazar')
  rechazar(@Body() dto: DecidirQADto) {
    return this.produccionService.rechazarLote(dto);
  }

  @Patch('ordenes/:id/enviar-qa')
  enviarAQA(@Param('id', ParseUUIDPipe) id: string, @Body('cantidadObtenida') cantidadObtenida: number) {
    return this.produccionService.enviarAQA(id, cantidadObtenida);
  }

  @Get('etiquetas/cola')
  obtenerColaDespacho() {
    return this.produccionService.obtenerColaDespacho();
  }
}
