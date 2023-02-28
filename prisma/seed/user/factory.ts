import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { hashPassword } from '../../../src/helpers/crypto.helper';
import { User } from '@prisma/client';

export const userFactory = Factory.define<User>(({ associations }) => ({
  id: undefined,
  email: faker.internet.email(),
  password: hashPassword('password'),
  role: faker.datatype.number({
    min: 1,
    max: 3,
  }),
  phone: faker.phone.number(),
  organization_id: associations.organization_id || faker.datatype.number(),
}));
