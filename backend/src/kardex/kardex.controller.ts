import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriaKardex, Role } from '@prisma/client';
import { KardexService } from './kardex.service';
import { RegistrarMovimientoDto } from './dto/registrar-movimiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('kardex')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Post('movimientos')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
  registrarMovimiento(@Body() dto: RegistrarMovimientoDto) {
    return this.kardexService.registrarMovimiento(dto);
  }

  @Get('movimientos')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ARCHIVO_HISTORICO, Role.ASISTENTE_ADMINISTRATIVO)
  listarTodos(
    @Query('take', new DefaultValuePipe(100), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.kardexService.listarTodos(take, skip);
  }

  @Get('categorizado')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ARCHIVO_HISTORICO, Role.ASISTENTE_ADMINISTRATIVO)
  listarCategorizado(
    @Query('categoria') categoria?: CategoriaKardex,
    @Query('search') search?: string,
    @Query('tipoOperacion') tipoOperacion?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('take', new DefaultValuePipe(200), ParseIntPipe) take?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.kardexService.listarCategorizado({
      categoria,
      search,
      tipoOperacion,
      desde,
      hasta,
      take,
      skip,
    });
  }

  @Get('agrupado')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ARCHIVO_HISTORICO, Role.ASISTENTE_ADMINISTRATIVO)
  listarAgrupado(
    @Query('categoria') categoria?: CategoriaKardex,
    @Query('search') search?: string,
    @Query('tipoOperacion') tipoOperacion?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.kardexService.listarAgrupado({
      categoria,
      search,
      tipoOperacion,
      desde,
      hasta,
    });
  }

  @Get('insumo/:insumoId')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.FINANZAS, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.ARCHIVO_HISTORICO, Role.ASISTENTE_ADMINISTRATIVO)
  listarPorInsumo(
    @Param('insumoId', ParseUUIDPipe) insumoId: string,
    @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.kardexService.listarPorInsumo(insumoId, take, skip);
  }

  @Get('bom')
  @Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.PRODUCCION_ALMACEN, Role.COMPRAS_PROVEEDORES, Role.DISENO_MULTIMEDIA, Role.ASISTENTE_ADMINISTRATIVO)
  obtenerBom(@Query('nombre') nombre: string) {
    return this.kardexService.obtenerBomProducto(nombre);
  }
}
