import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { organizationSeed } from './organization/seed';
import { userSeed } from './user/seed';
import { eventSeed } from './event/seed';
import { projectSeed } from './project/seed';
import { projectUsersSeed } from './projectUser/seed';

const prisma = new PrismaClient();

async function main() {
  faker.seed(1);
  await seedEssentialData();
  await seedDevData();
}

/**
 * Seed all essential tables which are required for the normal operation
 * of the system and are not dependant on the environment
 */
async function seedEssentialData() {
  console.warn('\x1b[33m Executing essential seeds: \x1b[0m');
  return Promise.all([await organizationSeed()]);
}

/**
 * Seed demo data which can be used by the developers to interact with
 * a preview of the system and showcase the different features easily
 */
// when we add seed data for other entities, we can have to make it async
async function seedDevData() {
  const isDevConfig = process.env.NODE_ENV === 'development';
  if (isDevConfig) {
    console.warn('\x1b[33m Executing development seeds: \x1b[0m');
    await userSeed();
    await projectSeed();
    await eventSeed();
    await projectUsersSeed();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
