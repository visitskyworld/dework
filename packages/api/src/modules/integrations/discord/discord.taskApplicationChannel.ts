import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { Injectable, Logger } from "@nestjs/common";
import { IntegrationService } from "../integration.service";
import { DiscordService } from "./discord.service";
import Bluebird from "bluebird";
import moment from "moment";
import * as Discord from "discord.js";
import { PermalinkService } from "../../permalink/permalink.service";

@Injectable()
export class DiscordTaskApplicationThreadService {
  private logger = new Logger(this.constructor.name);

  private readonly channelName = "dework-task-applicants";

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly integrationService: IntegrationService
  ) {}

  public async createTaskApplicationThread(taskApplication: TaskApplication) {
    const task = await taskApplication.task;
    const applicant = await taskApplication.user;
    const project = await task.project;

    if (!task.ownerId) {
      this.logger.warn(
        `Cannot create task application thread for task without owner (${JSON.stringify(
          { taskApplicationId: taskApplication.id }
        )})`
      );
      return;
    }

    // 1. get org discord integration
    const integration =
      await this.integrationService.findOrganizationIntegration(
        project.organizationId,
        OrganizationIntegrationType.DISCORD
      );
    if (!integration) {
      this.logger.warn(
        `Cannot create task application thread if task org has no discord integration (${JSON.stringify(
          {
            taskApplicationId: taskApplication.id,
            organizationId: project.organizationId,
          }
        )})`
      );
      return;
    }

    // 2. get task owner's and task application user's discord id
    const [ownerDiscordId, applicantDiscordId] =
      await this.discord.getDiscordIds([task.ownerId!, taskApplication.userId]);
    if (!ownerDiscordId || !applicantDiscordId) {
      this.logger.warn(
        `Cannot create task application thread if task owner or task applicant isn't connected with Discord (${JSON.stringify(
          {
            taskApplicationId: taskApplication.id,
            ownerId: task.ownerId,
            applicantId: taskApplication.userId,
            ownerDiscordId,
            applicantDiscordId,
          }
        )})`
      );
      return;
    }

    // 3. get or create private discord thread for task applications
    const guild = await this.discord
      .getClient(integration)
      .guilds.fetch({ guild: integration.config.guildId, force: true });

    const channel = await this.getOrCreatePrivateChannel(guild, integration);

    // 4. create private thread in channel
    const name = `${applicant.username} - ${task.name}`;
    const thread = await channel.threads.create({
      name: name.length > 100 ? `${name.slice(0, 97)}...` : name,
      type: guild.features.includes("PRIVATE_THREADS")
        ? "GUILD_PRIVATE_THREAD"
        : undefined,
    });

    // 5. add task owner and task applicant to thread
    await Bluebird.mapSeries(
      [ownerDiscordId, applicantDiscordId],
      async (discordUserId) => {
        try {
          const member = await guild.members.fetch({
            user: discordUserId,
            force: true,
          });

          await channel.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
          });
          await thread.members.add(discordUserId);
        } catch (error) {
          this.logger.warn(
            `Failed updating member permissions: ${JSON.stringify({
              discordUserId,
            })}`
          );
          this.logger.debug(error);
        }
      }
    );

    // 6. send intro message
    await thread.send({
      content: `<@${applicantDiscordId}> just applied! Here is a private thread with <@${ownerDiscordId}> (task reviewer) where you can discuss the task.`,
      embeds: [
        {
          title: task.name,
          url: await this.permalink.get(task),
          description: [
            taskApplication.message,
            [
              moment(taskApplication.startDate).format("YYYY-MM-DD"),
              moment(taskApplication.endDate).format("YYYY-MM-DD"),
            ].join(" - "),
          ]
            .filter((s) => !!s)
            .join("\n"),
          author: {
            name: applicant.username,
            iconURL: applicant.imageUrl,
            url: await this.permalink.get(applicant),
          },
        },
      ],
    });
  }

  private async getOrCreatePrivateChannel(
    guild: Discord.Guild,
    integration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>
  ): Promise<Discord.TextChannel> {
    this.logger.debug("Get or create task application channel");

    const channels = await guild.channels.fetch(undefined, {
      cache: false,
      force: true,
    });
    const existingChannel = channels.find(
      (c): c is Discord.TextChannel => c.isText() && c.name === this.channelName
    );
    if (!!existingChannel) {
      this.logger.debug(
        `Found existing channel: ${JSON.stringify({
          channelId: existingChannel.id,
        })}`
      );
      await guild.roles.fetch(undefined, { force: true, cache: true });
      return existingChannel;
    }

    const channel = await guild.channels.create(this.channelName, {
      type: "GUILD_TEXT",
      permissionOverwrites: [
        // @everyone
        { id: guild.id, deny: "VIEW_CHANNEL" },
        { id: this.discord.getBotUserId(integration), allow: "VIEW_CHANNEL" },
      ],
    });

    this.logger.debug(
      `Created new channel: ${JSON.stringify({ channelId: channel.id })}`
    );

    await guild.roles.fetch(undefined, { force: true, cache: true });
    return channel;
  }
}
