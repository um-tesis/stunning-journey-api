import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';

import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { Role } from '@prisma/client';

@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Mutation(() => Organization)
  createOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: CreateOrganizationInput,
  ) {
    return this.organizationsService.create(createOrganizationInput);
  }

  @Query(() => [Organization], { name: 'organizations' })
  findAll(@Args() args: PaginationArgs, @Args('filter', { nullable: true }) filter?: string) {
    return this.organizationsService.findAll(args, filter);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.ORGADMIN)
  @Query(() => Organization, { name: 'organization' })
  findOne(@Args('organizationId', { type: () => Int }) id: number) {
    return this.organizationsService.findOne(id);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.ORGADMIN)
  @Mutation(() => Organization)
  updateOrganization(
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
  ) {
    return this.organizationsService.update(updateOrganizationInput.id, updateOrganizationInput);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.ORGADMIN)
  @Mutation(() => Organization)
  removeOrganization(@Args('organizationId', { type: () => Int }) id: number) {
    return this.organizationsService.remove(id);
  }
}
