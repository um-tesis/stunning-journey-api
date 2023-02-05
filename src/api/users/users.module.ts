import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { JWTMiddleware } from 'src/middlewares/jwt.middleware';
import { RoleAccessMiddlewareCreator } from 'src/middlewares/system-role.middleware';
import { SYSTEM_ROLES_ID } from 'src/helpers/constants';

@Module({
  providers: [UsersResolver, UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        JWTMiddleware,
        RoleAccessMiddlewareCreator([SYSTEM_ROLES_ID.SYSTEM_ADMIN]),
      )
      .forRoutes('/users/1');
  }
}
