import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { BillingsService } from './billings.service';
import { Billing } from './entities/billing.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/auth.guard';
import RoleGuard from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@UseGuards(GqlAuthGuard, RoleGuard(Role.ORGADMIN))
@Resolver(() => Billing)
export class BillingsResolver {
  constructor(private readonly billingsService: BillingsService) {}

  @Query(() => [Billing], { name: 'billingsByProjectId' })
  findAllByProjectId(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.billingsService.findAllByProjectId(projectId);
  }

  @Query(() => Billing, { name: 'billing' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.billingsService.findOne(id);
  }
}
