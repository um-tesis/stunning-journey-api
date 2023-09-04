import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { ProjectsService } from '../projects/projects.service';
import { BadgrService } from '../projects/badgr.service';
import { DonationsService } from '../donations/donations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../auth/password.service';
import { DonorsService } from '../donors/donors.service';
import { BillingsService } from '../billings/billings.service';

@Module({
  controllers: [WebhooksController],
  providers: [
    WebhooksService,
    BadgrService,
    MercadoPagoService,
    ProjectsService,
    DonationsService,
    DonorsService,
    SubscriptionsService,
    UsersService,
    PasswordService,
    BillingsService,
  ],
})
export class WebhooksModule {}
