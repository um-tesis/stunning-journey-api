import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date: Date;

  @Field({ nullable: true })
  location: string;

  @Field(() => Int, { nullable: true })
  monetaryGoal: number;

  @Field(() => Int, { nullable: true })
  volunteersGoal: number;

  @Field(() => Int)
  organizationId: number;

  @Field(() => Int)
  projectId: number;
}
