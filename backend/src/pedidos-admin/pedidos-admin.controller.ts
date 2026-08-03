import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PedidosAdminService } from './pedidos-admin.service';

@Controller('pedidos-admin')
export class PedidosAdminController {
  constructor(private readonly pedidosAdminService: PedidosAdminService) {}

  @Get('kpis')
  obtenerKpis() {
    return this.pedidosAdminService.obtenerKpis();
  }

  @Get()
  listar(
    @Query('search') search?: string,
    @Query('estado') estado?: string,
    @Query('prioridad') prioridad?: string,
  ) {
    return this.pedidosAdminService.listar(search, estado, prioridad);
  }

  @Post()
  crearPedido(@Body() dto: any) {
    return this.pedidosAdminService.crearPedido(dto);
  }

  @Get(':id/desglose-stock')
  obtenerDesgloseStock(@Param('id') id: string) {
    return this.pedidosAdminService.obtenerDesgloseStock(id);
  }

  @Post(':id/aprobar')
  aprobarPedido(@Param('id') id: string) {
    return this.pedidosAdminService.aprobarPedido(id);
  }

  @Post(':id/devolver')
  devolverPedido(
    @Param('id') id: string,
    @Body('motivoDevolucion') motivoDevolucion: string,
  ) {
    return this.pedidosAdminService.devolverPedido(id, motivoDevolucion || 'Sin motivo especificado.');
  }
}
