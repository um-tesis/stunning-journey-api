import { Module } from '@nestjs/common';

import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { BadgrService } from './badgr.service';

@Module({
  providers: [ProjectsResolver, ProjectsService, BadgrService],
})
export class ProjectsModule {}
