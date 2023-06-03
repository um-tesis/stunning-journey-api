import { Injectable } from '@nestjs/common';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { PrismaService } from 'nestjs-prisma';

type CreateSubscriptionInputWithDonorId = CreateSubscriptionInput & {
  donorId: number;
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.subscription.findMany();
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
}
