import { PrismaClient } from '@prisma/client';

import { subscriptionFactory } from './factory';
const prisma = new PrismaClient();

export async function subscriptionSeed() {
  console.log('Subscriptions seed');

  await seedRandomSubscriptions();
}

async function seedRandomSubscriptions() {
  const projects = await prisma.project.findMany();
  const donors = await prisma.donor.findMany();

  for (let i = 0; i < 100; i++) {
    const randomSubscription = subscriptionFactory.build({
      donorId: donors[Math.floor(Math.random() * donors.length)].id,
      projectId: projects[Math.floor(Math.random() * projects.length)].id,
    });
    const subscription = await prisma.subscription.findFirst({
      where: {
        donorId: randomSubscription.donorId,
        projectId: randomSubscription.projectId,
      },
    });
    if (subscription) continue;

    await prisma.subscription.create({
      data: randomSubscription,
    });
  }
}
