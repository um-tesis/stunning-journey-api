import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Organization {
  @Field(Int)
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
  facebook_account: string;

  @Field({ nullable: true })
  twitter_account: string;

  @Field({ nullable: true })
  instagram_account: string;
}
