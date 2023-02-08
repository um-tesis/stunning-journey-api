import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(Int)
  id: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => Int, { nullable: true })
  role?: number;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => Int, { nullable: true })
  organization_id: number;
}
