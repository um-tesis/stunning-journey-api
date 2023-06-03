import { Injectable } from '@nestjs/common';
import { CreateDonationInput } from './dto/create-donation.input';
import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from 'src/utils/types/pagination-args';

type CreateDonationInputWithDonorId = CreateDonationInput & {
  donorId: number;
};

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}
  public async findAllByProjectId(projectId: number, args: PaginationArgs = { page: 1, itemsPerPage: 5, filter: '' }) {
    const donations = await this.prisma.donation.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
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

    const total = await this.prisma.donation.count({
      where: {
        projectId,
      },
    });

    return { donations, total };
  }

  public async findAllByOrganizationId(
    organizationId: number,
    args: PaginationArgs = { page: 1, itemsPerPage: 5, filter: '' },
  ) {
    const organizationProjects = await this.prisma.project.findMany({ where: { organizationId } });
    const projectIds = organizationProjects.map((project) => project.id);

    const organizationDonations = await this.prisma.donation.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
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

    const total = await this.prisma.donation.count({
      where: {
        projectId: { in: organizationProjects.map((project) => project.id) },
      },
    });

    return { donations: organizationDonations, total };
  }

  findOne(id: number) {
    return this.prisma.donation.findUnique({ where: { id } });
  }

  async getProject(projectId: number) {
    return this.prisma.project.findUnique({ where: { id: projectId } });
  }

  create(createDonationInput: CreateDonationInput, donorId: number) {
    const createDonationInputWithDonorId: CreateDonationInputWithDonorId = {
      ...createDonationInput,
      donorId,
    };

    return this.prisma.donation.create({ data: createDonationInputWithDonorId });
  }
}
