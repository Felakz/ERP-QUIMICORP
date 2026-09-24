import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (process.env.SENTRY_DSN && status >= 500) {
      Sentry.withScope((scope) => {
        if (request?.user) {
          scope.setUser({
            id: request.user.id || request.user.sub,
            email: request.user.email,
            role: request.user.role,
          });
        }
        scope.setExtra('url', request.url);
        scope.setExtra('method', request.method);
        scope.setExtra('body', request.body);
        scope.setExtra('query', request.query);
        scope.setExtra('ip', request.ip || request.headers?.['x-forwarded-for']);
        Sentry.captureException(exception);
      });
    }

    const resBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode: status, message: exception?.message || 'Error interno del servidor' };

    response.status(status).json(
      typeof resBody === 'object' ? resBody : { statusCode: status, message: resBody },
    );
  }
}
