import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { EventSubscriber } from "typeorm";
import * as Discord from "discord.js";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import { DiscordIntegrationChannel } from "./dto/DiscordIntegrationChannel";
import { IntegrationService } from "../integration.service";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";

@Injectable()
@EventSubscriber()
export class DiscordService implements OnModuleInit {
  private logger = new Logger(this.constructor.name);
  public client: Discord.Client;

  constructor(
    private readonly integrationService: IntegrationService,
    private readonly config: ConfigService<ConfigType>
  ) {
    this.client = new Discord.Client({ intents: [] });
  }

  async onModuleInit() {
    await this.client.login(this.config.get("DISCORD_BOT_TOKEN"));
  }

  public async getChannels(
    organizationId: string
  ): Promise<DiscordIntegrationChannel[]> {
    const integration =
      await this.integrationService.findOrganizationIntegration(
        organizationId,
        OrganizationIntegrationType.DISCORD
      );

    if (!integration) {
      throw new NotFoundException("Organization integration not found");
    }

    const guild = await this.client.guilds.fetch(integration.config.guildId);
    if (!guild) {
      this.logger.error(
        `Failed to fetch Discord guild: ${JSON.stringify({
          organizationId,
          integrationId: integration.id,
          guildId: integration.config.guildId,
        })}`
      );
      return [];
    }

    const channels = await guild.channels.fetch(undefined, { force: true });
    return channels
      .filter((channel) => channel.isText())
      .map(
        (channel): DiscordIntegrationChannel => ({
          id: channel.id,
          name: channel.name,
          integrationId: integration.id,
        })
      );
  }
}
