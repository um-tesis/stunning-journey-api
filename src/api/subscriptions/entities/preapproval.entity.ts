import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Preapproval {
  @Field(() => String)
  id: string;

  @Field(() => String)
  status: string;

  @Field(() => String)
  reason: string;

  @Field(() => String)
  externalReference: string;

  @Field(() => String)
  initPoint: string;
}
