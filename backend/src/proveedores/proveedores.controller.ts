import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('proveedores')
@UseGuards(JwtAuthGuard)
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Get()
  async listar() {
    return this.proveedoresService.listar();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.proveedoresService.buscarPorId(id);
  }

  @Post()
  async crear(@Body() dto: CrearProveedorDto) {
    return this.proveedoresService.crear(dto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.proveedoresService.eliminar(id);
  }
}
