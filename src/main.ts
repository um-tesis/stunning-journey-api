import { NestFactory, Reflector } from '@nestjs/core';

import { UsersService } from './api/users/users.service';
import { AppModule } from './app.module';
import config from './config/config';
import { SystemRoleGuard } from './guards/system-role.guard';
import { PrismaService } from './prisma/prisma.service';

const { PORT } = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new SystemRoleGuard(new Reflector(), new UsersService(new PrismaService())));
  app.enableCors();
  await app.listen(PORT);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
