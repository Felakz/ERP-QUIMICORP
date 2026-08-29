import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

export interface CreateClienteDto {
  razonSocial: string;
  ruc: string;
  telefono?: string;
  direccion?: string;
  contacto?: string;
  metodoEnvio?: string;
  condicionPago?: string;
  contactos?: { nombre: string; cargo?: string; telefono?: string; esPrincipal?: boolean }[];
}

export interface UpdateClienteDto {
  razonSocial?: string;
  ruc?: string;
  telefono?: string;
  direccion?: string;
  contacto?: string;
  metodoEnvio?: string;
  condicionPago?: string;
  estado?: string;
  contactos?: { nombre: string; cargo?: string; telefono?: string; esPrincipal?: boolean }[];
}

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  findAll(@Query('search') search?: string, @Query('ruc') ruc?: string) {
    return this.clientesService.findAll(search || ruc);
  }

  @Get(':id')
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Post()
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Put(':id')
  @Roles(
    Role.GERENCIA,
    Role.ADMINISTRACION,
    Role.GERENTE_ADMINISTRATIVO,
    Role.ASISTENTE_ADMINISTRATIVO,
    Role.FINANZAS,
    Role.VENTAS_ATENCION_DIGITAL,
  )
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }
}
