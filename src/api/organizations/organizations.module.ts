import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { OrganizationsResolver } from './organizations.resolver';
import { OrganizationsService } from './organizations.service';

@Module({
  providers: [OrganizationsResolver, OrganizationsService, PrismaService],
})
export class OrganizationsModule {}
