import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/decorators/roles.decorator';
import { SystemRoleGuard } from 'src/guards/system-role.guard';
import { SYSTEM_ROLES_ID } from 'src/helpers/constants';

import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';
import { PaginationArgs } from 'src/utils/types/pagination-args';

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

  @UseGuards(SystemRoleGuard)
  @Roles(SYSTEM_ROLES_ID.ORGANIZATION_ADMIN)
  @Query(() => Organization, { name: 'organization' })
  findOne(@Args('organization_id', { type: () => Int }) id: number) {
    return this.organizationsService.findOne(id);
  }

  @UseGuards(SystemRoleGuard)
  @Roles(SYSTEM_ROLES_ID.ORGANIZATION_ADMIN)
  @Mutation(() => Organization)
  updateOrganization(
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
  ) {
    return this.organizationsService.update(updateOrganizationInput.organization_id, updateOrganizationInput);
  }

  @UseGuards(SystemRoleGuard)
  @Roles(SYSTEM_ROLES_ID.ORGANIZATION_ADMIN)
  @Mutation(() => Organization)
  removeOrganization(@Args('organization_id', { type: () => Int }) id: number) {
    return this.organizationsService.remove(id);
  }
}
