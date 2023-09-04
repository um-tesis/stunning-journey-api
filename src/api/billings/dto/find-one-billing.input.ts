import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindOneBillingInput {
  @Field(() => Int)
  projectId?: number;
}
