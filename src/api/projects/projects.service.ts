/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/utils/errors';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { PrismaService } from 'nestjs-prisma';
import { getCorrespondingBadge } from 'src/helpers/badgr.helper';
import slugify from 'slugify';
import { setMercadoPagoConfig } from './utils/setMercadoPagoConfig';
import { decrypt } from '../../helpers/crypto.helper';
import { Role, User } from '@prisma/client';
import { BadgrService } from './badgr.service';

type HiddenFields = {
  mpEnabled?: boolean;
  slug?: string;
};

type CreateProjectInputWithHiddenFields = CreateProjectInput & HiddenFields;
type UpdateProjectInputWithHiddenFields = UpdateProjectInput & HiddenFields;
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService, private badgrService: BadgrService) {
    prisma.$use(async (params, next) => {
      if (params.model === 'Project' && ['create', 'update'].includes(params.action)) {
        const data = params.args.data as CreateProjectInputWithHiddenFields | UpdateProjectInputWithHiddenFields;

        if (data.name) {
          data.slug = slugify(data.name, { lower: true });
        }

        data.mpEnabled = await setMercadoPagoConfig(data);
      }

      return next(params);
    });
  }

  public async findAll(args: PaginationArgs = { page: 1, itemsPerPage: 5, filter: '' }) {
    const projects = await this.prisma.project.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        name: {
          contains: args.filter,
        },
      },
    });

    const total = await this.prisma.project.count({
      where: {
        name: {
          contains: args.filter,
        },
      },
    });

    return { projects, total };
  }

  public async findOne(id: number, user: User) {
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) throw new NotFoundError('Project not found');
    if (!user || user.role === Role.USER || project.organizationId !== user.organizationId) {
      delete project.mpAccessToken;
      delete project.mpInstantCheckout;
    }
    if (project.mpAccessToken) project.mpAccessToken = await decrypt(project.mpAccessToken);

    return project;
  }

  public async findOneBySlug(slug: string, user: User) {
    const project = await this.prisma.project.findFirst({ where: { slug } });
    if (!project) throw new NotFoundError('Project not found');
    if (!user || user.role === Role.USER || project.organizationId !== user.organizationId) {
      delete project.mpAccessToken;
      delete project.mpInstantCheckout;
    }
    if (project.mpAccessToken) project.mpAccessToken = await decrypt(project.mpAccessToken);

    return project;
  }

  public async findOrganizationProjects(
    organizationId: number,
    args: PaginationArgs = { page: 1, itemsPerPage: 5, filter: '' },
  ) {
    const projects = await this.prisma.project.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        organizationId,
      },
    });

    const total = await this.prisma.project.count({
      where: {
        organizationId,
      },
    });

    return { projects, total };
  }

  public async findProjectUsers(projectId: number) {
    const users = (
      await this.prisma.projectUser.findMany({
        where: {
          projectId,
        },
        select: {
          projectId: false,
          user: true,
        },
      })
    ).map((projectUser) => projectUser.user);

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!users || users.length === 0) throw new NotFoundError('Users not found for this project');

    return { users, project };
  }

  public async create(createProjectInput: CreateProjectInputWithHiddenFields) {
    return this.prisma.project.create({ data: createProjectInput });
  }

  public async update(id: number, updateProjectInput: UpdateProjectInputWithHiddenFields) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) throw new NotFoundError('Project does not exist in the system');

    return this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectInput,
    });
  }

  public async remove(id: number) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }

  public async assignUserToProject(projectId: number, userId: number) {
    return this.prisma.projectUser.create({
      data: {
        projectId,
        userId,
      },
    });
  }

  public async loadProjectHours(projectId: number, userId: number, hours: number) {
    const projectUserRecord = await this.prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: {
        projectId: true,
        userId: true,
      },
    });
    if (!projectUserRecord) throw new NotFoundError('User is not assigned to this project');

    const previousTotalHours = (
      await this.prisma.projectUser.aggregate({
        _sum: {
          hours: true,
        },
        where: {
          userId,
        },
      })
    )._sum.hours;

    const newProjectUserRecord = await this.prisma.projectUser.update({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      data: {
        hours: {
          increment: hours,
        },
      },
      include: {
        user: true,
      },
    });

    const totalHours = (
      await this.prisma.projectUser.aggregate({
        _sum: {
          hours: true,
        },
        where: {
          userId,
        },
      })
    )._sum.hours;

    const newBadge = getCorrespondingBadge(totalHours, previousTotalHours);

    if (newBadge) await this.badgrService.awardNewBadge(newProjectUserRecord.user.email, newBadge);

    return this.prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  public async getOrganization(id: number) {
    return this.prisma.organization.findUnique({ where: { id } });
  }
}
