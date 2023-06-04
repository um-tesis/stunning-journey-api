import { PrismaClient } from '@prisma/client';

import { donorFactory } from './factory';
const prisma = new PrismaClient();

export async function donorSeed() {
  console.log('Donors seed');

  await seedRandomDonors();
}

async function seedRandomDonors() {
  const users = await prisma.user.findMany();

  for (let i = 0; i < 100; i++) {
    const randomDonor = donorFactory.build({
      userId: users[Math.floor(Math.random() * users.length)].id,
    });
    const donor = await prisma.donor.findFirst({
      where: {
        email: randomDonor.email,
      },
    });
    if (donor) continue;

    await prisma.donor.create({
      data: randomDonor,
    });
  }
}
