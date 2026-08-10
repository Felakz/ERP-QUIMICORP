import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { KardexModule } from './kardex/kardex.module';
import { InventarioModule } from './inventario/inventario.module';
import { ProduccionModule } from './produccion/produccion.module';
import { FormulasModule } from './formulas/formulas.module';
import { SubAlmacenModule } from './sub-almacen/sub-almacen.module';
import { PedidosAdminModule } from './pedidos-admin/pedidos-admin.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [
    // Rate-limiting básico (Sprint 1); en Sprint 5 se respalda con Upstash Redis
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    PrismaModule,
    AuthModule,
    KardexModule,
    InventarioModule,
    ProduccionModule,
    FormulasModule,
    SubAlmacenModule,
    PedidosAdminModule,
    ClientesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
