import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { BillingsService } from './billings.service';
import { Billing } from './entities/billing.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/auth.guard';
import RoleGuard from '../common/guards/role.guard';
import { BillingStatus, Role } from '@prisma/client';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../common/decorators';

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

  @Query(() => Billing, { name: 'unpaidBillingByProjectId' })
  findOneUnpaidByProjectId(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.billingsService.findOneUnpaidByProjectId(projectId);
  }

  @Mutation(() => Billing)
  payBilling(@UserEntity() user: User, @Args('projectId', { type: () => Int }) projectId: number) {
    return this.billingsService.update(projectId, {
      paidBy: user.id,
      paidAt: new Date(),
      status: BillingStatus.PAID,
    });
  }
}
