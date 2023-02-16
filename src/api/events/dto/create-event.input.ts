import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => Int, { nullable: true })
  event_id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
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
