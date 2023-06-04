import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from './password.service';
import { GqlAuthGuard } from 'src/api/common/guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import config from '../config';
import { ProjectsService } from '../projects/projects.service';
import { BadgrService } from '../projects/badgr.service';

const { JWT_PRIVATE_KEY, JWT_EXPIRE_TIME } = config;

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: JWT_PRIVATE_KEY,
          signOptions: {
            expiresIn: JWT_EXPIRE_TIME,
          },
        };
      },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GqlAuthGuard, PasswordService, ProjectsService, BadgrService],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
