import { CreateBillingInput } from './create-billing.input';
import { InputType, Field, Int, PartialType, GraphQLISODateTime } from '@nestjs/graphql';
import { BillingStatus } from '@prisma/client';

@InputType()
export class UpdateBillingInput extends PartialType(CreateBillingInput) {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  paidBy?: number;

  @Field(() => Int, { nullable: true })
  amount?: number;

  @Field(() => BillingStatus, { nullable: true })
  status?: BillingStatus;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endsAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  paidAt?: Date;
}
