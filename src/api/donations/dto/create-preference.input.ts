import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePreferenceInput {
  @Field(() => Int)
  amount: number;

  @Field(() => String)
  projectSlug: string;
}
