import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

const RoleGuard = (...roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const ctx = GqlExecutionContext.create(context);
      const user = ctx.getContext().req.user;

      return roles.includes(user?.role as Role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
