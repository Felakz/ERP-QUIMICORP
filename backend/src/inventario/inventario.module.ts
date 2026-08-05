import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { DashboardInventarioController } from './dashboard-inventario.controller';
import { DashboardInventarioService } from './dashboard-inventario.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InventarioController, DashboardInventarioController],
  providers: [InventarioService, DashboardInventarioService],
  exports: [InventarioService, DashboardInventarioService],
})
export class InventarioModule {}
