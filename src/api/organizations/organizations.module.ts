import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';

import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';

@Module({
  providers: [OrganizationsResolver, OrganizationsService, PrismaService, UsersService],
})
export class OrganizationsModule {}
