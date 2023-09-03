import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { FrequencyInterval } from '@prisma/client';
import { Project } from 'src/api/projects/entities/project.entity';

@ObjectType()
export class BaseSubscription extends BaseEntity {
  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  mpSubscriptionId: string;

  @Field(() => Int)
  frequency: number;

  @Field(() => FrequencyInterval)
  frequencyInterval: FrequencyInterval;

  @Field(() => String, { nullable: true })
  payerEmail?: string;

  @Field(() => String)
  status: string;
}

@ObjectType('SubscriptionEntity')
export class Subscription extends BaseSubscription {
  @Field(() => Project)
  project: Project;
}

registerEnumType(FrequencyInterval, {
  name: 'FrequencyInterval',
});

@ObjectType()
export class SubscriptionPagination {
  @Field(() => [Subscription])
  subscriptions: [Subscription];

  @Field(() => Int)
  total: number;
}
