import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { ProjectUser } from '@prisma/client';

export const projectUsersFactory = Factory.define<ProjectUser>(({ associations }) => ({
  userId: associations.userId || faker.datatype.number(),
  projectId: associations.projectId || faker.datatype.number(),
  hours: faker.datatype.number(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
}));
