import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => Int)
  event_id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  date: Date;

  @Field({ nullable: true })
  location: string;

  @Field(() => Int, { nullable: true })
  monetary_objective: number;

  @Field(() => Int, { nullable: true })
  volunteers_objective: number;

  @Field(() => Int)
  organization_id: number;

  @Field(() => Int)
  project_id: number;
}
