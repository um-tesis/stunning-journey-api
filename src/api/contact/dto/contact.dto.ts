import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ContactDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  message: string;
}
