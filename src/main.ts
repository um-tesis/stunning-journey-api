import { NestFactory, Reflector } from '@nestjs/core';

import { UsersService } from './api/users/users.service';
import { AppModule } from './app.module';
import config from './api/config';
import { RoleGuard } from './api/common/guards/role.guard';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

const { PORT } = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Cors
  app.enableCors();

  app.useGlobalGuards(new RoleGuard(new Reflector(), new UsersService(new PrismaService())));
  await app.listen(PORT || 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
