import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { RbacModule } from "@dewo/api/modules/rbac/rbac.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IntegrationModule } from "../../integration.module";
import { DiscordModule } from "../discord.module";
import { DiscordRolesPoller } from "./discord.roles.poller";
import { DiscordRolesResolver } from "./discord.roles.resolver";
import { DiscordRolesService } from "./discord.roles.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationIntegration]),
    RbacModule,
    DiscordModule,
    IntegrationModule,
  ],
  providers: [DiscordRolesService, DiscordRolesResolver],
  controllers: [DiscordRolesPoller],
  exports: [DiscordRolesService],
})
export class DiscordRolesModule {}
