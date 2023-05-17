import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { hash } from 'src/helpers/crypto.helper';
import { CreateUserInput } from '../../../src/api/auth/dto/create-user.input';
import { User, Role } from '@prisma/client';

export const userFactory = Factory.define<CreateUserInput, any, User>(({ associations }) => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: hash('password'),
  phone: faker.phone.number(),
  organizationId: associations.organizationId || faker.datatype.number(),
  role: Role.USER,
}));
