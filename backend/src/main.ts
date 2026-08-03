if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://quimicorp:quimicorp_dev_password@localhost:5432/quimicorp_erp?schema=public";
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' });
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
