import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { CrearFormulaDto } from './dto/crear-formula.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('formulas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Post()
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN, Role.DISENO_MULTIMEDIA)
  crear(@Body() dto: CrearFormulaDto) {
    return this.formulasService.crear(dto);
  }

  @Get()
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.DISENO_MULTIMEDIA)
  listar() {
    return this.formulasService.listar();
  }

  @Patch(':id/activar')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN)
  activar(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulasService.activar(id);
  }
}
