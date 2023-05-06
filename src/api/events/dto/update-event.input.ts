import { CreateEventInput } from './create-event.input';
import { InputType, Field, Int, PartialType, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
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

  @Field(() => Int, { nullable: true })
  organizationId: number;

  @Field(() => Int, { nullable: true })
  projectId: number;
}
