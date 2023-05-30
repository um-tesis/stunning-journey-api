import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { DonorsService } from '../donors/donors.service';

@Module({
  providers: [SubscriptionsResolver, SubscriptionsService, DonorsService],
})
export class SubscriptionsModule {}
