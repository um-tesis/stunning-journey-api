import { PrismaClient, Project } from '@prisma/client';

import { projectFactory } from './factory';
const prisma = new PrismaClient();

export async function projectSeed() {
  console.log('Projects seed');

  await seedRandomProjects();
}

async function seedRandomProjects() {
  const organizations = await prisma.organization.findMany();

  for (let i = 0; i < 10; i++) {
    const randomProject: Project = projectFactory.build({
      organization_id: organizations[Math.floor(Math.random() * organizations.length)].organization_id,
    });
    const project = await prisma.project.findUnique({
      where: {
        name: randomProject.name,
      },
    });
    if (project) continue;

    await prisma.project.create({
      data: randomProject,
    });
  }
}
