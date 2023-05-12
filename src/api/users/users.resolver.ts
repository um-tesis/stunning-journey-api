import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { LogInModelIn, LogInModelOut } from './dto/auth-input';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { ProjectUserPagination } from '../projects/entities/project.entity';
import { PaginationArgs } from 'src/utils/types/pagination-args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(AuthGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @Roles(Role.SYSADMIN)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Query(() => LogInModelOut, { name: 'login' })
  async login(@Args('logInModelIn') logInModelIn: LogInModelIn, @Context() context) {
    const { user, token } = await this.usersService.login(logInModelIn);
    context.req.headers.authorization = `Bearer ${token}`;
    return { user, token };
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
}
