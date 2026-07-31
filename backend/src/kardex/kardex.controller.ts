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

  @Get('insumo/:insumoId')
  listarPorInsumo(
    @Param('insumoId', ParseUUIDPipe) insumoId: string,
    @Query('take', new DefaultValuePipe(50), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
  ) {
    return this.kardexService.listarPorInsumo(insumoId, take, skip);
  }
}
