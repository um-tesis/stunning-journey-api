import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { BaseSubscription, Subscription, SubscriptionPagination } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { GenericError } from '../../utils/errors';
import { ProjectsService } from '../projects/projects.service';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { CreatePreapprovalInput } from './dto/create-preapproval.input';
import { Preapproval } from './entities/preapproval.entity';
import { GqlAuthGuard } from '../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Project } from '../projects/entities/project.entity';
import { OptionalAuthGuard } from '../common/guards/optionalAuth.guard';
import { FrequencyInterval } from '@prisma/client';

@UseGuards(OptionalAuthGuard)
@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mpService: MercadoPagoService,
    private readonly projectsService: ProjectsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BaseSubscription)
  async createSubscription(@Args('createSubscriptionInput') createSubscriptionInput: CreateSubscriptionInput) {
    return this.subscriptionsService.create(createSubscriptionInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Subscription], { name: 'subscriptions' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => SubscriptionPagination, { name: 'subscriptionsByProject' })
  async findAllByProjectId(@Args('projectId', { type: () => Int }) projectId: number, @Args() args: PaginationArgs) {
    const res = await this.subscriptionsService.findAllByProjectId(projectId, args);
    return { subscriptions: res.subscriptions, total: res.total };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => SubscriptionPagination, { name: 'subscriptionsByOrganization' })
  async findAllByOrganizationId(
    @Args('organizationId', { type: () => Int }) organizationId: number,
    @Args() args: PaginationArgs,
  ) {
    const res = await this.subscriptionsService.findAllByOrganizationId(organizationId, args);
    return { subscriptions: res.subscriptions, total: res.total };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Subscription, { name: 'subscription' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subscriptionsService.findOne(id);
  }

  @Query(() => Subscription, { name: 'subscriptionByMpId', nullable: true })
  async findOneByMpId(@Args('mpSubscriptionId', { type: () => String }) mpSubscriptionId: string) {
    return this.subscriptionsService.findOneByMpId(mpSubscriptionId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Subscription)
  updateSubscription(@Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput) {
    return this.subscriptionsService.update(updateSubscriptionInput.id, updateSubscriptionInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Subscription)
  removeSubscription(@Args('id', { type: () => Int }) id: number) {
    return this.subscriptionsService.remove(id);
  }

  @Mutation(() => Preapproval)
  async createPreapproval(@Args('createPreapprovalInput') createPreapprovalInput: CreatePreapprovalInput) {
    const { amount, projectSlug, payerEmail } = createPreapprovalInput;
    const { id, mpAccessToken, name } = await this.projectsService.findOneInternalBySlug(projectSlug);

    try {
      const { body } = await this.mpService.createPreapproval(projectSlug, mpAccessToken, name, amount, payerEmail);

      await this.subscriptionsService.create({
        amount: amount * 100,
        frequency: body.auto_recurring.frequency,
        frequencyInterval: FrequencyInterval.MONTHLY,
        payerEmail,
        projectId: id,
        status: body.status,
        mpSubscriptionId: body.id,
      });

      return {
        id: body.id,
        status: body.status,
        reason: body.reason,
        externalReference: body.external_reference,
        initPoint: body.init_point,
      };
    } catch (e: any) {
      throw new GenericError(e?.message as string);
    }
  }

  @ResolveField(() => Project, { name: 'project', nullable: true })
  project(@Parent() { projectId }: Subscription) {
    return this.subscriptionsService.getProject(projectId);
  }
}
