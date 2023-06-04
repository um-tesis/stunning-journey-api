import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { Donor } from '@prisma/client';
import { CreateDonorInput } from 'src/api/donors/dto/create-donor.input';

export const donorFactory = Factory.define<CreateDonorInput, any, Donor>(({ associations }) => ({
  userId: associations.userId || faker.datatype.number(),
  email: faker.internet.email(),
  identification: faker.datatype.uuid(),
  identificationType: faker.helpers.arrayElement(['CC', 'CE', 'TI', 'PP']),
  cardStart: faker.datatype.number({ min: 1000, max: 9999 }).toString(),
  paymentMethod: faker.helpers.arrayElement(['PSE', 'CARD']),
}));
