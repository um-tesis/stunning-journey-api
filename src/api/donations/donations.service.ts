import { Injectable } from '@nestjs/common';
import { CreateDonationInput } from './dto/create-donation.input';
import { PrismaService } from 'nestjs-prisma';
import { UpdateDonationInput } from './dto/update-donation.input';

type CreateDonationInputWithDonorId = CreateDonationInput & {
  donorId: number;
};

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  findAllByProjectId(projectId: number) {
    return this.prisma.donation.findMany({ where: { projectId } });
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
