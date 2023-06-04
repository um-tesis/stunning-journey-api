import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Preference {
  @Field(() => String)
  id: string;

  @Field(() => String)
  initPoint: string;

  @Field(() => String)
  externalReference: string;
}
