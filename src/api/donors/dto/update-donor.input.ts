import { CreateDonorInput } from './create-donor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDonorInput extends PartialType(CreateDonorInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  identification?: string;

  @Field(() => String, { nullable: true })
  identificationType?: string;

  @Field(() => String, { nullable: true })
  cardStart?: string;

  @Field(() => String, { nullable: true })
  paymentMethod?: string;
}
