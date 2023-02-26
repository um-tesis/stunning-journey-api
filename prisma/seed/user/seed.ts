import { PrismaClient, User } from '@prisma/client';
import { hashPassword } from '../../../src/helpers/crypto.helper';
import { userFactory } from './factory';
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
      email: 'sysAdminEx@prisma.io',
      password: sysAdminHashedPassword,
      role: 1,
    },
  });
  const orgAdminHashedPassword = hashPassword('password');
  await prisma.user.upsert({
    where: { email: 'orgAdminEx@prisma.io' },
    update: {},
    create: {
      email: 'orgAdminEx@prisma.io',
      password: orgAdminHashedPassword,
      role: 2,
      organization_id: 1,
    },
  });
  const userHashedPassword = hashPassword('password');
  await prisma.user.upsert({
    where: { email: 'regularUserEx@prisma.io' },
    update: {},
    create: {
      email: 'regularUserEx@prisma.io',
      password: userHashedPassword,
      role: 3,
      organization_id: 1,
    },
  });
}

async function seedRandomUsers() {
  const organizations = await prisma.organization.findMany();

  for (let i = 0; i < 10; i++) {
    const randomUser: User = userFactory.build({
      organization_id: organizations[Math.floor(Math.random() * organizations.length)].organization_id,
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
