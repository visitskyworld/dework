import { Injectable, Logger, Module } from "@nestjs/common";
import { AppBootstrapModuleImports } from "../modules/app/app.module";
import { NestFactory } from "@nestjs/core";
import { DiscordModule } from "../modules/integrations/discord/discord.module";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "../models/OrganizationIntegration";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiscordService } from "../modules/integrations/discord/discord.service";

@Injectable()
export class FetchCurrentDiscordIntegrationPermissionsService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    @InjectRepository(OrganizationIntegration)
    private readonly repo: Repository<OrganizationIntegration>
  ) {}

  public async run() {
    const integrations = (await this.repo.find({
      type: OrganizationIntegrationType.DISCORD,
    })) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>[];

    this.logger.debug(`Found ${integrations.length} Discord integrations`);
    for (const integration of integrations) {
      try {
        this.logger.debug(
          `Checking Discord integration: ${JSON.stringify({
            integrationId: integration.id,
            guildId: integration.config.guildId,
          })}`
        );
        const guild = await this.discord
          .getClient(integration)
          .guilds.fetch(integration.config.guildId);
        await guild.roles.fetch(undefined, { force: true });

        const botUserId = this.discord.getBotUserId(integration);
        const botUser = await guild.members.fetch({ user: botUserId });

        await this.repo.update(
          { id: integration.id },
          {
            config: {
              ...integration.config,
              originalPermissions:
                integration.config.originalPermissions ??
                integration.config.permissions,
              permissions: botUser.permissions.bitfield.toString(),
            },
          }
        );
      } catch (error) {
        this.logger.error(error);
        await this.repo.update(
          { id: integration.id },
          {
            config: {
              ...integration.config,
              originalPermissions:
                integration.config.originalPermissions ??
                integration.config.permissions,
              permissions: "0",
            },
          }
        );
      }
    }
  }
}

@Module({
  imports: [
    ...AppBootstrapModuleImports!,
    DiscordModule,
    TypeOrmModule.forFeature([OrganizationIntegration]),
  ],
  providers: [FetchCurrentDiscordIntegrationPermissionsService],
})
export class FetchCurrentDiscordIntegrationPermissionsModule {}

async function run() {
  const app = await NestFactory.create(
    FetchCurrentDiscordIntegrationPermissionsModule
  );
  await app.init();
  const service = app.get(FetchCurrentDiscordIntegrationPermissionsService);
  await service.run();
  await app.close();
  process.exit(0);
}

run();
