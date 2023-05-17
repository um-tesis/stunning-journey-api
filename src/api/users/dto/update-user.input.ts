import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { CreateUserInput } from '../../auth/dto/create-user.input';
import { Role } from '@prisma/client';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
