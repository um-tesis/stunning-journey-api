import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from 'src/api/users/entities/user.entity';

@ObjectType()
export class Donor extends BaseEntity {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  identification?: string;

  @Field(() => String, { nullable: true })
  identificationType?: string;

  @Field(() => String, { nullable: true })
  cardStart?: string;

  @Field(() => String, { nullable: true })
  paymentMethod?: string;
}

@ObjectType()
export class DonorPagination {
  @Field(() => [Donor])
  donors: [Donor];

  @Field(() => Int)
  total: [User];
}
