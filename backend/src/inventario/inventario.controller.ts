import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CrearInsumoDto } from './dto/crear-insumo.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('insumos')
  crear(@Body() dto: CrearInsumoDto) {
    return this.inventarioService.crearInsumo(dto);
  }

  @Get('insumos')
  listar(@Query('search') search?: string, @Query('familiaId') familiaId?: string) {
    return this.inventarioService.listar(search, familiaId);
  }

  @Get('familias')
  listarFamilias() {
    return this.inventarioService.listarFamilias();
  }

  @Get('insumos/:id')
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.obtenerPorId(id);
  }
}
