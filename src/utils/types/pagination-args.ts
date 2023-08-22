import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  page;

  @Field(() => Int, { nullable: true })
  itemsPerPage;

  @Field(() => String, { nullable: true })
  filter? = '';
}
