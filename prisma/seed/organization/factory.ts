import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Organization } from '@prisma/client';
import { CreateOrganizationInput } from '../../../src/api/organizations/dto/create-organization.input';

export const organizationFactory = Factory.define<CreateOrganizationInput, any, Organization>(() => ({
  name: faker.company.name(),
  field: faker.name.jobArea(),
  address: faker.address.streetAddress(),
  email: faker.internet.email(),
  web: faker.internet.url(),
  facebookAccount: faker.internet.url(),
  instagramAccount: faker.internet.url(),
  twitterAccount: faker.internet.url(),
}));
