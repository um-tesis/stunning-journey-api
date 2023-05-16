import { Module } from '@nestjs/common';

import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  providers: [ContactResolver, ContactService],
})
export class ContactModule {}
