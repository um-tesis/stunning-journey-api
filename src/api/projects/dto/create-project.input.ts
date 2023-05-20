import { InputType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';
import { MercadopagoConfigInput } from './mercadopago-config.input';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field()
  field: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate: Date;

  @Field(() => Int)
  organizationId: number;

  @Field(() => MercadopagoConfigInput, { nullable: true })
  mercadopagoConfig: MercadopagoConfigInput;

  @Field(() => String, { nullable: true })
  coverPhoto: string;

  @Field(() => String, { nullable: true })
  video: string;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => [String], { nullable: true })
  photoGallery: string[];

  @Field(() => Boolean)
  acceptsVolunteers: boolean;
}
