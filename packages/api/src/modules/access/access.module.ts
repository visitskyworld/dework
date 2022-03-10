import { AccessControl } from "@dewo/api/models/AccessControl";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscordModule } from "../integrations/discord/discord.module";
import { IntegrationModule } from "../integrations/integration.module";
import { AccessService } from "./access.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessControl]),
    DiscordModule,
    IntegrationModule,
  ],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
