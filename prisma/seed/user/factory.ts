import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

import { hashPassword } from '../../../src/helpers/crypto.helper';
import { CreateUserInput } from '../../../src/api/users/dto/create-user.input';
import { User, Role } from '@prisma/client';

export const userFactory = Factory.define<CreateUserInput, any, User>(({ associations }) => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: hashPassword('password'),
  phone: faker.phone.number(),
  organizationId: associations.organizationId || faker.datatype.number(),
  role: Role.USER,
}));
