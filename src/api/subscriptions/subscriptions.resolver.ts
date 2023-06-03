import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { BaseSubscription, Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { CreateDonorInput } from '../donors/dto/create-donor.input';
import { DonorsService } from '../donors/donors.service';
import { Donor } from '../donors/entities/donor.entity';
import { GenericError } from '../../utils/errors';
import { ProjectsService } from '../projects/projects.service';
import { MercadoPagoService } from '../common/services/mercadopago.service';
import { CreatePreapprovalInput } from './dto/create-preapproval.input';
import { Preapproval } from './entities/preapproval.entity';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly donorsService: DonorsService,
    private readonly mpService: MercadoPagoService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Mutation(() => BaseSubscription)
  async createSubscription(
    @Args('createSubscriptionInput') createSubscriptionInput: CreateSubscriptionInput,
    @Args('createDonorInput') createDonorInput: CreateDonorInput,
  ) {
    const donor: Donor = await this.donorsService.create(createDonorInput);

    return this.subscriptionsService.create(createSubscriptionInput, donor.id);
  }

  @Query(() => [Subscription], { name: 'subscriptions' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Query(() => Subscription, { name: 'subscription' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subscriptionsService.findOne(id);
  }

  @Mutation(() => Subscription)
  updateSubscription(@Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput) {
    return this.subscriptionsService.update(updateSubscriptionInput.id, updateSubscriptionInput);
  }

  @Mutation(() => Subscription)
  removeSubscription(@Args('id', { type: () => Int }) id: number) {
    return this.subscriptionsService.remove(id);
  }

  @Mutation(() => Preapproval)
  async createPreapproval(@Args('createPreapprovalInput') createPreapprovalInput: CreatePreapprovalInput) {
    const { amount, projectId, payerEmail } = createPreapprovalInput;
    const { mpAccessToken, name } = await this.projectsService.findOneInternal(projectId);
    const subscriptionName = `Suscripción a: ${name}`;

    try {
      const response = await this.mpService.createPreapproval(
        projectId,
        mpAccessToken,
        subscriptionName,
        amount,
        payerEmail,
      );

      const { body } = response;

      return {
        id: body.id,
        status: body.status,
        reason: body.reason,
        initPoint: body.init_point,
      };
    } catch (e: any) {
      throw new GenericError(e?.message as string);
    }
  }

  @ResolveField()
  donor(@Parent() { donorId }: Subscription) {
    return this.donorsService.findOne(donorId);
  }

  @ResolveField()
  project(@Parent() { projectId }: Subscription) {
    return this.subscriptionsService.getProject(projectId);
  }
}
