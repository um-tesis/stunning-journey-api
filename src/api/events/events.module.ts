import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';

@Module({
  providers: [EventsResolver, EventsService, PrismaService],
})
export class EventsModule {}
