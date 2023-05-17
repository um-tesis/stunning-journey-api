import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { UserEntity } from '../common/decorators';
import RoleGuard from '../common/guards/role.guard';
import { GqlAuthGuard } from '../common/guards/auth.guard';
import { ChangePasswordInput } from './dto/change-password.input';
import { ProjectUserPagination } from '../projects/entities/project.entity';
import { PaginationArgs } from 'src/utils/types/pagination-args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /****************************************************
   *** QUERIES
   ****************************************************/

  // eslint-disable-next-line @typescript-eslint/require-await
  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(RoleGuard(Role.SYSADMIN))
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlAuthGuard, RoleGuard(Role.ORGADMIN, Role.SYSADMIN))
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Query(() => [User], { name: 'usersByOrganizationId' })
  findAllByOrganizationId(@Args('organizationId', { type: () => Int }) organizationId: number) {
    return this.usersService.findAllByOrganizationId(organizationId);
  }

  @Query(() => ProjectUserPagination, { name: 'volunteersByProjectId' })
  async findAllByProjectId(@Args('projectId', { type: () => Int }) projectId: number, @Args() args: PaginationArgs) {
    const res = await this.usersService.findAllByProjectId(projectId, args);
    return { volunteers: res.volunteers, total: res.total };
  }

  /****************************************************
   *** MUTATIONS
   ****************************************************/

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(@UserEntity() user: User, @Args('data') changePassword: ChangePasswordInput) {
    return this.usersService.changePassword(user.id, user.password, changePassword);
  }

  @UseGuards(RoleGuard(Role.ORGADMIN))
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  /****************************************************
   *** RESOLVERS
   ****************************************************/
}
