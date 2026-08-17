import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.DISENO_MULTIMEDIA)
  crear(@Body() dto: CrearFormulaDto) {
    return this.formulasService.crear(dto);
  }

  @Get()
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.DISENO_MULTIMEDIA, Role.VENTAS_ATENCION_DIGITAL)
  listar(@Query('search') search?: string) {
    return this.formulasService.listar(search);
  }

  @Get(':id')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.DISENO_MULTIMEDIA, Role.VENTAS_ATENCION_DIGITAL)
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulasService.obtenerPorId(id);
  }

  @Post(':id/clonar')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  clonar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    dto: {
      nuevoCodigo?: string;
      nuevoNombre: string;
      clienteId?: string;
      nombreVariante?: string;
      notas?: string;
    },
  ) {
    return this.formulasService.clonar(id, dto);
  }

  @Post(':id/variantes')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  agregarVariante(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    dto: {
      nombre: string;
      clienteId?: string;
      notas?: string;
    },
  ) {
    return this.formulasService.agregarVariante(id, dto);
  }

  @Delete('variantes/:variantId')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION)
  eliminarVariante(@Param('variantId', ParseUUIDPipe) variantId: string) {
    return this.formulasService.eliminarVariante(variantId);
  }

  @Patch(':id/activar')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  activar(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulasService.activar(id);
  }

  @Get(':id/variants')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.VENTAS_ATENCION_DIGITAL, Role.PRODUCCION_ALMACEN)
  listarVariantes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('clienteId') clienteId?: string,
  ) {
    return this.formulasService.listarVariantes(id, clienteId);
  }
}
