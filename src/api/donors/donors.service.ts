import { Injectable } from '@nestjs/common';
import { CreateDonorInput } from './dto/create-donor.input';
import { UpdateDonorInput } from './dto/update-donor.input';
import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from 'src/utils/types/pagination-args';

@Injectable()
export class DonorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDonorInput: CreateDonorInput) {
    const donor = await this.prisma.donor.findUnique({
      where: {
        identification_identificationType: {
          identification: createDonorInput.identification,
          identificationType: createDonorInput.identificationType,
        },
      },
    });

    if (donor) return donor;

    return this.prisma.donor.create({ data: createDonorInput });
  }

  findOne(id: number) {
    return this.prisma.donor.findUnique({ where: { id } });
  }

  async findAllByProjectId(projectId: number, args?: PaginationArgs) {
    const projectUsers = await this.prisma.projectUser.findMany({ where: { projectId } });
    const userIds = projectUsers.map((projectUser) => projectUser.userId);

    const isPaginated = args && args.page && args.itemsPerPage;

    const projectDonors = await this.prisma.donor.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    const total = await this.prisma.donor.count({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return { donors: projectDonors, total };
  }

  async findAllByOrganizationId(organizationId: number, args?: PaginationArgs) {
    const organizationUsers = await this.prisma.user.findMany({ where: { organizationId } });
    const userIds = organizationUsers.map((user) => user.id);

    const isPaginated = args && args.page && args.itemsPerPage;

    const organizationDonors = await this.prisma.donor.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    const total = await this.prisma.donor.count({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return { donors: organizationDonors, total };
  }

  update(id: number, updateDonorInput: UpdateDonorInput) {
    return this.prisma.donor.update({
      where: { id },
      data: updateDonorInput,
    });
  }

  remove(id: number) {
    return this.prisma.donor.delete({ where: { id } });
  }
}
