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
    const organization_id = organizations[Math.floor(Math.random() * organizations.length)].organization_id;
    const projectsFromOrganization = await prisma.project.findMany({
      where: {
        organization_id,
      },
    });
    if (projectsFromOrganization.length === 0) continue;
    const usersFromOrganization = await prisma.user.findMany({
      where: {
        organization_id,
      },
    });
    if (usersFromOrganization.length === 0) continue;
    const project_id = projectsFromOrganization[Math.floor(Math.random() * projectsFromOrganization.length)].project_id;
    const user_id = usersFromOrganization[Math.floor(Math.random() * usersFromOrganization.length)].id;

    const randomProjectUser: ProjectUser = projectUsersFactory.build({
      project_id,
      user_id,
    });

    const projectUser = await prisma.projectUser.findUnique({
      where: {
        project_id_user_id: {
          project_id,
          user_id,
        },
      },
    });

    if (projectUser) continue;

    await prisma.projectUser.create({
      data: randomProjectUser,
    });
  }
}
