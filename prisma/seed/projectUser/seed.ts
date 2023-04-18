import { PrismaClient, ProjectUser } from '@prisma/client';

import { projectUsersFactory } from './factory';
const prisma = new PrismaClient();

export async function projectUsersSeed() {
  console.log('Project Users seed');

  await seedRandomProjectUsers();
}

async function seedRandomProjectUsers() {
  const organizations = await prisma.organization.findMany();

  for (let i = 0; i < 20; i++) {
    const organizationId = organizations[Math.floor(Math.random() * organizations.length)].id;
    const projectsFromOrganization = await prisma.project.findMany({
      where: {
        organizationId,
      },
    });
    if (projectsFromOrganization.length === 0) continue;
    const usersFromOrganization = await prisma.user.findMany({
      where: {
        organizationId,
      },
    });
    if (usersFromOrganization.length === 0) continue;
    const projectId = projectsFromOrganization[Math.floor(Math.random() * projectsFromOrganization.length)].id;
    const userId = usersFromOrganization[Math.floor(Math.random() * usersFromOrganization.length)].id;

    const randomProjectUser: ProjectUser = projectUsersFactory.build({
      projectId,
      userId,
    });

    const projectUser = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (projectUser) continue;

    await prisma.projectUser.create({
      data: randomProjectUser,
    });
  }
}
