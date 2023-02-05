import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(Int)
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(Int)
  role: number;

  @Field({ nullable: true })
  phone: string;

  @Field(() => Int, { nullable: true })
  organization_id: number;
}
