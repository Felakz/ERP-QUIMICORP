import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { CrearFormulaDto } from './dto/crear-formula.dto';

@Controller('formulas')
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Post()
  crear(@Body() dto: CrearFormulaDto) {
    return this.formulasService.crear(dto);
  }

  @Get()
  listar() {
    return this.formulasService.listar();
  }

  @Patch(':id/activar')
  activar(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulasService.activar(id);
  }
}
