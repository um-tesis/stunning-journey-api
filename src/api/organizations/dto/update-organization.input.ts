import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { CreateOrganizationInput } from './create-organization.input';

@InputType()
export class UpdateOrganizationInput extends PartialType(CreateOrganizationInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  field: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  web: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  facebookAccount: string;

  @Field({ nullable: true })
  twitterAccount: string;

  @Field({ nullable: true })
  instagramAccount: string;
}
