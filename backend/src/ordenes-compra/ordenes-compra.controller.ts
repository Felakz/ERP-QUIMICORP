import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrdenesCompraService } from './ordenes-compra.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CrearOrdenCompraDto } from './dto/crear-orden-compra.dto';

@Controller('ordenes-compra')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.GERENCIA, Role.ADMINISTRACION, Role.GERENTE_ADMINISTRATIVO, Role.COMPRAS_PROVEEDORES, Role.ASISTENTE_ADMINISTRATIVO)
export class OrdenesCompraController {
  constructor(private readonly service: OrdenesCompraService) {}

  @Get()
  async listar() {
    return this.service.listar();
  }

  @Post()
  async crear(@Body() dto: CrearOrdenCompraDto) {
    return this.service.crear(dto);
  }

  @Patch(':id/recibir')
  async recibir(@Param('id') id: string) {
    return this.service.marcarRecibido(id);
  }

  @Patch(':id/anular')
  async anular(@Param('id') id: string) {
    return this.service.anular(id);
  }
}
