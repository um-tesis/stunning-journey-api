import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDonationInput {
  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  status: string;
}
