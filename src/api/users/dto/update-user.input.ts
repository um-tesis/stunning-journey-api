import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { CreateUserInput } from '../../auth/dto/create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  phone?: string;
}
