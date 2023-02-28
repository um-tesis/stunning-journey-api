import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/api/users/entities/user.entity';
import { UsersService } from 'src/api/users/users.service';
import { decode } from 'src/helpers/jwt.helper';

@Injectable()
export class SystemRoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    if (!context.getArgs()[2].req.headers.authorization) return false;
    const token = context.getArgs()[2].req.headers.authorization.replace('Bearer ', '');
    if (!token) return false;
    const userId: number = decode(token as string).id;
    if (userId) {
      const user: User = await this.userService.findOne(userId);
      if (!user) {
        return false;
      }
      return roles.includes(user.role);
    }
    return false;
  }
}
