import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDonorInput {
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