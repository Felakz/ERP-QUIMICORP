import { Module } from '@nestjs/common';
import { PedidosAdminController } from './pedidos-admin.controller';
import { PedidosAdminService } from './pedidos-admin.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { ProduccionGateway } from '../produccion/produccion.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [PedidosAdminController],
  providers: [PedidosAdminService, ProduccionGateway],
  exports: [PedidosAdminService],
})
export class PedidosAdminModule {}
