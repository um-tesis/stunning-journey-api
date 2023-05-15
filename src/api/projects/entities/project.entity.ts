import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Organization } from 'src/api/organizations/entities/organization.entity';
import { User } from 'src/api/users/entities/user.entity';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

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

  @Field(() => Int, { nullable: true })
  monetaryGoal: number;

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
}

@ObjectType()
export class ProjectUser {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  hours: number;

  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
export class PopulatedProjectUser {
  @Field(() => Project)
  project: Project;

  @Field(() => User)
  user: User;

  @Field(() => Int, { nullable: true })
  hours: number;
}

@ObjectType()
export class ProjectsPagination {
  @Field(() => [Project])
  projects: [Project];

  @Field(() => Int)
  total: [User];
}

@ObjectType()
export class ProjectUserPagination {
  @Field(() => [ProjectUser], { nullable: true })
  volunteers: [ProjectUser];

  @Field(() => Int)
  total: [User];
}
