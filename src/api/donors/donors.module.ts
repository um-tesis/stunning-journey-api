import { Module } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { DonorsResolver } from './donors.resolver';

@Module({
  providers: [DonorsResolver, DonorsService],
})
export class DonorsModule {}
