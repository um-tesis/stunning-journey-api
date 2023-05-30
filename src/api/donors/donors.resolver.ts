import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DonorsService } from './donors.service';
import { Donor } from './entities/donor.entity';
import { CreateDonorInput } from './dto/create-donor.input';
import { UpdateDonorInput } from './dto/update-donor.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/auth.guard';
import RoleGuard from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@UseGuards(GqlAuthGuard, RoleGuard(Role.ORGADMIN))
@Resolver(() => Donor)
export class DonorsResolver {
  constructor(private readonly donorsService: DonorsService) {}

  /****************************************************
   *** QUERIES
   ****************************************************/

  @Query(() => Donor, { name: 'donor', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.donorsService.findOne(id);
  }

  /****************************************************
   *** MUTATIONS
   ****************************************************/

  @Mutation(() => Donor)
  createDonor(@Args('createDonorInput') createDonorInput: CreateDonorInput) {
    return this.donorsService.create(createDonorInput);
  }

  @Mutation(() => Donor)
  updateDonor(@Args('updateDonorInput') updateDonorInput: UpdateDonorInput) {
    return this.donorsService.update(updateDonorInput.id, updateDonorInput);
  }

  @Mutation(() => Donor)
  removeDonor(@Args('id', { type: () => Int }) id: number) {
    return this.donorsService.remove(id);
  }

  /****************************************************
   *** RESOLVERS
   ****************************************************/
}
