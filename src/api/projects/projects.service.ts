import { BadRequestException, Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/utils/errors';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { PrismaService } from 'nestjs-prisma';
import { MercadopagoConfigInput } from './dto/mercadopago-config.input';

type CreateProjectInputFlat = Omit<CreateProjectInput, 'mercadopagoConfig'> & Partial<MercadopagoConfigInput>;

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  public async create(createProjectInput: CreateProjectInput) {
    const mercadoPagoConfig = createProjectInput?.mercadopagoConfig && { ...createProjectInput.mercadopagoConfig };
    delete createProjectInput.mercadopagoConfig;

    const data: CreateProjectInputFlat = {
      ...createProjectInput,
    };

    if (mercadoPagoConfig) {
      data.mpInstantCheckout = mercadoPagoConfig.mpInstantCheckout;
      data.mpPublicKey = mercadoPagoConfig.mpPublicKey;

      // Must be encrypted.
      if (mercadoPagoConfig.mpAccessToken.startsWith('APP_USR-')) {
        throw new BadRequestException('Mercadopago Access Token must be encrypted.');
      }

      data.mpAccessToken = mercadoPagoConfig.mpAccessToken;
    }
    return this.prisma.project.create({
      data,
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

  public async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        organization: true,
      },
    });
  }

  public async update(id: number, updateProjectInput: UpdateProjectInput) {
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

    return this.prisma.projectUser.update({
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
    });
  }
}
