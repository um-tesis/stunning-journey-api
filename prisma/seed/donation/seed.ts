import { PrismaClient } from '@prisma/client';

import { donationFactory } from './factory';
const prisma = new PrismaClient();

export async function donationSeed() {
  console.log('Donations seed');

  await seedRandomDonations();
}

async function seedRandomDonations() {
  const users = await prisma.user.findMany();
  const projects = await prisma.project.findMany();

  for (let i = 0; i < 100; i++) {
    const randomDonation = donationFactory.build({
      donorId: users[Math.floor(Math.random() * users.length)].id,
      projectId: projects[Math.floor(Math.random() * projects.length)].id,
    });
    const donation = await prisma.donation.findFirst({
      where: {
        donorId: randomDonation.donorId,
        projectId: randomDonation.projectId,
      },
    });
    if (donation) continue;

    await prisma.donation.create({
      data: randomDonation,
    });
  }
}
