import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Organization {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  field: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  web: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  facebookAccount: string;

  @Field({ nullable: true })
  twitterAccount: string;

  @Field({ nullable: true })
  instagramAccount: string;
}

@ObjectType()
export class OrganizationMetrics {
  @Field(() => Int)
  totalEarnings: number;

  @Field(() => Int)
  totalDonations: number;

  @Field(() => Int)
  totalProjects: number;

  @Field(() => Int)
  totalVolunteers: number;

  @Field(() => Int)
  totalDonors: number;
}
