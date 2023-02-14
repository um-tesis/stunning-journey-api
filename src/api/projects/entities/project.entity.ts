import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

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
