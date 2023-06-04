import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePreapprovalInput {
  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  payerEmail: string;
}
