import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
export class Donor extends BaseEntity {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  identification?: string;

  @Field(() => String, { nullable: true })
  identificationType?: string;

  @Field(() => String, { nullable: true })
  cardStart?: string;

  @Field(() => String, { nullable: true })
  paymentMethod?: string;
}
