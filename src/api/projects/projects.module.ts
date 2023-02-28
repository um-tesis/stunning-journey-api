import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  providers: [ProjectsResolver, ProjectsService, PrismaService],
})
export class ProjectsModule {}
