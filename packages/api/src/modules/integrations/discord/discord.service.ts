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
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";

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
    organizationId: string,
    parentChannelId: string
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

    if (!!parentChannelId) {
      const channel = await guild.channels.fetch(parentChannelId, {
        force: true,
      });
      if (!channel?.isText()) return [];
      const fetched = await channel.threads.fetchActive(false);
      return fetched.threads.map(this.toIntegrationChannel(integration));
    } else {
      const channels = await guild.channels.fetch(undefined, { force: true });
      return channels
        .filter((channel) => channel.isText())
        .map(this.toIntegrationChannel(integration));
    }
  }

  private toIntegrationChannel =
    (integration: OrganizationIntegration) =>
    (
      channel: Discord.GuildChannel | Discord.ThreadChannel
    ): DiscordIntegrationChannel => ({
      id: channel.id,
      name: channel.name,
      integrationId: integration.id,
    });
}
