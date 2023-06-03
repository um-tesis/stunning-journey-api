import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { DonationsService } from './donations.service';
import { BaseDonation, Donation } from './entities/donation.entity';
import { CreateDonationInput } from './dto/create-donation.input';
import { CreateDonorInput } from '../donors/dto/create-donor.input';
import { DonorsService } from '../donors/donors.service';
import { Donor } from '../donors/entities/donor.entity';

@Resolver(() => Donation)
export class DonationsResolver {
  constructor(private readonly donationsService: DonationsService, private readonly donorsService: DonorsService) {}

  @Query(() => [Donation], { name: 'donations' })
  findAllByProjectId(@Args('projectId', { type: () => Int }) projectId: number) {
    return this.donationsService.findAllByProjectId(projectId);
  }

  @Query(() => Donation, { name: 'donation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.donationsService.findOne(id);
  }

  @Mutation(() => BaseDonation)
  async createDonation(
    @Args('createDonationInput') createDonationInput: CreateDonationInput,
    @Args('createDonorInput') createDonorInput: CreateDonorInput,
  ) {
    const donor: Donor = await this.donorsService.create(createDonorInput);

    return this.donationsService.create(createDonationInput, donor.id);
  }

  @ResolveField()
  donor(@Parent() { donorId }: Donation) {
    return this.donorsService.findOne(donorId);
  }

  @ResolveField()
  project(@Parent() { projectId }: Donation) {
    return this.donationsService.getProject(projectId);
  }
}
