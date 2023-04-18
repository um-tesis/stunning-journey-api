import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../../../src/helpers/crypto.helper';
import { userFactory } from './factory';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function userSeed() {
  console.log('Users seed');

  await seedDefaultUsers();
  await seedRandomUsers();
}

async function seedDefaultUsers() {
  const sysAdminHashedPassword = hashPassword('password');
  await prisma.user.upsert({
    where: { email: 'sysAdminEx@prisma.io' },
    update: {},
    create: {
      name: faker.name.firstName(),
      email: 'sysAdminEx@prisma.io',
      role: Role.SYSADMIN,
      password: sysAdminHashedPassword,
    },
  });
  const orgAdminHashedPassword = hashPassword('password');
  await prisma.user.upsert({
    where: { email: 'orgAdminEx@prisma.io' },
    update: {},
    create: {
      name: faker.name.firstName(),
      email: 'orgAdminEx@prisma.io',
      password: orgAdminHashedPassword,
      role: Role.ORGADMIN,
      organizationId: 1,
    },
  });
  const userHashedPassword = hashPassword('password');
  await prisma.user.upsert({
    where: { email: 'regularUserEx@prisma.io' },
    update: {},
    create: {
      name: faker.name.firstName(),
      email: 'regularUserEx@prisma.io',
      password: userHashedPassword,
      role: Role.USER,
      organizationId: 1,
    },
  });
}

async function seedRandomUsers() {
  const organizations = await prisma.organization.findMany();

  for (let i = 0; i < 10; i++) {
    const randomUser = userFactory.build({
      organizationId: organizations[Math.floor(Math.random() * organizations.length)].id,
    });
    const user = await prisma.user.findUnique({
      where: {
        email: randomUser.email,
      },
    });
    if (user) continue;

    await prisma.user.create({
      data: randomUser,
    });
  }
}
