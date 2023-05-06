import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  providers: [ContactResolver, ContactService, PrismaService],
})
export class ContactModule {}
