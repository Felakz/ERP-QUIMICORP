import { Module } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionController } from './produccion.controller';
import { ProduccionGateway } from './produccion.gateway';
import { KardexModule } from '../kardex/kardex.module';

@Module({
  imports: [KardexModule],
  controllers: [ProduccionController],
  providers: [ProduccionService, ProduccionGateway],
  exports: [ProduccionService, ProduccionGateway],
})
export class ProduccionModule {}
