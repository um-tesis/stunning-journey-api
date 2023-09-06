import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDonationInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String)
  status: string;

  @Field(() => Int, { nullable: true })
  amount?: number;
}
