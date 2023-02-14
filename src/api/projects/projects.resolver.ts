import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    return this.projectsService.create(createProjectInput);
  }

  @Query(() => [Project], { name: 'projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Query(() => Project, { name: 'project' })
  findOne(@Args('project_id', { type: () => Int }) id: number) {
    return this.projectsService.findOne(id);
  }

  @Query(() => [Project], { name: 'organizationProjects' })
  findOrganizationProjects(@Args('organization_id', { type: () => Int }) id: number) {
    return this.projectsService.findOrganizationProjects(id);
  }

  @Mutation(() => Project)
  updateProject(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
    return this.projectsService.update(updateProjectInput.project_id, updateProjectInput);
  }

  @Mutation(() => Project)
  removeProject(@Args('project_id', { type: () => Int }) id: number) {
    return this.projectsService.remove(id);
  }
}
