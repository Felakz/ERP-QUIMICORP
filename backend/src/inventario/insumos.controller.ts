import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('insumos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsumosController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES)
  listar(
    @Query('search') search?: string,
    @Query('familiaId') familiaId?: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.inventarioService.listar(search, familiaId, tipo);
  }

  @Get(':id')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES)
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.obtenerPorId(id);
  }
}
