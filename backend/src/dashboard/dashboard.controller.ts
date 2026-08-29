import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('administracion/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  async getStats(@Query('dateRange') dateRange?: string) {
    return this.dashboardService.getDashboardStats(dateRange || 'MES_ACTUAL');
  }

  @Get('kpis')
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  async getKpis(@Query('dateRange') dateRange?: string) {
    return this.dashboardService.getKpis(dateRange || 'MES_ACTUAL');
  }

  @Get('top-clients')
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  async getTopClients() {
    return this.dashboardService.getTopCustomers();
  }
}
