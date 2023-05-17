import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  field: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => String, { nullable: true })
  web?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  facebookAccount?: string;

  @Field(() => String, { nullable: true })
  twitterAccount?: string;

  @Field(() => String, { nullable: true })
  instagramAccount?: string;
}
