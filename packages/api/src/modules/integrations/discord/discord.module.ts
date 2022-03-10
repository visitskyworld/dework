import { Module } from "@nestjs/common";
import { ThreepidModule } from "../../threepid/threepid.module";
import { IntegrationModule } from "../integration.module";

import { DiscordService } from "./discord.service";

@Module({
  imports: [ThreepidModule, IntegrationModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
