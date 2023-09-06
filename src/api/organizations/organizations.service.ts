import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationArgs } from 'src/utils/types/pagination-args';

import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  public async create(createOrganizationInput: CreateOrganizationInput) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        name: createOrganizationInput.name,
      },
    });
    if (organization) throw new BadRequestException('Organization with this name already exists');

    return this.prisma.organization.create({
      data: createOrganizationInput,
    });
  }

  public async findAll(args?: PaginationArgs, filter?: string) {
    const isPaginated = args && args.page && args.itemsPerPage;

    return this.prisma.organization.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        name: {
          contains: filter,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async findOne(id: number) {
    return this.prisma.organization.findUnique({
      where: {
        id,
      },
    });
  }

  public async update(id: number, updateOrganizationInput: UpdateOrganizationInput) {
    return this.prisma.organization.update({
      where: {
        id,
      },
      data: updateOrganizationInput,
    });
  }

  public async remove(id: number) {
    return this.prisma.organization.delete({
      where: {
        id,
      },
    });
  }

  public async getOrganizationMetrics(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id,
      },
      include: {
        projects: {
          include: {
            donations: true,
          },
        },
        users: true,
      },
    });

    const totalDonations = organization.projects.reduce((acc, project) => {
      return acc + project.donations.reduce((acc, donation) => acc + donation.amount, 0);
    }, 0);

    const totalProjects = organization.projects.length;

    const totalVolunteers = organization.users.filter((user) => user.role === 'USER').length;

    const totalEarnings = organization.projects.reduce((acc, project) => {
      return acc + project.donations.reduce((acc, donation) => acc + donation.amount, 0);
    }, 0);

    const orgUsers = organization.users;

    const totalDonors = await this.prisma.donor.count({
      where: {
        userId: {
          in: orgUsers.map((user) => user.id),
        },
      },
    });

    return {
      totalEarnings,
      totalDonations,
      totalProjects,
      totalVolunteers,
      totalDonors,
    };
  }

  public async getAllOrganizationsMetrics() {
    const organizations = await this.prisma.organization.findMany({
      include: {
        projects: {
          include: {
            donations: true,
          },
        },
        users: true,
      },
    });

    const totalDonations = organizations.reduce((acc, organization) => {
      return (
        acc +
        organization.projects.reduce((acc, project) => {
          return acc + project.donations.reduce((acc, donation) => acc + donation.amount, 0);
        }, 0)
      );
    }, 0);

    const totalProjects = organizations.reduce((acc, organization) => {
      return acc + organization.projects.length;
    }, 0);

    const totalVolunteers = organizations.reduce((acc, organization) => {
      return acc + organization.users.filter((user) => user.role === 'USER').length;
    }, 0);

    const totalEarnings = organizations.reduce((acc, organization) => {
      return (
        acc +
        organization.projects.reduce((acc, project) => {
          return acc + project.donations.reduce((acc, donation) => acc + donation.amount, 0);
        }, 0)
      );
    }, 0);

    const orgUsers = organizations.reduce((acc, organization) => {
      return acc.concat(organization.users);
    }, []);

    const totalDonors = await this.prisma.donor.count({
      where: {
        userId: {
          in: orgUsers.map((user) => user.id),
        },
      },
    });

    return {
      totalEarnings,
      totalDonations,
      totalProjects,
      totalVolunteers,
      totalDonors,
    };
  }
}
