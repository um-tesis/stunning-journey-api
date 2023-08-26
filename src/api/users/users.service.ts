import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { PasswordService } from '../auth/password.service';
import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from 'src/utils/types/pagination-args';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private passwordService: PasswordService) {}

  public async findAll() {
    return this.prisma.user.findMany();
  }

  public async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserInput,
    });

    return updatedUser;
  }

  public async remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async changePassword(userId: number, userPassword: string, changePassword: ChangePasswordInput) {
    const passwordValid = this.passwordService.validatePassword(changePassword.oldPassword, userPassword);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = this.passwordService.hashPassword(changePassword.newPassword);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  public async findAllByOrganizationId(organizationId: number) {
    return this.prisma.user.findMany({
      where: {
        organizationId,
      },
    });
  }

  public async findAllOrganizationAdmins(organizationId: number, args?: PaginationArgs) {
    const isPaginated = args && args.page && args.itemsPerPage;

    const admins = await this.prisma.user.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        organizationId,
        role: 'ORGADMIN',
        name: {
          contains: args.filter,
        },
      },
    });

    const total = await this.prisma.user.count({
      where: {
        organizationId,
        role: 'ORGADMIN',
        name: {
          contains: args.filter,
        },
      },
    });

    return { admins, total };
  }

  public async findAllByProjectId(projectId: number, args?: PaginationArgs) {
    const isPaginated = args && args.page && args.itemsPerPage;

    const volunteers = await this.prisma.projectUser.findMany({
      skip: isPaginated ? (args.page - 1) * args.itemsPerPage : undefined,
      take: isPaginated ? args.itemsPerPage : undefined,
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });

    const total = await this.prisma.projectUser.count({
      where: {
        projectId,
      },
    });

    return { volunteers, total };
  }
}
