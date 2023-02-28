import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  page = 1;

  @Field(() => Int)
  itemsPerPage = 5;
}
