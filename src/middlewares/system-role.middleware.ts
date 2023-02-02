import { NextFunction, Response, Request } from 'express';
import apiResponses from '../utils/api-responses';
import 'reflect-metadata';
import { Injectable, NestMiddleware, mixin, Type } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';

export function RoleAccessMiddlewareCreator(
  allowedRoles: number[],
): Type<NestMiddleware> {
  @Injectable()
  class JWTMiddleware implements NestMiddleware {
    constructor(private readonly userService: UsersService) {}

    async use(
      req: Request & { claims: any },
      res: Response,
      next: NextFunction,
    ) {
      const userId = req.claims?.id;
      if (userId) {
        const user = await this.userService.findOne(userId);
        if (!user || !allowedRoles.includes(user.role)) {
          return apiResponses.unauthorized(res, 'Unauthorized');
        }
        return next();
      }
      return apiResponses.unauthorized(res, 'Unauthorized');
    }
  }
  return mixin(JWTMiddleware);
}
