import { Module } from '@nestjs/common';
import { SubAlmacenService } from './sub-almacen.service';
import { SubAlmacenController } from './sub-almacen.controller';

@Module({
  controllers: [SubAlmacenController],
  providers: [SubAlmacenService],
})
export class SubAlmacenModule {}
