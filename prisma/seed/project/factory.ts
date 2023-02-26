import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { Project } from '@prisma/client';

export const projectFactory = Factory.define<Project>(({ associations }) => ({
  project_id: undefined,
  name: faker.name.jobTitle(),
  organization_id: associations.organization_id || faker.datatype.number(),
  field: faker.company.companySuffix(),
  end_date: faker.date.future(),
  start_date: faker.date.past(),
}));
