import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { CreateEventInput } from '../../../src/api/events/dto/create-event.input';
import { Event } from '@prisma/client';

export const eventFactory = Factory.define<CreateEventInput, any, Event>(({ associations }) => ({
  name: faker.name.jobTitle(),
  organizationId: associations.organizationId || faker.datatype.number(),
  projectId: associations.projectId || faker.datatype.number(),
  date: faker.date.future(),
  monetaryGoal: faker.datatype.number(),
  volunteersGoal: faker.datatype.number(),
  description: faker.lorem.paragraph(),
  location: faker.address.streetAddress(),
}));
