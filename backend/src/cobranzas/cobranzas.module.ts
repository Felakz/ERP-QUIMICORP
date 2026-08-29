import { Module } from '@nestjs/common';
import { CobranzasController } from './cobranzas.controller';
import { CobranzasService } from './cobranzas.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CobranzasController],
  providers: [CobranzasService],
  exports: [CobranzasService],
})
export class CobranzasModule {}
