import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field(() => Int, { nullable: true })
  organization_id: number;

  @Field()
  name: string;

  @Field()
  field: string;

  @Field({ nullable: true })
  web: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  facebook_account: string;

  @Field({ nullable: true })
  twitter_account: string;

  @Field({ nullable: true })
  instagram_account: string;
}
