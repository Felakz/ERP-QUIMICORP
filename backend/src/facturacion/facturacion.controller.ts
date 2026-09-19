import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CostoOperativoPeriodoDto } from './dto/costo-operativo.dto';

@Controller('facturacion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.GERENCIA,
  Role.ADMINISTRACION,
  Role.GERENTE_ADMINISTRATIVO,
  Role.ASISTENTE_ADMINISTRATIVO,
  Role.FINANZAS,
)
export class FacturacionController {
  constructor(private readonly service: FacturacionService) {}

  @Get('resumen')
  async resumen() {
    return this.service.resumen();
  }

  @Get('rentabilidad')
  async rentabilidad(@Query('rango') rango?: string, @Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.service.rentabilidad(rango, desde, hasta);
  }

  @Get('costos-operativos/:periodo')
  async costoOperativo(@Param('periodo') periodo: string) {
    return this.service.obtenerCostoOperativo(periodo);
  }

  @Put('costos-operativos/:periodo')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO, Role.FINANZAS)
  async actualizarCostoOperativo(@Param('periodo') periodo: string, @Body() dto: CostoOperativoPeriodoDto) {
    return this.service.actualizarCostoOperativo(periodo, dto);
  }

  @Get('comprobante/:id')
  async comprobante(@Param('id') id: string) {
    return this.service.comprobante(id);
  }

  @Get()
  async listar(
    @Query('estado') estado?: string,
    @Query('proximo') proximo?: string,
    @Query('search') search?: string,
    @Query('condicion') condicion?: string,
  ) {
    return this.service.listar(estado, proximo, search, condicion);
  }
}
