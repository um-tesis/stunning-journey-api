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
import { UsersService } from '../users/users.service';
import { DonationsService } from '../donations/donations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

type HiddenFields = {
  mpEnabled?: boolean;
  slug?: string;
};

export type CreateProjectInputWithHiddenFields = CreateProjectInput & HiddenFields;
export type UpdateProjectInputWithHiddenFields = UpdateProjectInput & HiddenFields;

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private badgrService: BadgrService,
    private usersService: UsersService,
    private donationsService: DonationsService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  public async findAll(args?: PaginationArgs) {
    const isPaginated = args && args.page && args.itemsPerPage;

    const projects = await this.prisma.project.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
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

  public async findOne(id: number, user?: User) {
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
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new NotFoundError('Project not found');
    if (!user || user.role === Role.USER || project.organizationId !== user.organizationId) {
      delete project.mpAccessToken;
      delete project.mpInstantCheckout;
      delete project.moneyEarned;
      delete project.activeSubscriptionsMoney;
    }
    // if (project.mpAccessToken) project.mpAccessToken = await decrypt(project.mpAccessToken);

    const donations = await this.donationsService.getDonationsAmountInThisMonth(project.id);
    const subscriptions = await this.subscriptionsService.getActiveSubscriptionsInThisMonth(project.id);
    const projectVolunteers = await this.usersService.findAllByProjectId(project.id);

    // moneyEarned this month: to be calculated, to calculate this we need to calculate the donations made this month and the subscriptions (active) made this month
    const monthlyEarnedMoney = donations.amount + subscriptions.amount;

    // activeSubscriptionsNumber
    const activeSubscriptionsNumber = subscriptions.total;

    // donatorsNumber
    const donatorsNumber = donations.total;

    // volunteersNumber
    const volunteersNumber = projectVolunteers.total;

    // hoursVolunteered
    const hoursVolunteered = projectVolunteers.volunteers.reduce((acc, volunteer) => acc + volunteer.hours, 0);

    return {
      ...project,
      monthlyEarnedMoney,
      activeSubscriptionsNumber,
      donatorsNumber,
      volunteersNumber,
      hoursVolunteered,
    };
  }

  public async findOneInternalBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    project.mpAccessToken = await decrypt(project.mpAccessToken);

    return project;
  }

  public async findOrganizationProjects(organizationId: number, args?: PaginationArgs) {
    const isPaginated = args && args.page && args.itemsPerPage;

    const projects = await this.prisma.project.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
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
    await beforeCreateOrUpdate(createProjectInput);
    return this.prisma.project.create({ data: createProjectInput });
  }

  public async update(id: number, updateProjectInput: UpdateProjectInputWithHiddenFields) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError('Project does not exist in the system');

    await beforeCreateOrUpdate(updateProjectInput);
    return this.prisma.project.update({
      where: { id },
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

const beforeCreateOrUpdate = async (data: CreateProjectInputWithHiddenFields | UpdateProjectInputWithHiddenFields) => {
  if (data.name) data.slug = slugify(data.name, { lower: true });
  await setMercadoPagoConfig(data);
};
