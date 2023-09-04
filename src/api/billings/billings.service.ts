import { Injectable } from '@nestjs/common';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { PrismaService } from 'nestjs-prisma';
import { BillingStatus } from '@prisma/client';

type BillingInput<T> = T & { endsAt: Date };

@Injectable()
export class BillingsService {
  constructor(private prisma: PrismaService) {}

  create(createBillingInput: CreateBillingInput) {
    beforeUpsert(createBillingInput.projectId, createBillingInput);
    return this.prisma.projectBilling.create({ data: createBillingInput as BillingInput<CreateBillingInput> });
  }

  findAll() {
    return this.prisma.projectBilling.findMany();
  }

  findAllByProjectId(projectId: number) {
    return this.prisma.projectBilling.findMany({ where: { projectId } });
  }

  findOneUnpaidByProjectId(projectId: number) {
    return this.prisma.projectBilling.findFirst({
      where: { projectId, status: BillingStatus.PENDING },
      orderBy: { endsAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.projectBilling.findUnique({ where: { id } });
  }

  update(id: number, updateBillingInput: UpdateBillingInput) {
    return this.prisma.projectBilling.update({
      where: { id },
      data: updateBillingInput,
    });
  }

  remove(id: number) {
    return this.prisma.projectBilling.delete({ where: { id } });
  }
}

const beforeUpsert = (projectId: number, data: UpdateBillingInput | CreateBillingInput) => {
  const today = new Date();
  const endsAt = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 1));
  Object.assign(data, { projectId, ...(!data.endsAt && { endsAt }) });
};
