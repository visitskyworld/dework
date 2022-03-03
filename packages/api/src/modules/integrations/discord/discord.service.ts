import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { EventSubscriber } from "typeorm";
import * as Discord from "discord.js";
import * as request from "request-promise";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import { DiscordIntegrationChannel } from "./dto/DiscordIntegrationChannel";
import { IntegrationService } from "../integration.service";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { ThreepidService } from "../../threepid/threepid.service";
import _ from "lodash";
import { DiscordIntegrationRole } from "./dto/DiscordIntegrationRole";

@Injectable()
@EventSubscriber()
export class DiscordService implements OnModuleInit {
  private logger = new Logger(this.constructor.name);
  private mainClient: Discord.Client;
  private tempClient: Discord.Client;
  private temp2Client: Discord.Client;

  constructor(
    private readonly integrationService: IntegrationService,
    private readonly threepidService: ThreepidService,
    private readonly config: ConfigService<ConfigType>
  ) {
    this.mainClient = new Discord.Client({ intents: [] });
    this.tempClient = new Discord.Client({ intents: [] });
    this.temp2Client = new Discord.Client({ intents: [] });
  }

  async onModuleInit() {
    const mainBotToken = this.config.get("MAIN_DISCORD_BOT_TOKEN");
    const tempBotToken = this.config.get("TEMP_DISCORD_BOT_TOKEN");
    const temp2BotToken = this.config.get("TEMP2_DISCORD_BOT_TOKEN");

    await this.mainClient.login(mainBotToken);

    if (mainBotToken === tempBotToken) {
      this.tempClient = this.mainClient;
    } else {
      await this.tempClient.login(tempBotToken);
    }

    if (mainBotToken === temp2BotToken) {
      this.temp2Client = this.mainClient;
    } else {
      await this.temp2Client.login(temp2BotToken);
    }
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

    const botUserId = this.config.get<string>(
      integration.config.useTempDiscordBot
        ? "TEMP_DISCORD_OAUTH_CLIENT_ID"
        : integration.config.useTempDiscordBot2
        ? "TEMP2_DISCORD_OAUTH_CLIENT_ID"
        : "MAIN_DISCORD_OAUTH_CLIENT_ID"
    )!;
    const guild = await this.getClient(integration).guilds.fetch(
      integration.config.guildId
    );
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

    await guild.roles.fetch(undefined, { force: true }); // makes permissionsFor below work
    const botUser = await guild.members.fetch({ user: botUserId });

    if (!!parentChannelId) {
      const channel = await guild.channels.fetch(parentChannelId, {
        force: true,
      });
      if (!channel?.isText()) return [];
      const fetched = await channel.threads.fetchActive(false);
      return fetched.threads.map(
        this.toIntegrationChannel(integration, botUser)
      );
    } else {
      const channels = await guild.channels.fetch(undefined, { force: true });
      return channels
        .filter((channel) => channel.isText())
        .map(this.toIntegrationChannel(integration, botUser));
    }
  }

  public async getDiscordGuildRoles(
    organizationId: string
  ): Promise<DiscordIntegrationRole[]> {
    this.logger.debug(
      `Getting Discord guild roles: ${JSON.stringify({
        organizationId,
      })}`
    );
    const integration =
      await this.integrationService.findOrganizationIntegration(
        organizationId,
        OrganizationIntegrationType.DISCORD
      );

    if (!integration) {
      throw new NotFoundException("Organization integration not found");
    }

    const guild = await this.getClient(integration).guilds.fetch(
      integration.config.guildId
    );
    const roles = await guild.roles.fetch();
    return roles
      .filter((r) => !r.name.toLowerCase().includes("dework"))
      .map((role) => ({
        id: role.id,
        name: role.name,
        integrationId: integration.id,
      }));
  }

  private toIntegrationChannel =
    (integration: OrganizationIntegration, botUser: Discord.GuildMember) =>
    (
      channel: Discord.GuildChannel | Discord.ThreadChannel
    ): DiscordIntegrationChannel => ({
      id: channel.id,
      name: channel.name,
      integrationId: integration.id,
      permissions: channel.permissionsFor(botUser)?.toArray() ?? [],
    });

  public async postFeedback(
    message: string,
    discordUsername?: string
  ): Promise<boolean> {
    const deworkGuildId = this.config.get<string>("DISCORD_DEWORK_GUILD_ID")!;
    const deworkGuild = await this.mainClient.guilds.fetch(deworkGuildId);
    const feedbackChannelId = this.config.get<string>(
      "DISCORD_DEWORK_FEEDBACK_CHANNEL_ID"
    )!;
    const feedbackChannel = (await deworkGuild.channels.fetch(
      feedbackChannelId,
      {
        force: true,
      }
    )) as Discord.TextChannel;

    this.logger.debug(
      `Fetched Dework  Discord guild and #feedback channel: ${JSON.stringify({
        guildId: deworkGuildId,
        channelId: feedbackChannelId,
      })}`
    );

    const sentMessage = await feedbackChannel.send({
      content: `Feedback posted by ${
        discordUsername ? `Discord user ${discordUsername}` : "anon"
      }`,
      embeds: [
        {
          description: message,
        },
      ],
    });

    if (!sentMessage) return false;

    this.logger.debug(
      `Sent message to feedback channel: ${JSON.stringify({ sentMessage })}`
    );

    return true;
  }

  public async refreshAccessToken(
    threepid: Threepid<ThreepidSource.discord>
  ): Promise<{ accessToken: string; scope: string }> {
    if (process.env.NODE_ENV === "test") {
      return { accessToken: threepid.config.accessToken, scope: "" };
    }

    const res = await request.post({
      url: "https://discord.com/api/oauth2/token",
      json: true,
      form: {
        client_id: this.config.get<string>("MAIN_DISCORD_OAUTH_CLIENT_ID"),
        client_secret: this.config.get<string>(
          "MAIN_DISCORD_OAUTH_CLIENT_SECRET"
        ),
        grant_type: "refresh_token",
        refresh_token: threepid.config.refreshToken,
      },
    });

    await this.threepidService.update(
      _.merge({}, threepid, {
        config: {
          refreshToken: res.refresh_token,
          accessToken: res.access_token,
        },
      })
    );
    return { accessToken: res.access_token, scope: res.scope };
  }

  public getClient(
    integration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>
  ): Discord.Client {
    if (integration.config.useTempDiscordBot) return this.tempClient;
    if (integration.config.useTempDiscordBot2) return this.temp2Client;
    return this.mainClient;
  }
}
