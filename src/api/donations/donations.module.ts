import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsResolver } from './donations.resolver';
import { DonorsService } from '../donors/donors.service';

@Module({
  providers: [DonationsResolver, DonationsService, DonorsService],
})
export class DonationsModule {}
