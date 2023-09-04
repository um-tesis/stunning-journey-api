import { Module } from '@nestjs/common';

import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { BadgrService } from './badgr.service';
import { UsersService } from '../users/users.service';
import { DonationsService } from '../donations/donations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PasswordService } from '../auth/password.service';
import { BillingsService } from '../billings/billings.service';

@Module({
  providers: [
    ProjectsResolver,
    ProjectsService,
    BadgrService,
    UsersService,
    DonationsService,
    SubscriptionsService,
    PasswordService,
    BillingsService,
  ],
})
export class ProjectsModule {}
