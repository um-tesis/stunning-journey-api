import { Injectable } from '@nestjs/common';
import { CreateDonationInput } from './dto/create-donation.input';
import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { UpdateDonationInput } from './dto/update-donation.input';

type CreateDonationInputWithDonorId = CreateDonationInput & {
  donorId: number;
};

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}
  public async findAllByProjectId(projectId: number, args?: PaginationArgs) {
    const isPaginated = args.page && args.itemsPerPage;

    const donations = await this.prisma.donation.findMany({
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

    const total = await this.prisma.donation.count({
      where: {
        projectId,
      },
    });

    return { donations, total };
  }

  public async findAllByOrganizationId(organizationId: number, args?: PaginationArgs) {
    const organizationProjects = await this.prisma.project.findMany({ where: { organizationId } });
    const projectIds = organizationProjects.map((project) => project.id);

    const isPaginated = args.page && args.itemsPerPage;

    const organizationDonations = await this.prisma.donation.findMany({
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

  async create(createDonationInput: CreateDonationInput, donorId: number) {
    const createDonationInputWithDonorId: CreateDonationInputWithDonorId = {
      ...createDonationInput,
      donorId,
    };

    const donation = await this.prisma.donation.create({ data: createDonationInputWithDonorId });

    const result = await this.prisma.donation.aggregate({
      where: { projectId: createDonationInput.projectId },
      _sum: { amount: true },
    });

    await this.prisma.project.update({
      where: { id: createDonationInput.projectId },
      data: { moneyEarned: result._sum.amount },
    });

    return donation;
  }

  update(updateDonationInput: UpdateDonationInput) {
    return this.prisma.donation.update({
      where: { id: updateDonationInput.id },
      data: { status: updateDonationInput.status },
    });
  }
}
