import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsResolver } from './donations.resolver';
import { DonorsService } from '../donors/donors.service';
import { ProjectsService } from '../projects/projects.service';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { BadgrService } from '../projects/badgr.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../auth/password.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Module({
  providers: [
    DonationsResolver,
    DonationsService,
    DonorsService,
    ProjectsService,
    MercadoPagoService,
    BadgrService,
    UsersService,
    PasswordService,
    SubscriptionsService,
  ],
})
export class DonationsModule {}
