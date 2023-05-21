import { CreateProjectInput } from './create-project.input';
import { InputType, Field, GraphQLISODateTime, PartialType, Int } from '@nestjs/graphql';
import { MercadopagoConfigInput } from './mercadopago-config.input';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  field: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate: Date;

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

  @Field(() => Boolean, { nullable: true })
  acceptsVolunteers: boolean;
}
