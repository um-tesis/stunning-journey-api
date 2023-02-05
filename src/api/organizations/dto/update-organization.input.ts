import { CreateOrganizationInput } from './create-organization.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrganizationInput extends PartialType(
  CreateOrganizationInput,
) {
  @Field(Int)
  organization_id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
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
