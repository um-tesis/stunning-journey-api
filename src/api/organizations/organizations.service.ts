import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationArgs } from 'src/utils/types/pagination-args';

import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  public async create(createOrganizationInput: CreateOrganizationInput) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        name: createOrganizationInput.name,
      },
    });
    if (organization) throw new UnauthorizedException('Organization with this name already exists');

    return await this.prisma.organization.create({
      data: createOrganizationInput,
    });
  }

  public async findAll(args: PaginationArgs = { page: 1, itemsPerPage: 5 }, filter?: string) {
    return await this.prisma.organization.findMany({
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

  public async findOne(organization_id: number) {
    return await this.prisma.organization.findUnique({
      where: {
        organization_id,
      },
    });
  }

  public async update(organization_id: number, updateOrganizationInput: UpdateOrganizationInput) {
    return await this.prisma.organization.update({
      where: {
        organization_id,
      },
      data: updateOrganizationInput,
    });
  }

  public async remove(organization_id: number) {
    return await this.prisma.organization.delete({
      where: {
        organization_id,
      },
    });
  }
}
