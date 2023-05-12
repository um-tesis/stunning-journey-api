import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { OrganizationsModule } from './api/organizations/organizations.module';
import { ProjectsModule } from './api/projects/projects.module';
import { UsersModule } from './api/users/users.module';
import { UsersService } from './api/users/users.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleGuard } from './guards/role.guard';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './api/events/events.module';
import { ContactModule } from './api/contact/contact.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    PrismaModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    EventsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
