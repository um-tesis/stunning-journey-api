import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateBillingInput {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  amount: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endsAt?: Date;
}
