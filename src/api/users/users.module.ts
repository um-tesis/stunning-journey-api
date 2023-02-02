import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { JWTMiddleware } from 'src/middlewares/jwt.middleware';
import { RoleAccessMiddleware } from 'src/middlewares/system-role.middleware';

@Module({
  providers: [UsersResolver, UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware, RoleAccessMiddleware).forRoutes('/users/1');
  }
}
