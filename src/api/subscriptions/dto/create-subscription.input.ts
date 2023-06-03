import { InputType, Int, Field } from '@nestjs/graphql';
import { FrequencyInterval } from '@prisma/client';

@InputType()
export class CreateSubscriptionInput {
  @Field(() => Int)
  donorId: number;

  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  mpSubscriptionId: string;

  @Field(() => Int)
  frequency: number;

  @Field(() => FrequencyInterval)
  frequencyInterval: FrequencyInterval;

  @Field(() => Int)
  billingDayOfMonth: number;

  @Field(() => String)
  status: string;
}
