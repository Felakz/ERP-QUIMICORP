import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CrearInsumoDto } from './dto/crear-insumo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventario')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('insumos')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES)
  crear(@Body() dto: CrearInsumoDto) {
    return this.inventarioService.crearInsumo(dto);
  }

  @Get('insumos')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES)
  listar(@Query('search') search?: string, @Query('familiaId') familiaId?: string) {
    return this.inventarioService.listar(search, familiaId);
  }

  @Get('familias')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES)
  listarFamilias() {
    return this.inventarioService.listarFamilias();
  }

  @Get('insumos/:id')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES)
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.obtenerPorId(id);
  }
}
