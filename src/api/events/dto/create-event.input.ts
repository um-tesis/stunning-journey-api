import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => GraphQLISODateTime)
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
