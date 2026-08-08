import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PedidosAdminService } from './pedidos-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pedidos-admin')
export class PedidosAdminController {
  constructor(private readonly pedidosAdminService: PedidosAdminService) {}

  @Get('kpis')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL)
  obtenerKpis() {
    return this.pedidosAdminService.obtenerKpis();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING)
  listar(
    @Query('search') search?: string,
    @Query('estado') estado?: string,
    @Query('prioridad') prioridad?: string,
  ) {
    return this.pedidosAdminService.listar(search, estado, prioridad);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  crearPedido(@Body() dto: any) {
    return this.pedidosAdminService.crearPedido(dto);
  }

  @Get(':id/desglose-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL)
  obtenerDesgloseStock(@Param('id') id: string) {
    return this.pedidosAdminService.obtenerDesgloseStock(id);
  }

  @Post(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION)
  aprobarPedido(@Param('id') id: string) {
    return this.pedidosAdminService.aprobarPedido(id);
  }

  @Post(':id/devolver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION)
  devolverPedido(
    @Param('id') id: string,
    @Body('motivoDevolucion') motivoDevolucion: string,
  ) {
    return this.pedidosAdminService.devolverPedido(id, motivoDevolucion || 'Sin motivo especificado.');
  }
}
