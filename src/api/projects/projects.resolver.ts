import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project, ProjectsPagination } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { PopulatedProjectUser, ProjectUser } from './entities/project-user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { UserEntity } from '../common/decorators';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { OptionalAuthGuard } from '../common/guards/optionalAuth.guard';

@UseGuards(OptionalAuthGuard)
@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  /****************************************************
   *** QUERIES
   ****************************************************/

  @Query(() => ProjectsPagination, { name: 'projects' })
  async findAll(@Args() args: PaginationArgs) {
    const res = await this.projectsService.findAll(args);
    return { projects: res.projects, total: res.total };
  }

  @Query(() => Project, { name: 'project', nullable: true })
  findOne(@UserEntity() user: User, @Args('id', { type: () => Int }) id: number) {
    return this.projectsService.findOne(id, user);
  }

  @Query(() => ProjectsPagination, { name: 'organizationProjects' })
  async findOrganizationProjects(
    @Args('organizationId', { type: () => Int }) id: number,
    @Args() args: PaginationArgs,
  ) {
    const res = await this.projectsService.findOrganizationProjects(id, args);
    return { projects: res.projects, total: res.total };
  }

  @Query(() => PopulatedProjectUser, { name: 'projectUsers' })
  async findProjectUsers(@Args('projectId', { type: () => Int }) id: number) {
    return await this.projectsService.findProjectUsers(id);
  }

  /****************************************************
   *** MUTATIONS
   ****************************************************/

  @Mutation(() => Project)
  createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    return this.projectsService.create(createProjectInput);
  }

  @Mutation(() => Project)
  updateProject(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
    return this.projectsService.update(updateProjectInput.id, updateProjectInput);
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.remove(id);
  }

  @Mutation(() => ProjectUser, { name: 'assignUserToProject' })
  assignUserToProject(
    @Args('projectId', { type: () => Int }) projectId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.projectsService.assignUserToProject(projectId, userId);
  }

  @Mutation(() => ProjectUser, { name: 'loadProjectHours' })
  loadProjectHours(
    @Args('projectId', { type: () => Int }) projectId: number,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('hours', { type: () => Int }) hours: number,
  ) {
    return this.projectsService.loadProjectHours(projectId, userId, hours);
  }

  /****************************************************
   *** RESOLVERS
   ****************************************************/

  @ResolveField('organization', () => Organization)
  async organization(@Parent() project: Project) {
    return await this.projectsService.getOrganization(project.organizationId);
  }
}
