import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field()
  name: string;

  @Field()
  field: string;

  @Field()
  description: string;

  @Field()
  web: string;

  @Field({ nullable: true })
  address: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  facebookAccount: string;

  @Field({ nullable: true })
  twitterAccount: string;

  @Field({ nullable: true })
  instagramAccount: string;
}
