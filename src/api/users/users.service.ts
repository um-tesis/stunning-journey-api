import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { compare, hashPassword } from 'src/helpers/crypto.helper';
import { encode } from 'src/helpers/jwt.helper';
import { PrismaService } from 'src/prisma/prisma.service';

import { LogInModelIn } from './dto/auth-input';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { PaginationArgs } from 'src/utils/types/pagination-args';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async create(createUserInput: CreateUserInput) {
    const hashedPassword = hashPassword(createUserInput.password);
    const newUser = {
      ...createUserInput,
      password: hashedPassword,
    };
    const user = await this.prisma.user.findUnique({
      where: {
        email: newUser.email,
      },
    });
    if (user) throw new UnauthorizedException('User with this email already exists');

    return await this.prisma.user.create({
      data: newUser,
    });
  }

  public async findAll(@Args() args: PaginationArgs, @Args('filter', { nullable: true }) filter?: string) {
    return await this.prisma.user.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        email: {
          contains: filter,
          mode: 'insensitive',
        },
      },
    });
  }

  public async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async update(id: number, updateUserInput: UpdateUserInput) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserInput,
    });
  }

  public async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  public async login(logInModelIn: LogInModelIn): Promise<{ user: User; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: logInModelIn.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User or password incorrect');
    }
    const isCorrectPassword = compare(logInModelIn.password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('User or password incorrect');
    }
    const token = encode(user.id);
    return { user, token };
  }

  public async findAllByOrganizationId(organization_id: number) {
    return await this.prisma.user.findMany({
      where: {
        organization_id,
      },
    });
  }
}
