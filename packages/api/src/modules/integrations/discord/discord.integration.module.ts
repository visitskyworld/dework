import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordIntegrationResolver } from "./discord.integration.resolver";
import { DiscordIntegrationService } from "./discord.integration.service";
import { DiscordService } from "./discord.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectIntegration, User])],
  providers: [
    DiscordService,
    DiscordIntegrationService,
    DiscordIntegrationResolver,
  ],
})
export class DiscordIntegrationModule {}
