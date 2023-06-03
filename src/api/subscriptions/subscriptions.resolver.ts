import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { BaseSubscription, Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { CreateDonorInput } from '../donors/dto/create-donor.input';
import { DonorsService } from '../donors/donors.service';
import { Donor } from '../donors/entities/donor.entity';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly donorsService: DonorsService,
  ) {}

  @Mutation(() => BaseSubscription)
  async createDonation(
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

  @ResolveField()
  donor(@Parent() { donorId }: Subscription) {
    return this.donorsService.findOne(donorId);
  }

  @ResolveField()
  project(@Parent() { projectId }: Subscription) {
    return this.subscriptionsService.getProject(projectId);
  }
}
