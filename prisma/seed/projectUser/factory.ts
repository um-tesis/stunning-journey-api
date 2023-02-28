import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { ProjectUser } from '@prisma/client';

export const projectUsersFactory = Factory.define<ProjectUser>(({ associations }) => ({
  user_id: associations.user_id || faker.datatype.number(),
  project_id: associations.project_id || faker.datatype.number(),
  role: faker.datatype.number({
    min: 1,
    max: 3,
  }),
}));
