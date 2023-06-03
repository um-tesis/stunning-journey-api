import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDonationInput {
  @Field(() => Int)
  donorId: number;

  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  mpPreferenceId: string;
}
