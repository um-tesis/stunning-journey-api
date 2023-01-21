import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
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
}
