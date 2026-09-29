import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { randomUUID } from 'crypto';
import { tap } from 'rxjs/operators';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const started = Date.now();
    const requestId = randomUUID();
    response.setHeader('X-Request-Id', requestId);
    const record = (status: number) => {
      // Route templates and identities are sufficient to audit operations; no bodies or tokens.
      const attributes = { requestId, method: request.method, route: `${request.baseUrl || ''}${request.route?.path || request.path}`,
        status, durationMs: Date.now() - started, userId: String(request.user?.id || 'anonymous'), role: String(request.user?.role || '') };
      if (process.env.SENTRY_DSN) {
        if (status >= 400) Sentry.logger.warn('ERP request failed', attributes);
        else Sentry.logger.info('ERP request completed', attributes);
      }
      console.log(JSON.stringify({ event: 'erp.request', ...attributes }));
    };
    return next.handle().pipe(tap({ next: () => record(response.statusCode), error: e => record(e.getStatus?.() || 500) }));
  }
}
