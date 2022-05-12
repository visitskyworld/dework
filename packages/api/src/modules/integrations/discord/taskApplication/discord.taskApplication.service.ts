import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { Injectable, Logger } from "@nestjs/common";
import Bluebird from "bluebird";
import moment from "moment";
import * as Discord from "discord.js";
import { Task } from "@dewo/api/models/Task";
import { DiscordService } from "../discord.service";
import { PermalinkService } from "@dewo/api/modules/permalink/permalink.service";
import { IntegrationService } from "../../integration.service";

@Injectable()
export class DiscordTaskApplicationService {
  private logger = new Logger(this.constructor.name);

  private readonly channelName = "dework-task-applicants";

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly integrationService: IntegrationService
  ) {}

  public async createTaskApplicationThread(
    taskApplication: TaskApplication,
    task: Task
  ): Promise<string | undefined> {
    const applicant = await taskApplication.user;
    const project = await task.project;

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
      return undefined;
    }

    // 2. get task owner's and task application user's discord id
    const [applicantDiscordId, ...maybeOwnersDiscordIds] =
      await this.discord.getDiscordIds([
        taskApplication.userId,
        ...task.owners.map((u) => u.id),
      ]);
    const ownersDiscordIds = maybeOwnersDiscordIds.filter(
      (id): id is string => !!id
    );
    if (!applicantDiscordId) {
      this.logger.warn(
        `Cannot create task application thread if task applicant isn't connected with Discord (${JSON.stringify(
          {
            taskApplicationId: taskApplication.id,
            ownerIds: task.owners.map((u) => u.id),
            applicantId: taskApplication.userId,
            ownersDiscordIds,
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
    this.logger.debug(
      `Creating thread: ${JSON.stringify({
        taskApplicationId: taskApplication.id,
        name,
        applicantDiscordId,
        ownersDiscordIds,
      })}`
    );
    const thread = await channel.threads.create({
      name: name.length > 100 ? `${name.slice(0, 97)}...` : name,
      // type: guild.features.includes("PRIVATE_THREADS")
      //   ? "GUILD_PRIVATE_THREAD"
      //   : undefined,
    });

    // 5. add task owner and task applicant to thread
    this.logger.debug(
      `Inviting users: ${JSON.stringify({
        taskApplicationId: taskApplication.id,
        threadId: thread.id,
      })}`
    );
    await Bluebird.mapSeries(
      [applicantDiscordId, ...ownersDiscordIds],
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
    this.logger.debug(
      `Sending message in thread: ${JSON.stringify({
        taskApplicationId: taskApplication.id,
        threadId: thread.id,
      })}`
    );
    await thread.send({
      content: `<@${applicantDiscordId}> just applied! Here is a private thread${
        !!ownersDiscordIds.length
          ? ` with ${ownersDiscordIds
              .map((id) => `<@${id}>`)
              .join(", ")} (task reviewer)`
          : ""
      } where you can discuss the task.`,
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

    this.logger.debug(
      `Done: ${JSON.stringify({ taskApplicationId: taskApplication.id })}`
    );

    return `https://discord.com/channels/${thread.guildId}/${thread.id}`;
  }

  public async deleteTaskApplicationThread(
    application: TaskApplication,
    task: Task
  ) {
    if (!application.discordThreadUrl) return;

    this.logger.log(
      `Deleting task application thread: ${JSON.stringify({ application })}`
    );
    const match = application.discordThreadUrl.match(
      /https:\/\/discord\.com\/channels\/([0-9]+)\/([0-9]+)/
    );
    if (!match) {
      this.logger.warn(
        `Could not parse guildId and threadId from threadUrl: ${application.discordThreadUrl}`
      );
      return;
    }

    const project = await task.project;
    const integration =
      await this.integrationService.findOrganizationIntegration(
        project.organizationId,
        OrganizationIntegrationType.DISCORD
      );

    if (!integration) {
      this.logger.warn(
        `Could not find org integration for task application: ${JSON.stringify({
          application,
          organizationId: project.organizationId,
        })}`
      );
      return;
    }

    const [, _guildId, threadId] = match;
    const guild = await this.discord
      .getClient(integration)
      .guilds.fetch({ guild: integration.config.guildId, force: true });

    const channel = await this.getOrCreatePrivateChannel(guild, integration);
    const thread = await channel.threads.fetch(threadId);
    await thread?.setArchived(true);
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
