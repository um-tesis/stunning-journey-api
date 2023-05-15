import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => Int, { nullable: true })
  organizationId?: number;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
