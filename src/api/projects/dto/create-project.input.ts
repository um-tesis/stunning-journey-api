import { InputType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  field: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => Int)
  @IsNotEmpty()
  organizationId: number;

  @Field(() => Boolean, {
    nullable: true,
    description:
      'If true, donations will be credited to your account immediately, but there is a 5% commission, versus 4% to receive the donation in 21 days.',
  })
  mpInstantCheckout?: boolean;

  @Field(() => String, {
    nullable: true,
    description: "This is a public key to configure in the Website, it's harmless.",
  })
  mpPublicKey?: string;

  @Field(() => String, {
    nullable: true,
    description: "This is a private key, don't share with anyone else than us. We will encrypt it to store it.",
  })
  mpAccessToken?: string;

  @Field(() => String, { nullable: true })
  mpApplicationId?: string;

  @Field(() => String, { nullable: true })
  coverPhoto?: string;

  @Field(() => String, { nullable: true })
  video?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => [String], { nullable: true })
  photoGallery?: string[];

  @Field(() => Boolean)
  @IsNotEmpty()
  acceptsVolunteers: boolean;
}
