import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Organization } from 'src/api/organizations/entities/organization.entity';
import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
export class Project extends BaseEntity {
  @Field()
  name: string;

  @Field()
  field: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate: Date;

  @Field(() => Int)
  organizationId: number;

  @Field(() => Boolean)
  mpEnabled: boolean;

  @Field(() => Boolean, { nullable: true })
  mpInstantCheckout: boolean;

  @Field(() => String, { nullable: true })
  mpPublicKey: string;

  @Field(() => String, { nullable: true })
  mpAccessToken: string;

  @Field(() => String, { nullable: true })
  coverPhoto: string;

  @Field(() => String, { nullable: true })
  video: string;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => [String], { nullable: true })
  photoGallery: string[];

  @Field(() => Boolean)
  acceptsVolunteers: boolean;

  @Field(() => Organization, { nullable: true })
  organization: Organization;

  @Field(() => String)
  slug: string;
}

@ObjectType()
export class ProjectsPagination {
  @Field(() => [Project])
  projects: [Project];

  @Field(() => Int)
  total: [User];
}
