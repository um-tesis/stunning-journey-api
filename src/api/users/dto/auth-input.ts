import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { User } from '../entities/user.entity';

@InputType()
export class LogInModelIn {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LogInModelOut {
  @Field()
  user: User;

  @Field()
  token: string;
}
