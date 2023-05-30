import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';

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

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class PopulatedProjectUser {
  @Field(() => Project)
  project: Project;

  @Field(() => User)
  user: User;

  @Field(() => Int, { nullable: true })
  hours: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class ProjectUserPagination {
  @Field(() => [ProjectUser], { nullable: true })
  volunteers: [ProjectUser];

  @Field(() => Int)
  total: [User];
}
