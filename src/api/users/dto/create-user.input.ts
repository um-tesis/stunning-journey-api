import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  phone: string;

  @Field(() => Int, { nullable: true })
  organizationId: number;
}
