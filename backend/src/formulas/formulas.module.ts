import { Module } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';

@Module({
  controllers: [FormulasController],
  providers: [FormulasService],
})
export class FormulasModule {}
