import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './api/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PrismaClientExceptionFilter } from './utils/prisma/client-exception.filter';

const { PORT } = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  // Global Prefix
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'graphql', method: RequestMethod.ALL }],
  });

  // Cors
  app.enableCors();

  await app.listen(PORT || 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
