import { PrismaClient, Event } from '@prisma/client';

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
        organization_id: organizations[Math.floor(Math.random() * organizations.length)].organization_id,
      },
    });
    if (projectsFromOrganization.length === 0) continue;
    const randomEvent: Event = eventFactory.build({
      organization_id: organizations[Math.floor(Math.random() * organizations.length)].organization_id,
      project_id: projectsFromOrganization[Math.floor(Math.random() * projectsFromOrganization.length)].project_id,
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
