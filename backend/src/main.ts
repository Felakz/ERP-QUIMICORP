import './instrument';
import { MonitoringInterceptor } from './common/monitoring.interceptor';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL es obligatorio para iniciar el backend.');
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.SENTRY_DSN) {
    app.useGlobalFilters(new SentryExceptionFilter());
  }

  app.useGlobalInterceptors(new MonitoringInterceptor());
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,Cache-Control,X-Requested-With,sentry-trace,baggage',
    exposedHeaders: 'X-Request-Id',
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 QUIMICORP ERP Backend corriendo en http://localhost:${port}/api/v1`);
}
bootstrap();
