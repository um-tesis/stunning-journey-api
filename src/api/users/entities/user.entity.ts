import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Int)
  role: number;

  @Field({ nullable: true })
  phone: string;

  @Field(() => Int, { nullable: true })
  organization_id: number;
}
