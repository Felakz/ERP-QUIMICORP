import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Guard para el webhook del worker de biometría.
 * El worker autentica con un token de servicio (no un JWT humano).
 * Se valida contra la variable de entorno ASISTENCIA_SERVICE_TOKEN
 * (con un valor por defecto solo para desarrollo).
 */
@Injectable()
export class ServiceTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers['x-service-token'] || req.headers['authorization'];
    const token = Array.isArray(header) ? header[0] : header;
    const expected = process.env.ASISTENCIA_SERVICE_TOKEN || 'quimicorp-dev-service-token';
    if (!token || token !== expected) {
      throw new UnauthorizedException('Token de servicio inválido');
    }
    return true;
  }
}
