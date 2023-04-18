import { Field, GraphQLISODateTime, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/api/users/entities/user.entity';
import { ProjectRole } from '@prisma/client';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  field: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate: Date;

  @Field(() => Int)
  organizationId: number;

  @Field(() => Int, { nullable: true })
  monetaryGoal: number;
}

@ObjectType()
export class ProjectUser {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => ProjectRole, { nullable: true })
  role: ProjectRole;
}

@ObjectType()
export class PopulatedProjectUser {
  @Field(() => Project)
  project: Project;

  @Field(() => [User])
  users: [User];
}

registerEnumType(ProjectRole, {
  name: 'ProjectRole',
});
