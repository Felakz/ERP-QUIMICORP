import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { CobranzasService } from './cobranzas.service';
import { RegistrarAbonoDto } from './dto/registrar-abono.dto';
import { CrearCuentaCobrarDto } from './dto/crear-cuenta-cobrar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('cobranzas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  Role.GERENCIA,
  Role.ADMINISTRACION,
  Role.GERENTE_ADMINISTRATIVO,
  Role.ASISTENTE_ADMINISTRATIVO,
  Role.FINANZAS
)
export class CobranzasController {
  constructor(private readonly service: CobranzasService) {}

  @Get()
  async listar(
    @Query('estado') estado?: string,
    @Query('condicion') condicion?: string,
    @Query('ruc') ruc?: string,
    @Query('search') search?: string,
  ) {
    return this.service.listar(estado, condicion, ruc, search);
  }

  @Get('kpis')
  async obtenerKpis() {
    return this.service.obtenerKpis();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Post(':id/abonos')
  async registrarAbono(
    @Param('id') id: string,
    @Body() dto: RegistrarAbonoDto,
  ) {
    return this.service.registrarAbono(id, dto);
  }

  @Post()
  async crear(@Body() dto: CrearCuentaCobrarDto) {
    return this.service.crear(dto);
  }
}
