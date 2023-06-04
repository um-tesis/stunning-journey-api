import { CreateProjectInput } from './create-project.input';
import { InputType, Field, GraphQLISODateTime, PartialType, Int } from '@nestjs/graphql';

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

  @Field(() => Boolean, {
    description:
      'If true, donations will be credited to your account immediately, but there is a 5% commission, versus 4% to receive the donation in 21 days.',
  })
  mpInstantCheckout?: boolean;

  @Field(() => String, {
    description: "This is a public key to configure in the Website, it's harmless.",
  })
  mpPublicKey?: string;

  @Field(() => String, {
    description: "This is a private key, don't share with anyone else than us. We will encrypt it to store it.",
  })
  mpAccessToken?: string;

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
