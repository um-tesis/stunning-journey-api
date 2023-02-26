import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { Event } from '@prisma/client';

export const eventFactory = Factory.define<Event>(({ associations }) => ({
  event_id: undefined,
  name: faker.name.jobTitle(),
  organization_id: associations.organization_id || faker.datatype.number(),
  project_id: associations.project_id || faker.datatype.number(),
  date: faker.date.future(),
  monetary_objective: faker.datatype.number(),
  volunteers_objective: faker.datatype.number(),
  description: faker.lorem.paragraph(),
  location: faker.address.streetAddress(),
}));
