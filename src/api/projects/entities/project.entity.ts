import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/api/users/entities/user.entity';

@ObjectType()
export class Project {
  @Field(() => Int)
  project_id: number;

  @Field()
  name: string;

  @Field()
  field: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  start_date: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  end_date: Date;

  @Field(() => Int)
  organization_id: number;

  @Field(() => Int, { nullable: true })
  monetary_objective: number;
}

@ObjectType()
export class ProjectUser {
  @Field(() => Int)
  project_id: number;

  @Field(() => Int)
  user_id: number;

  @Field(() => Int, { nullable: true })
  role: number;
}
@ObjectType()
export class PopulatedProjectUser {
  @Field(() => Project)
  project: Project;

  @Field(() => [User])
  users: [User];
}
