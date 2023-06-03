import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { Subscription } from '@prisma/client';
import { CreateSubscriptionInput } from 'src/api/subscriptions/dto/create-subscription.input';

export const subscriptionFactory = Factory.define<CreateSubscriptionInput, any, Subscription>(({ associations }) => ({
  donorId: associations.donorId || faker.datatype.number(),
  projectId: associations.projectId || faker.datatype.number(),
  amount: faker.datatype.number(),
  createdAt: faker.date.past(),
  mpSubscriptionId: faker.datatype.uuid(),
  frequencyInterval: faker.helpers.arrayElement(['YEARLY', 'MONTHLY']),
  frequency: faker.datatype.number(),
  billingDayOfMonth: faker.datatype.number({ min: 1, max: 28 }),
  status: faker.helpers.arrayElement(['ACTIVE', 'PENDING', 'CANCELLED']),
}));
