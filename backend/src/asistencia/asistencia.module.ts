import { Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
  exports: [AsistenciaService],
})
export class AsistenciaModule {}
