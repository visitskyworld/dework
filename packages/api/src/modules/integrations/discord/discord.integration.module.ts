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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ProjectIntegration,
      DiscordChannel,
      Organization,
      TaskApplication,
    ]),
    TaskModule,
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
    DiscordStatusboardService,
  ],
  exports: [DiscordIntegrationService],
})
export class DiscordIntegrationModule {}
