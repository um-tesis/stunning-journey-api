import { PrismaClient } from '@prisma/client';

import { eventFactory } from './factory';
const prisma = new PrismaClient();

export async function eventSeed() {
  console.log('Events seed');

  await seedRandomEvents();
}

async function seedRandomEvents() {
  const organizations = await prisma.organization.findMany();

  for (let i = 0; i < 10; i++) {
    const projectsFromOrganization = await prisma.project.findMany({
      where: {
        organizationId: organizations[Math.floor(Math.random() * organizations.length)].id,
      },
    });
    if (projectsFromOrganization.length === 0) continue;
    const randomEvent = eventFactory.build({
      organizationId: organizations[Math.floor(Math.random() * organizations.length)].id,
      projectId: projectsFromOrganization[Math.floor(Math.random() * projectsFromOrganization.length)].id,
    });
    const event = await prisma.event.findUnique({
      where: {
        name: randomEvent.name,
      },
    });
    if (event) continue;

    await prisma.event.create({
      data: randomEvent,
    });
  }
}
