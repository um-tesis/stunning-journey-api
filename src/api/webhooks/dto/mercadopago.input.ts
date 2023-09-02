import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class DataInput {
  @Field(() => String)
  id: string;
}

@InputType()
export class MercadoPagoInput {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  live_mode: boolean;

  @Field(() => String)
  type: string;

  @Field(() => String)
  date_created: string;

  @Field(() => String)
  user_id: string;

  @Field(() => String)
  api_version: string;

  @Field(() => String)
  action: string;

  @Field(() => DataInput)
  data: DataInput;

  @Field(() => String)
  topic: string;
}
