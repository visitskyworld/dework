import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreepidModule } from "../../threepid/threepid.module";
import { IntegrationModule } from "../integration.module";

import { DiscordService } from "./discord.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ThreepidModule,
    IntegrationModule,
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
