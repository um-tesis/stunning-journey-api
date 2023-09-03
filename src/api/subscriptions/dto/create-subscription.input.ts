import { InputType, Int, Field } from '@nestjs/graphql';
import { FrequencyInterval } from '@prisma/client';

@InputType()
export class CreateSubscriptionInput {
  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  mpSubscriptionId: string;

  @Field(() => String, { nullable: true })
  payerEmail?: string;

  @Field(() => Int)
  frequency: number;

  @Field(() => FrequencyInterval)
  frequencyInterval: FrequencyInterval;

  @Field(() => String)
  status: string;
}
