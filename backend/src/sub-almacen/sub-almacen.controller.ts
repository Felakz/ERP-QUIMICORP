import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { SubAlmacenService } from './sub-almacen.service';

@Controller('sub-almacen')
export class SubAlmacenController {
  constructor(private readonly subAlmacenService: SubAlmacenService) {}

  @Get('disponibles')
  listarDisponibles() {
    return this.subAlmacenService.listarDisponibles();
  }

  @Patch(':id/reusar')
  marcarReusado(@Param('id', ParseUUIDPipe) id: string) {
    return this.subAlmacenService.marcarReusado(id);
  }

  @Post()
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
