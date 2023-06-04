import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { OrganizationsModule } from './api/organizations/organizations.module';
import { ProjectsModule } from './api/projects/projects.module';
import { UsersModule } from './api/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './api/events/events.module';
import { AuthModule } from './api/auth/auth.module';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';
import { ContactModule } from './api/contact/contact.module';
import { HealthModule } from './api/health/health.module';
import { DonorsModule } from './api/donors/donors.module';
import { DonationsModule } from './api/donations/donations.module';
import { SubscriptionsModule } from './api/subscriptions/subscriptions.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ req }),
      cache: 'bounded',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          errorFormat: 'minimal',
        },
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    EventsModule,
    ContactModule,
    HealthModule,
    DonorsModule,
    DonationsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
