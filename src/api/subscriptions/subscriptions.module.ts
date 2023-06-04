import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { DonorsService } from '../donors/donors.service';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { ProjectsService } from '../projects/projects.service';

@Module({
  providers: [SubscriptionsResolver, SubscriptionsService, DonorsService, MercadoPagoService, ProjectsService],
})
export class SubscriptionsModule {}
