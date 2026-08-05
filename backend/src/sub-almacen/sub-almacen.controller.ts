import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { SubAlmacenService } from './sub-almacen.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('sub-almacen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubAlmacenController {
  constructor(private readonly subAlmacenService: SubAlmacenService) {}

  @Get('disponibles')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN)
  listarDisponibles() {
    return this.subAlmacenService.listarDisponibles();
  }

  @Patch(':id/reusar')
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN)
  marcarReusado(@Param('id', ParseUUIDPipe) id: string) {
    return this.subAlmacenService.marcarReusado(id);
  }

  @Post()
  @Roles(Role.GERENCIA, Role.PRODUCCION_ALMACEN)
  registrar(
    @Body()
    body: {
      loteOrigenId: string;
      insumoSubproductoId: string;
      pesoDisponible: number;
      ubicacion: string;
    },
  ) {
    return this.subAlmacenService.registrarSobrante(body);
  }
}
