import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  public async create(createOrganizationInput: CreateOrganizationInput) {
    return await this.prisma.organization.create({
      data: createOrganizationInput,
    });
  }

  public async findAll() {
    return await this.prisma.organization.findMany();
  }

  public async findOne(organization_id: number) {
    return await this.prisma.organization.findUnique({
      where: {
        organization_id,
      },
    });
  }

  public async update(
    organization_id: number,
    updateOrganizationInput: UpdateOrganizationInput,
  ) {
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
