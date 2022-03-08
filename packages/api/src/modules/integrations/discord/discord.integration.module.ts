import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkModule } from "../../permalink/permalink.module";
import { ProjectModule } from "../../project/project.module";
import { TaskModule } from "../../task/task.module";
import { ThreepidModule } from "../../threepid/threepid.module";
import { IntegrationModule } from "../integration.module";
import {
  DiscordIntegrationTaskApplicationCreatedEventHandler,
  DiscordIntegrationTaskCreatedEventHandler,
  DiscordIntegrationTaskSubmissionCreatedEventHandler,
  DiscordIntegrationTaskUpdatedEventHandler,
} from "./discord.eventHandlers";
import { DiscordIntegrationResolver } from "./discord.integration.resolver";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordService } from "./discord.service";
import { DiscordTaskApplicationThreadService } from "./discord.taskApplicationChannel";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProjectIntegration, DiscordChannel]),
    TaskModule,
    ProjectModule,
    ThreepidModule,
    PermalinkModule,
    IntegrationModule,
  ],
  providers: [
    DiscordService,
    DiscordIntegrationService,
    DiscordIntegrationResolver,
    DiscordIntegrationTaskCreatedEventHandler,
    DiscordIntegrationTaskUpdatedEventHandler,
    DiscordIntegrationTaskApplicationCreatedEventHandler,
    DiscordIntegrationTaskSubmissionCreatedEventHandler,
    DiscordTaskApplicationThreadService,
  ],
  exports: [DiscordIntegrationService],
})
export class DiscordIntegrationModule {}
