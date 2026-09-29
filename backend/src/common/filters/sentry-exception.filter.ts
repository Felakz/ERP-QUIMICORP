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
            role: request.user.role,
          });
        }
        scope.setExtra('route', request.route?.path || request.path);
        scope.setExtra('method', request.method);
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
