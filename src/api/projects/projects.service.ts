/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  public async create(createProjectInput: CreateProjectInput) {
    const project = await this.prisma.project.findUnique({
      where: {
        name: createProjectInput.name,
      },
    });
    if (project) throw new NotFoundException('Project with this name already exists');

    return await this.prisma.project.create({
      data: createProjectInput,
    });
  }

  public async findAll(args: PaginationArgs = { page: 1, itemsPerPage: 6 }, filter?: string) {
    const projects = await this.prisma.project.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        name: {
          contains: filter,
          mode: 'insensitive',
        },
      },
    });

    return projects;
  }

  public async findOne(project_id: number) {
    return await this.prisma.project.findUnique({
      where: {
        project_id,
      },
    });
  }

  public async update(project_id: number, updateProjectInput: UpdateProjectInput) {
    return await this.prisma.project.update({
      where: {
        project_id,
      },
      data: updateProjectInput,
    });
  }

  public async remove(project_id: number) {
    return await this.prisma.project.delete({
      where: {
        project_id,
      },
    });
  }

  public async findOrganizationProjects(organization_id: number) {
    return await this.prisma.project.findMany({
      where: {
        organization_id,
      },
    });
  }

  public async findProjectUsers(project_id: number) {
    const users = (
      await this.prisma.projectUser.findMany({
        where: {
          project_id,
        },
        select: {
          project_id: false,
          user: true,
        },
      })
    ).map((projectUser) => projectUser.user);

    const project = await this.prisma.project.findUnique({
      where: {
        project_id,
      },
    });

    if (!users || users.length === 0) throw new NotFoundException('Users not found for this project');

    return { users, project };
  }

  public async assignUserToProject(project_id: number, user_id: number) {
    return await this.prisma.projectUser.create({
      data: {
        project_id,
        user_id,
      },
    });
  }
}
