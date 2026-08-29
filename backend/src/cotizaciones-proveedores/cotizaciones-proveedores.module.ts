import { Module } from '@nestjs/common';
import { CotizacionesProveedoresController } from './cotizaciones-proveedores.controller';
import { CotizacionesProveedoresService } from './cotizaciones-proveedores.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CotizacionesProveedoresController],
  providers: [CotizacionesProveedoresService],
  exports: [CotizacionesProveedoresService],
})
export class CotizacionesProveedoresModule {}
