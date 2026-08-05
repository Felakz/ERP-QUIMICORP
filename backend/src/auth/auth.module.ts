import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard, PermissionsGuard],
  exports: [AuthService, RolesGuard, JwtAuthGuard, PermissionsGuard],
})
export class AuthModule {}
