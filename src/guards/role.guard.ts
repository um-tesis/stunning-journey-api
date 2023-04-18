import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from 'src/api/users/users.service';
import { decode } from 'src/helpers/jwt.helper';
import { Role } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    if (!context.getArgs()[2].req.headers.authorization) return false;

    const token: string = context.getArgs()[2].req.headers.authorization.replace('Bearer ', '');
    if (!token) return false;

    const userId: number = decode(token).id;
    if (!userId) return false;

    const user: User = await this.userService.findOne(userId);
    if (!user) return false;

    return roles.includes(user.role);
  }
}
