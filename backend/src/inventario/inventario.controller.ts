import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CrearInsumoDto, ActualizarInsumoDto } from './dto/crear-insumo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventario')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('insumos')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  crear(@Body() dto: CrearInsumoDto) {
    return this.inventarioService.crearInsumo(dto);
  }

  @Get('insumos')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  listar(
    @Query('search') search?: string,
    @Query('familiaId') familiaId?: string,
    @Query('tipo') tipo?: string,
    @Query('excluirSoloFormula') excluirSoloFormula?: string,
  ) {
    const excluir = excluirSoloFormula === 'true' || excluirSoloFormula === '1';
    return this.inventarioService.listar(search, familiaId, tipo, excluir);
  }

  @Get('familias')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  listarFamilias() {
    return this.inventarioService.listarFamilias();
  }

  @Post('familias')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.ASISTENTE_ADMINISTRATIVO)
  crearFamilia(@Body('nombre') nombre: string) {
    return this.inventarioService.crearFamilia(nombre);
  }

  @Patch('insumos/:id')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.ASISTENTE_ADMINISTRATIVO)
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarInsumoDto,
    @Req() req: any,
  ) {
    return this.inventarioService.actualizarInsumo(id, dto, req?.user);
  }

  @Post('insumos/:id/eliminar')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN)
  eliminar(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.eliminarInsumo(id);
  }

  @Post('insumos/:id/reponer')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  reponer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { cantidad: number; documentoReferencia?: string; usuarioId?: string },
  ) {
    return this.inventarioService.reponerStock(id, Number(body?.cantidad || 0), body?.documentoReferencia, body?.usuarioId);
  }

  @Get('insumos/:id')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.VENTAS_ATENCION_DIGITAL, Role.ECOMMERCE_MARKETING, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventarioService.obtenerPorId(id);
  }
}
