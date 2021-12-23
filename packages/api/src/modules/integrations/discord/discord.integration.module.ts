import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermalinkService } from "../../permalink/permalink.service";
import { ThreepidModule } from "../../threepid/threepid.module";
import {
  DiscordIntegrationTaskCreatedEventHandler,
  DiscordIntegrationTaskUpdatedEventHandler,
} from "./discord.eventHandlers";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordService } from "./discord.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProjectIntegration, DiscordChannel]),
    ThreepidModule,
  ],
  providers: [
    DiscordService,
    DiscordIntegrationService,
    DiscordIntegrationTaskCreatedEventHandler,
    DiscordIntegrationTaskUpdatedEventHandler,
    PermalinkService,
  ],
})
export class DiscordIntegrationModule {}
