import { PrismaClient } from '@prisma/client';

import { Organization } from '@prisma/client';
import { organizationFactory } from './factory';

const prisma = new PrismaClient();

export async function organizationSeed() {
  console.log('Organization seed');

  await seedDefaultOrganizations();
  await seedRandomOrganizations();
}

async function seedRandomOrganizations() {
  const organizations: Organization[] = organizationFactory.buildList(10);

  await prisma.organization.createMany({
    data: organizations,
    skipDuplicates: true,
  });
}

async function seedDefaultOrganizations() {
  await prisma.organization.upsert({
    where: { name: 'Example Organization' },
    update: {},
    create: {
      organization_id: 1,
      name: 'Example Organization',
      field: 'Example Field',
      address: 'Example Address',
      email: 'exampleOrg@prisma.io',
    },
  });
}
