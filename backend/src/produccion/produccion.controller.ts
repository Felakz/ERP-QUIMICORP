import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import {
  CrearOrdenDto,
  DecidirQADto,
  RegistrarAjusteFinoDto,
  ValidarStockDto,
} from './dto/crear-orden.dto';

@Controller('produccion')
export class ProduccionController {
  constructor(private readonly produccionService: ProduccionService) {}

  // Endpoint clave: validación PREVIA de stock antes de iniciar producción
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
}
