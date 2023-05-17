import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';
import { PasswordService } from '../auth/password.service';

@Module({
  providers: [OrganizationsResolver, OrganizationsService, UsersService, PasswordService],
})
export class OrganizationsModule {}
