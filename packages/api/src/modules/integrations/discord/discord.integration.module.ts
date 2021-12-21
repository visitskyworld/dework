import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { Project } from "@dewo/api/models/Project";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreepidModule } from "../../threepid/threepid.module";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordService } from "./discord.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectIntegration,
      User,
      Task,
      DiscordChannel,
    ]),
    ThreepidModule,
  ],
  providers: [DiscordService, DiscordIntegrationService],
})
export class DiscordIntegrationModule {}
