import { Injectable } from '@nestjs/common';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { DateTime } from 'luxon';

type CreateSubscriptionInputWithDonorId = CreateSubscriptionInput & {
  donorId: number;
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.subscription.findMany();
  }

  async findAllByProjectId(projectId: number, args?: PaginationArgs) {
    const isPaginated = args && args.page && args.itemsPerPage;

    const projectSubscriptions = await this.prisma.subscription.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        projectId,
      },
      include: {
        donor: {
          select: {
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    const total = await this.prisma.subscription.count({
      where: {
        projectId,
      },
    });

    return { subscriptions: projectSubscriptions, total };
  }

  async findAllByOrganizationId(organizationId: number, args?: PaginationArgs) {
    const organizationProjects = await this.prisma.project.findMany({ where: { organizationId } });
    const projectIds = organizationProjects.map((project) => project.id);

    const isPaginated = args && args.page && args.itemsPerPage;

    const organizationSubscriptions = await this.prisma.subscription.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        projectId: {
          in: projectIds,
        },
      },
      include: {
        donor: {
          select: {
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    const total = await this.prisma.subscription.count({
      where: {
        projectId: {
          in: projectIds,
        },
      },
    });

    return { subscriptions: organizationSubscriptions, total };
  }

  findOne(id: number) {
    return this.prisma.subscription.findUnique({ where: { id } });
  }

  getProject(projectId: number) {
    return this.prisma.project.findUnique({ where: { id: projectId } });
  }

  create(createSubscriptionInput: CreateSubscriptionInput, donorId: number) {
    const createSubscriptionInputWithDonorId: CreateSubscriptionInputWithDonorId = {
      ...createSubscriptionInput,
      donorId,
    };

    return this.prisma.subscription.create({ data: createSubscriptionInputWithDonorId });
  }

  update(id: number, updateSubscriptionInput: UpdateSubscriptionInput) {
    return this.prisma.subscription.update({ where: { id }, data: updateSubscriptionInput });
  }

  remove(id: number) {
    return this.prisma.subscription.delete({ where: { id } });
  }

  async getActiveSubscriptionsInThisMonth(projectId: number) {
    const today = DateTime.local();
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        projectId,
        createdAt: {
          gte: today.startOf('month').toISO(),
          lte: today.endOf('month').toISO(),
        },
        status: 'ACTIVE',
      },
    });

    const amount = subscriptions.reduce((total, subscription) => total + subscription.amount, 0);

    return { amount, total: subscriptions.length };
  }
}
