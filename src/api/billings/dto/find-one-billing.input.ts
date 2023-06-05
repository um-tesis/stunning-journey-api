import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindOneBillingInput {
  @Field(() => Int)
  projectId?: number;

  @Field(() => GraphQLISODateTime)
  endsAt?: Date;
}
