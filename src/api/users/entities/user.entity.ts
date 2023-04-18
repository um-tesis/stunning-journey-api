import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  phone: string;

  @Field(() => Int, { nullable: true })
  organizationId: number;
}

registerEnumType(Role, {
  name: 'Role',
});
