import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { Donor } from '@prisma/client';
import { CreateDonationInput } from 'src/api/donations/dto/create-donation.input';

export const donationFactory = Factory.define<CreateDonationInput, any, Donor>(({ associations }) => ({
  donorId: associations.donorId || faker.datatype.number(),
  projectId: associations.projectId || faker.datatype.number(),
  amount: faker.datatype.number(),
  createdAt: faker.date.past(),
  mpPreferenceId: faker.datatype.uuid(),
}));
