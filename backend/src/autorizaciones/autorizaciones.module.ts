import { Module } from '@nestjs/common';
import { AutorizacionesController } from './autorizaciones.controller';
import { AutorizacionesService } from './autorizaciones.service';

@Module({
  controllers: [AutorizacionesController],
  providers: [AutorizacionesService],
  exports: [AutorizacionesService],
})
export class AutorizacionesModule {}
