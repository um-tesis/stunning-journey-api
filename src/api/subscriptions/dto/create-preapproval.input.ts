import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePreapprovalInput {
  @Field(() => Int)
  amount: number;

  @Field(() => String)
  projectSlug: string;

  @Field(() => String)
  payerEmail: string;
}
