import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './config/config';

const { PORT } = config;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
