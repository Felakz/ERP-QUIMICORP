import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardInventarioService } from './dashboard-inventario.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventario/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardInventarioController {
  constructor(
    private readonly dashboardService: DashboardInventarioService,
  ) {}

  @Get('resumen')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerResumen() {
    return this.dashboardService.obtenerResumen();
  }

  @Get('stock-critico')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerStockCritico() {
    return this.dashboardService.obtenerStockCritico();
  }

  @Get('distribucion-familias')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerDistribucionFamilias() {
    return this.dashboardService.obtenerDistribucionFamilias();
  }

  @Get('top-valorizados')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerTopValorizados() {
    return this.dashboardService.obtenerTopValorizados();
  }

  @Get('tendencia-movimientos')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerTendenciaMovimientos() {
    return this.dashboardService.obtenerTendenciaMovimientos();
  }

  @Get('lista-completa')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerListaCompleta() {
    return this.dashboardService.obtenerListaCompleta();
  }
}
