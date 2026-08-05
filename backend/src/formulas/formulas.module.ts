import { Module } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FormulasController],
  providers: [FormulasService],
})
export class FormulasModule {}
