import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class LogInModelIn {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(Int)
  role: number;

  @Field({ nullable: true })
  phone: string;
}
