import { CreateEventInput } from './create-event.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => Int)
  event_id: number;

  @Field({ nullable: true })
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

  @Field(() => Int, { nullable: true })
  organization_id: number;

  @Field(() => Int, { nullable: true })
  project_id: number;
}
