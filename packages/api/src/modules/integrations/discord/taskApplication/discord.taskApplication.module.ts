import { PermalinkModule } from "@dewo/api/modules/permalink/permalink.module";
import { ThreepidModule } from "@dewo/api/modules/threepid/threepid.module";
import { Module } from "@nestjs/common";
import { IntegrationModule } from "../../integration.module";
import { DiscordModule } from "../discord.module";
import { DiscordIntegrationTaskApplicationDeletedEventEventHandler } from "./discord.taskApplication.eventHandlers";
import { DiscordTaskApplicationService } from "./discord.taskApplication.service";

@Module({
  imports: [DiscordModule, ThreepidModule, IntegrationModule, PermalinkModule],
  providers: [
    DiscordTaskApplicationService,
    DiscordIntegrationTaskApplicationDeletedEventEventHandler,
  ],
  exports: [DiscordTaskApplicationService],
})
export class DiscordTaskApplicationModule {}
