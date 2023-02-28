import { CreateProjectInput } from './create-project.input';
import { InputType, Field, GraphQLISODateTime, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => Int)
  project_id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  field: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  start_date: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  end_date: Date;

  @Field(() => Int, { nullable: true })
  organization_id: number;

  @Field(() => Int, { nullable: true })
  monetary_objective: number;
}
