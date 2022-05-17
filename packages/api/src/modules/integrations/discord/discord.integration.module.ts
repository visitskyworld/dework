import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { Organization } from "@dewo/api/models/Organization";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../../permalink/permalink.module";
import { TaskModule } from "../../task/task.module";
import { ThreepidModule } from "../../threepid/threepid.module";
import { IntegrationModule } from "../integration.module";
import {
  DiscordIntegrationCreatedEventHandler,
  DiscordIntegrationPaymentConfirmedEventHandler,
  DiscordIntegrationPaymentCreatedEventHandler,
  DiscordIntegrationTaskApplicationCreatedEventHandler,
  DiscordIntegrationTaskCreatedEventHandler,
  DiscordIntegrationTaskSubmissionCreatedEventHandler,
  DiscordIntegrationTaskUpdatedEventHandler,
  DiscordIntegrationUpdatedEventHandler,
} from "./discord.eventHandlers";
import { DiscordIntegrationResolver } from "./discord.integration.resolver";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordModule } from "./discord.module";
import { DiscordStatusboardService } from "./discord.statusboard.service";

import { RbacModule } from "@dewo/api/modules/rbac/rbac.module";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { DiscordIntegrationPoller } from "./discord.integration.poller";
import { Task } from "@dewo/api/models/Task";
import { TaskSearchModule } from "../../task/search/task.search.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ProjectIntegration,
      DiscordChannel,
      Organization,
      TaskApplication,
      Task,
    ]),
    TaskModule,
    TaskSearchModule,
    RbacModule,
    ThreepidModule,
    PermalinkModule,
    IntegrationModule,
    DiscordModule,
  ],
  providers: [
    DiscordIntegrationService,
    DiscordIntegrationResolver,
    DiscordIntegrationTaskCreatedEventHandler,
    DiscordIntegrationTaskUpdatedEventHandler,
    DiscordIntegrationTaskApplicationCreatedEventHandler,
    DiscordIntegrationTaskSubmissionCreatedEventHandler,
    DiscordIntegrationCreatedEventHandler,
    DiscordIntegrationUpdatedEventHandler,
    DiscordIntegrationPaymentConfirmedEventHandler,
    DiscordIntegrationPaymentCreatedEventHandler,
    DiscordStatusboardService,
  ],
  controllers: [DiscordIntegrationPoller],
  exports: [DiscordIntegrationService],
})
export class DiscordIntegrationModule {}
