import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PaymentPayer {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  identificationType: string;

  @Field(() => String)
  identificationNumber: string;

  @Field(() => String, { nullable: true })
  phone?: string;
}

@ObjectType()
class PaymentCard {
  @Field(() => String, { nullable: true })
  cardHolderName?: string;

  @Field(() => String, { nullable: true })
  firstSixDigits?: string;

  @Field(() => String, { nullable: true })
  lastFourDigits?: string;

  @Field(() => Int, { nullable: true })
  expirationMonth?: number;

  @Field(() => Int, { nullable: true })
  expirationYear?: number;
}

@ObjectType()
export class Payment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  status: string;

  @Field(() => Int)
  amount: number;

  @Field(() => Float)
  amountReceived: number;

  @Field(() => String)
  externalReference: string;

  @Field(() => PaymentPayer)
  payer: PaymentPayer;

  @Field(() => String)
  paymentMethodId: string;

  @Field(() => String)
  paymentTypeId: string;

  @Field(() => PaymentCard)
  card?: PaymentCard;
}
