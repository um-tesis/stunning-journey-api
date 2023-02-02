import { NextFunction, Response, Request } from 'express';
import apiResponses from '../utils/api-responses';
import 'reflect-metadata';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class RoleAccessMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  use(req: Request & { claims: any }, res: Response, next: NextFunction) {
    // const userId = req.claims?.id;
    // if (userId) {
    //   const user = await this.userService.findOne(userId);
    //   if (!user || !allowedRoles.includes(user.role)) {
    //     return apiResponses.unauthorized(res, 'Unauthorized');
    //   }
    //   return next();
    // }
    next();
    // return apiResponses.unauthorized(res, 'Unauthorized');
  }
}
