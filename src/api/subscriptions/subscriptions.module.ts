import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { DonorsService } from '../donors/donors.service';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { ProjectsService } from '../projects/projects.service';
import { BadgrService } from '../projects/badgr.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../auth/password.service';
import { DonationsService } from '../donations/donations.service';

@Module({
  providers: [
    SubscriptionsResolver,
    SubscriptionsService,
    DonorsService,
    MercadoPagoService,
    ProjectsService,
    BadgrService,
    UsersService,
    PasswordService,
    DonationsService,
  ],
})
export class SubscriptionsModule {}
