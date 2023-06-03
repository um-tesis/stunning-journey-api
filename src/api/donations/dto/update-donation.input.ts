import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDonationInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  status: string;
}
