import { ObjectType, Field, Int, registerEnumType, GraphQLISODateTime } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { BillingStatus } from '@prisma/client';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Billing extends BaseEntity {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  amount: number;

  @Field(() => BillingStatus)
  status: BillingStatus;

  @Field(() => GraphQLISODateTime)
  endsAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  paidAt?: Date;

  @Field(() => Int, { nullable: true })
  paidBy?: number;

  @Field(() => User, { nullable: true })
  paidByUser?: User;
}

registerEnumType(BillingStatus, {
  name: 'BillingStatus',
});
