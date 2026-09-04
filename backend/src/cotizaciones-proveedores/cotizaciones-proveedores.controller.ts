import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CotizacionesProveedoresService } from './cotizaciones-proveedores.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cotizaciones-proveedores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.COMPRAS_PROVEEDORES)
export class CotizacionesProveedoresController {
  constructor(private readonly service: CotizacionesProveedoresService) {}

  @Get()
  async listar(
    @Query('insumoId') insumoId?: string,
    @Query('proveedorId') proveedorId?: string,
  ) {
    return this.service.listar(insumoId, proveedorId);
  }

  @Get('comparativa/:insumoId')
  async obtenerComparativa(@Param('insumoId') insumoId: string) {
    return this.service.obtenerComparativaPorInsumo(insumoId);
  }

  @Post()
  async crear(@Body() dto: CrearCotizacionDto) {
    return this.service.crear(dto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
