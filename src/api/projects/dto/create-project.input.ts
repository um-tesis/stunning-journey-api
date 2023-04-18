import { InputType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field()
  field: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate: Date;

  @Field(() => Int)
  organizationId: number;
}
