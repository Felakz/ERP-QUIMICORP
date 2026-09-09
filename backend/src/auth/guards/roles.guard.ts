import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY, ROLES_EXCLUDED_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Acceso denegado: Usuario no autenticado');
    }

    // Exclusión explícita de roles para endpoints sensibles (p.ej. emisión de comprobantes)
    const excludedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_EXCLUDED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (excludedRoles?.includes(user.role as Role)) {
      throw new ForbiddenException(`Acceso denegado: El rol ${user.role} está excluido de esta ruta`);
    }

    // Mapeo jerárquico de permisos de administración
    let userEffectiveRoles: Role[] = [user.role];
    if (user.role === Role.GERENTE_ADMINISTRATIVO) {
      userEffectiveRoles.push(Role.ADMINISTRACION, Role.GERENCIA);
    } else if (user.role === Role.ASISTENTE_ADMINISTRATIVO) {
      userEffectiveRoles.push(Role.ADMINISTRACION);
    }

    const hasRole = requiredRoles.some((r) => userEffectiveRoles.includes(r));
    if (!hasRole) {
      throw new ForbiddenException(`Acceso denegado: El rol ${user.role} no tiene permisos para esta ruta`);
    }

    return true;
  }
}
