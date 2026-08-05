import { Module } from '@nestjs/common';
import { SubAlmacenService } from './sub-almacen.service';
import { SubAlmacenController } from './sub-almacen.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SubAlmacenController],
  providers: [SubAlmacenService],
})
export class SubAlmacenModule {}
