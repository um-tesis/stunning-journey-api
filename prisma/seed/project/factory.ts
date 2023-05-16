import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { Project } from '@prisma/client';
import { CreateProjectInput } from '../../../src/api/projects/dto/create-project.input';

export const projectFactory = Factory.define<CreateProjectInput, any, Project>(({ associations }) => ({
  name: faker.name.jobTitle(),
  organizationId: associations.organizationId || faker.datatype.number(),
  field: faker.company.companySuffix(),
  description: faker.lorem.paragraph(),
  endDate: faker.date.future(),
  startDate: faker.date.past(),
  monetaryGoal: faker.datatype.number(),
  coverPhoto: faker.image.imageUrl(),
  video: faker.image.imageUrl(),
  location: faker.address.city(),
  photoGallery: [faker.image.imageUrl()],
  acceptsVolunteers: faker.datatype.boolean(),
}));
