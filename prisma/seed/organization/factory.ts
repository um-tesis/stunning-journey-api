import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Organization } from '@prisma/client';

export const organizationFactory = Factory.define<Organization>(() => ({
  organization_id: faker.datatype.number(),
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  field: faker.name.jobArea(),
  address: faker.address.streetAddress(),
  email: faker.internet.email(),
  web: faker.internet.url(),
  facebook_account: faker.internet.url(),
  instagram_account: faker.internet.url(),
  twitter_account: faker.internet.url(),
}));
