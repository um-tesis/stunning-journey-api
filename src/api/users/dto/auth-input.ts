import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LogInModelIn {
  @Field()
  email: string;

  @Field()
  password: string;
}
