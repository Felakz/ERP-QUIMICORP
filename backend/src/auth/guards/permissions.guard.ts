import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      throw new ForbiddenException('Acceso denegado: Usuario no posee permisos configurados');
    }

    const hasPermission = requiredPermissions.every((perm) => user.permissions.includes(perm));
    if (!hasPermission) {
      throw new ForbiddenException(`Acceso denegado: Permisos insuficientes (${requiredPermissions.join(', ')})`);
    }

    return true;
  }
}
