import { Resolver, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { Token } from './entities/token.entity';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from './dto/create-user.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from 'src/api/users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService, private readonly projects: ProjectsService) {}

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    data.email = data.email.toLowerCase();
    return await this.auth.createUser(data);
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(email.toLowerCase(), password);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
