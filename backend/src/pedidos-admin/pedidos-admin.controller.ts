import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PedidosAdminService } from './pedidos-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, RolesExcluded } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pedidos-admin')
export class PedidosAdminController {
  constructor(private readonly pedidosAdminService: PedidosAdminService) {}

  @Get('kpis')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  obtenerKpis(@Query('fecha') fecha?: string) {
    return this.pedidosAdminService.obtenerKpis(fecha);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN)
  listar(
    @Query('search') search?: string,
    @Query('estado') estado?: string,
    @Query('prioridad') prioridad?: string,
    @Query('docType') docType?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.pedidosAdminService.listar(search, estado, prioridad, docType, fecha);
  }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  crearPedido(@Body() dto: any) {
    return this.pedidosAdminService.crearPedido(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  actualizarPedido(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.pedidosAdminService.actualizarPedido(id, dto);
  }

  @Get(':id/desglose-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  obtenerDesgloseStock(@Param('id') id: string) {
    return this.pedidosAdminService.obtenerDesgloseStock(id);
  }

  @Post(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.PRODUCCION_ALMACEN)
  aprobarPedido(@Param('id') id: string) {
    return this.pedidosAdminService.aprobarPedido(id);
  }

  @Post(':id/devolver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.PRODUCCION_ALMACEN)
  devolverPedido(
    @Param('id') id: string,
    @Body('motivoDevolucion') motivoDevolucion: string,
  ) {
    return this.pedidosAdminService.devolverPedido(id, motivoDevolucion || 'Sin motivo especificado.');
  }

  @Post(':id/convertir-a-pedido')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  convertirCotizacionAPedido(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.pedidosAdminService.convertirCotizacionAPedido(id, dto);
  }

  @Post(':id/emitir-comprobante')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL)
  @RolesExcluded(Role.ASISTENTE_ADMINISTRATIVO)
  emitirComprobante(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.pedidosAdminService.emitirComprobante(id, dto);
  }

  @Get('comparativa-ciclo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL)
  @RolesExcluded(Role.ASISTENTE_ADMINISTRATIVO)
  comparativaCiclo(@Query('periodo') periodo?: string) {
    return this.pedidosAdminService.comparativaCiclo(periodo);
  }

  @Post('limpiar-datos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GERENCIA)
  limpiarDatos() {
    throw new Error('Endpoint deshabilitado. Use scripts de migración para gestión de datos.');
  }
}

