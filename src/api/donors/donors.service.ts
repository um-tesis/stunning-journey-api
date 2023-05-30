import { Injectable } from '@nestjs/common';
import { CreateDonorInput } from './dto/create-donor.input';
import { UpdateDonorInput } from './dto/update-donor.input';
import { PrismaService } from 'nestjs-prisma';

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
