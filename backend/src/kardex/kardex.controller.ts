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
} from '@nestjs/common';
import { CategoriaKardex } from '@prisma/client';
import { KardexService } from './kardex.service';
import { RegistrarMovimientoDto } from './dto/registrar-movimiento.dto';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Post('movimientos')
  registrarMovimiento(@Body() dto: RegistrarMovimientoDto) {
    return this.kardexService.registrarMovimiento(dto);
  }

  @Get('movimientos')
  listarTodos(
    @Query('take', new DefaultValuePipe(100), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.kardexService.listarTodos(take, skip);
  }

  @Get('categorizado')
  listarCategorizado(
    @Query('categoria') categoria?: CategoriaKardex,
    @Query('search') search?: string,
    @Query('tipoOperacion') tipoOperacion?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('take', new DefaultValuePipe(100), ParseIntPipe) take?: number,
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

  @Get('insumo/:insumoId')
  listarPorInsumo(
    @Param('insumoId', ParseUUIDPipe) insumoId: string,
    @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.kardexService.listarPorInsumo(insumoId, take, skip);
  }
}
