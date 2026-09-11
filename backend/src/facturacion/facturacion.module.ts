import { Module } from '@nestjs/common';
import { FacturacionController } from './facturacion.controller';
import { FacturacionService } from './facturacion.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FacturacionController],
  providers: [FacturacionService],
  exports: [FacturacionService],
})
export class FacturacionModule {}