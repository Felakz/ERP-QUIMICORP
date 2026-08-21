import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
    Role.PRODUCCION_ALMACEN,
  )
  findAll(@Query('search') search?: string, @Query('ruc') ruc?: string) {
    return this.clientesService.findAll(search || ruc);
  }

  @Post()
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  create(
    @Body()
    dto: {
      razonSocial: string;
      ruc: string;
      telefono?: string;
      direccion?: string;
      contacto?: string;
      metodoEnvio?: string;
      condicionPago?: string;
      contactos?: { nombre: string; cargo?: string; telefono?: string; esPrincipal?: boolean }[];
    },
  ) {
    return this.clientesService.create(dto);
  }
}
