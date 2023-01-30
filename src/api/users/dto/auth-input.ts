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

@InputType()
export class LogInModelOut {
  @Field(Int)
  id: number;

  @Field(Int)
  role: number;
}
