import { Controller, Get } from '@nestjs/common';
import { DashboardInventarioService } from './dashboard-inventario.service';

@Controller('inventario/dashboard')
export class DashboardInventarioController {
  constructor(
    private readonly dashboardService: DashboardInventarioService,
  ) {}

  @Get('resumen')
  obtenerResumen() {
    return this.dashboardService.obtenerResumen();
  }

  @Get('stock-critico')
  obtenerStockCritico() {
    return this.dashboardService.obtenerStockCritico();
  }

  @Get('distribucion-familias')
  obtenerDistribucionFamilias() {
    return this.dashboardService.obtenerDistribucionFamilias();
  }

  @Get('top-valorizados')
  obtenerTopValorizados() {
    return this.dashboardService.obtenerTopValorizados();
  }

  @Get('tendencia-movimientos')
  obtenerTendenciaMovimientos() {
    return this.dashboardService.obtenerTendenciaMovimientos();
  }
}
