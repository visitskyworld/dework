import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordService } from "./discord.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectIntegration, User, Task, DiscordChannel]),
  ],
  providers: [DiscordService, DiscordIntegrationService],
})
export class DiscordIntegrationModule {}
