import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project, ProjectUser, PopulatedProjectUser } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { PaginationArgs } from 'src/utils/types/pagination-args';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    return this.projectsService.create(createProjectInput);
  }

  @Query(() => [Project], { name: 'projects' })
  findAll(@Args() args: PaginationArgs, @Args('filter', { nullable: true }) filter?: string) {
    return this.projectsService.findAll(args, filter);
  }

  @Query(() => Project, { name: 'project' })
  findOne(@Args('project_id', { type: () => Int }) id: number) {
    return this.projectsService.findOne(id);
  }

  @Query(() => [Project], { name: 'organizationProjects' })
  findOrganizationProjects(@Args('organization_id', { type: () => Int }) id: number) {
    return this.projectsService.findOrganizationProjects(id);
  }

  @Query(() => PopulatedProjectUser, { name: 'projectUsers' })
  async findProjectUsers(@Args('project_id', { type: () => Int }) id: number) {
    return await this.projectsService.findProjectUsers(id);
  }

  @Mutation(() => Project)
  updateProject(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
    return this.projectsService.update(updateProjectInput.project_id, updateProjectInput);
  }

  @Mutation(() => Project)
  removeProject(@Args('project_id', { type: () => Int }) id: number) {
    return this.projectsService.remove(id);
  }

  @Mutation(() => ProjectUser, { name: 'assignUserToProject' })
  assignUserToProject(
    @Args('project_id', { type: () => Int }) project_id: number,
    @Args('user_id', { type: () => Int }) user_id: number,
  ) {
    return this.projectsService.assignUserToProject(project_id, user_id);
  }
}
