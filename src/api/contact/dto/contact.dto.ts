import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ContactDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  company: string;

  @Field()
  message: string;
}
