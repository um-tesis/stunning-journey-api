import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { FrequencyInterval } from '@prisma/client';
import { Donor } from '../../donors/entities/donor.entity';
import { Project } from '../../projects/entities/project.entity';

@ObjectType()
export class BaseSubscription extends BaseEntity {
  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  donorId: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => String)
  mpSubscriptionId: string;

  @Field(() => Int)
  frequency: number;

  @Field(() => FrequencyInterval)
  frequencyInterval: FrequencyInterval;

  @Field(() => Int)
  billingDayOfMonth: number;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class Subscription extends BaseSubscription {
  @Field(() => Donor)
  donor: Donor;

  @Field(() => Project)
  project: Project;
}

registerEnumType(FrequencyInterval, {
  name: 'FrequencyInterval',
});
