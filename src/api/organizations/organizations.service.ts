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

  public async findAll(args: PaginationArgs = { page: 1, itemsPerPage: 5 }, filter?: string) {
    return this.prisma.organization.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        name: {
          contains: filter,
          mode: 'insensitive',
        },
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
}
