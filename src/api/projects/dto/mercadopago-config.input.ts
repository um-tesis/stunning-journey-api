import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class MercadopagoConfigInput {
  @Field(() => Boolean, {
    description:
      'If true, donations will be credited to your account immediately, but there is a 5% commission, versus 4% to receive the donation in 21 days.',
  })
  @IsNotEmpty()
  mpInstantCheckout: boolean;

  @Field(() => String, {
    description: "This is a public key to configure in the Website, it's harmless.",
  })
  @IsNotEmpty()
  mpPublicKey: string;

  @Field(() => String, {
    description: "This is a private key, don't share with anyone else than us. We will encrypt it to store it.",
  })
  @IsNotEmpty()
  mpAccessToken: string;
}
