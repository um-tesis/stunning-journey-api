import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { hashPassword } from 'src/helpers/crypto.helper';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async create(createUserInput: CreateUserInput) {
    const hashedPassword = hashPassword(createUserInput.password);
    const newUser = {
      ...createUserInput,
      password: hashedPassword,
    };
    return await this.prisma.user.create({
      data: newUser,
    });
  }

  public async findAll() {
    return await this.prisma.user.findMany();
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
}
