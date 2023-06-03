import { Injectable } from '@nestjs/common';
import { CreateDonationInput } from './dto/create-donation.input';
import { PrismaService } from 'nestjs-prisma';

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

  create(createDonationInput: CreateDonationInput, donorId: number) {
    const createDonationInputWithDonorId: CreateDonationInputWithDonorId = {
      ...createDonationInput,
      donorId,
    };

    return this.prisma.donation.create({ data: createDonationInputWithDonorId });
  }
}
