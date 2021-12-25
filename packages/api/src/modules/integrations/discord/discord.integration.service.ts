import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import _ from "lodash";
import Bluebird from "bluebird";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import {
  ProjectIntegration,
  ProjectIntegrationSource,
} from "@dewo/api/models/ProjectIntegration";
import { DiscordService } from "./discord.service";
import * as Discord from "discord.js";
import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { User } from "@dewo/api/models/User";
import { ThreepidService } from "../../threepid/threepid.service";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { PermalinkService } from "../../permalink/permalink.service";
import { TaskCreatedEvent, TaskUpdatedEvent } from "../../task/task.events";

class DiscordChannelNotFoundError extends Error {}

@Injectable()
export class DiscordIntegrationService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly threepidService: ThreepidService,
    @InjectRepository(DiscordChannel)
    private readonly discordChannelRepo: Repository<DiscordChannel>,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>
  ) {}

  async handle(event: TaskUpdatedEvent | TaskCreatedEvent) {
    const integration = await this.getProjectIntegration(event.task.projectId);
    if (!integration) return;

    try {
      this.logger.log(`Handle task event: ${JSON.stringify(event)}`);

      const guild = await this.discord.client.guilds.fetch(
        integration.config.guildId
      );
      await guild.roles.fetch();

      this.logger.debug(
        `Found Discord guild: ${JSON.stringify({ guildId: guild.id })}`
      );

      const category = await this.getOrCreateCategory(guild);
      let channel =
        event instanceof TaskCreatedEvent
          ? undefined
          : await this.getExistingDiscordChannel(event.task, guild, category);

      const discordChannel = await event.task.discordChannel;
      if (!channel) {
        if (discordChannel?.deletedAt) return;

        const shouldCreate = await this.shouldCreateChannel(event.task);
        if (!shouldCreate) {
          this.logger.debug(
            `No previous channel exists and should not create a new channel (${JSON.stringify(
              event.task
            )})`
          );
          return;
        } else {
          channel = await this.createDiscordChannel(
            event.task,
            guild,
            category
          );
        }
      }

      await this.addTaskUsersToDiscordChannel(event.task, channel, guild);

      const statusChanged =
        event instanceof TaskCreatedEvent ||
        event.task.status !== event.prevTask.status;
      if (statusChanged) {
        switch (event.task.status) {
          case TaskStatusEnum.IN_PROGRESS:
            await this.postInProgress(event.task);
            break;
          case TaskStatusEnum.IN_REVIEW:
            await this.postMovedIntoReview(event.task);
            break;
          case TaskStatusEnum.DONE:
            await this.postDone(event.task);
            break;
        }
      }

      // write about task applicant updates (should that be done elsewhere maybe?)
    } catch (error) {
      if (error instanceof DiscordChannelNotFoundError) {
        await this.discordChannelRepo.update(
          { taskId: event.task.id },
          { deletedAt: new Date() }
        );
      } else {
        const errorString = JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        );
        this.logger.error(
          `Unknown error: ${JSON.stringify({ event, errorString })}`
        );

        throw error;
      }
    }
  }

  private async getProjectIntegration(
    projectId: string
  ): Promise<ProjectIntegration<ProjectIntegrationSource.discord>> {
    const integration = await this.projectIntegrationRepo.findOne({
      projectId,
      source: ProjectIntegrationSource.discord,
    });

    return integration as ProjectIntegration<ProjectIntegrationSource.discord>;
  }

  private async getOrCreateCategory(
    guild: Discord.Guild
  ): Promise<Discord.CategoryChannel> {
    const channels = await guild.channels.fetch();
    const category = channels.find(
      (c): c is Discord.CategoryChannel =>
        c.type === "GUILD_CATEGORY" && c.name === "Dework"
    );

    if (!!category) {
      this.logger.debug(
        `Found Discord category: ${JSON.stringify({
          categoryId: category.id,
          categoryName: category.name,
          guildId: guild.id,
        })}`
      );
      return category;
    }

    this.logger.debug(
      `No Discord category found - creating new one: ${JSON.stringify({
        guildId: guild.id,
      })}`
    );
    return guild.channels.create("Dework", { type: "GUILD_CATEGORY" });
  }

  private async getDiscordId(userId: string) {
    const threepid = (await this.threepidService.findOne({
      userId,
      source: ThreepidSource.discord,
    })) as Threepid<ThreepidSource.discord>;
    return threepid?.threepid;
  }

  private async getDiscordChannel(task: Task) {
    const channel = await this.discordChannelRepo.findOne({
      taskId: task.id,
    });
    if (!channel) return;
    const dChannel = await this.discord.client.channels.fetch(
      channel.channelId
    );
    if (!dChannel) return;

    if (dChannel.type !== "GUILD_TEXT") {
      this.logger.log(
        `Discord channel ${dChannel.id} for task ${task.id} is not a text channel. Aborting.`
      );
      return;
    }

    return dChannel as Discord.TextChannel;
  }

  private async postDone(task: Task) {
    const channel = await this.getDiscordChannel(task);
    if (!channel) return;
    channel.send(`This task is now marked as done.`);
  }

  private async postMovedIntoReview(task: Task) {
    const owner = task.ownerId && (await this.getDiscordId(task.ownerId));
    if (!owner) return;
    const channel = await this.getDiscordChannel(task);
    this.logger.debug(`No discord channel found for task ${task.id}`);
    if (!channel) return;
    this.logger.debug("sending message to channel");

    const fields: {
      name: string;
      value: string;
    }[] = [];
    const pr = (await task.githubPullRequests)?.[0];
    if (pr) {
      fields.push({
        name: "Github PR",
        value: pr.link,
      });
    }
    const author = task.assignees?.[0];
    channel.send({
      embeds: [
        {
          title: `In review`,
          description: `The task is now in review.
          Owner: <@${owner}>`,
          // color: 0x00ffff,
          fields,
          author: author && {
            name: author.username,
            iconURL: author.imageUrl,
            url: await this.permalink.get(author),
          },
          url: await this.permalink.get(task),
        },
      ],
    });
  }

  private async postInProgress(task: Task) {
    const owner = task.ownerId && (await this.getDiscordId(task.ownerId));
    if (!owner) return;
    const channel = await this.getDiscordChannel(task);
    if (!channel) return;

    const assigneeId = task.assignees?.[0]?.id;
    if (!assigneeId) return;

    const assignee = await this.getDiscordId(assigneeId);
    if (!assignee) return;

    this.logger.debug(`Got assignee: ${assignee} for task ${task.id}`);

    const message = `Hey <@${owner}> and <@${assignee}>! This task has been moved to the next stage.

  Some ground rules:
  
  - Always push your local branches to remote each time you make a commit
  - I will tag you each morning so that you can have a short written 'standup': basically two sentences about where you are and what you'll be working on
  
  Following this protocol ==> higher chance of increasing your reputation score`;
    channel.send(message);
  }

  // private async postNewAssignee(task: Task) {
  //   const owner = task.ownerId && (await this.getDiscordId(task.ownerId));
  //   if (!owner) return;
  //   const message = `<@${owner}> A person has applied to this task.`;
  //   const channel = await this.getDiscordChannel(task);
  //   if (!channel) return;
  //   channel.send(message);
  // }

  private async getExistingDiscordChannel(
    task: Task,
    guild: Discord.Guild,
    category: Discord.CategoryChannel
  ): Promise<Discord.TextChannel | undefined> {
    this.logger.debug(
      `Get existing Discord channel: ${JSON.stringify({
        taskId: task.id,
        guildId: guild.id,
        categoryId: category.id,
      })}`
    );

    const existing = await task.discordChannel;
    if (!existing || !!existing.deletedAt) {
      this.logger.debug(
        `No existing Discord channel record found: ${JSON.stringify({
          taskId: task.id,
          deletedAt: existing?.deletedAt,
        })}`
      );
      return undefined;
    }

    try {
      const channel = await guild.channels.fetch(existing.channelId, {
        force: true,
      });

      if (!channel) throw new Error("Null channel returned from Discord");

      this.logger.debug(
        `Found existing Discord channel: ${JSON.stringify({
          taskId: task.id,
          channelId: channel.id,
        })}`
      );
      return channel as Discord.TextChannel;
    } catch (error) {
      this.logger.warn(
        `Failed fetching Discord channel: ${JSON.stringify({
          taskId: task.id,
          channelId: existing.channelId,
          error,
        })}`
      );
      throw new DiscordChannelNotFoundError();
    }
  }

  private async shouldCreateChannel(task: Task): Promise<boolean> {
    if (task.status === TaskStatusEnum.IN_PROGRESS) return true;
    if (task.status === TaskStatusEnum.IN_REVIEW) return true;
    if (!!task.assignees.length) return true;
    if (!!(await task.applications).length) return true;
    return false;
  }

  private async createDiscordChannel(
    task: Task,
    guild: Discord.Guild,
    category: Discord.CategoryChannel
  ): Promise<Discord.TextChannel> {
    this.logger.debug(
      `Creating Discord channel for task: ${JSON.stringify({
        taskId: task.id,
        guildId: guild.id,
        categoryId: category.id,
      })}`
    );

    const channel = await category.createChannel(
      `${task.name} ${task.number}`,
      {
        type: "GUILD_TEXT",
        topic: `Discussion for Dework task "${
          task.name
        }": ${await this.permalink.get(task)}`,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: this.discord.client.user!.id,
            allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
          },
        ],
      }
    );

    this.logger.debug(
      `Created Discord channel for task: ${JSON.stringify({
        taskId: task.id,
        guildId: guild.id,
        categoryId: category.id,
        channelId: channel.id,
      })}`
    );

    await this.discordChannelRepo.save({
      taskId: task.id,
      guildId: guild.id,
      channelId: channel.id,
      name: channel.name,
    });

    return channel;
  }

  private async addTaskUsersToDiscordChannel(
    task: Task,
    channel: Discord.TextChannel,
    guild: Discord.Guild
  ): Promise<void> {
    this.logger.debug(
      `Add relevant users to Discord channel: ${JSON.stringify({
        taskId: task.id,
        channelId: channel.id,
      })}`
    );

    const threepids = await this.findTaskUserThreepids(task);
    await Bluebird.mapSeries(threepids, async (t) => {
      try {
        const member = await guild.members.fetch({
          user: t.threepid,
          force: true,
        });
        await channel.permissionOverwrites.edit(member.user.id, {
          VIEW_CHANNEL: true,
        });
      } catch (error) {
        this.logger.warn(
          `Failed updating member permissions: ${JSON.stringify({
            error,
            threepid: t.threepid,
          })}`
        );
      }
    });

    this.logger.debug(
      `Added VIEW_CHANNEL to members: ${JSON.stringify({
        ids: threepids.map((t) => t.id),
        threepidIds: threepids.map((t) => t.id),
      })}`
    );
  }

  public async findTaskUserThreepids(
    task: Task
  ): Promise<Threepid<ThreepidSource.discord>[]> {
    const userIds = _([await task.owner, ...(await task.assignees)])
      .filter((u): u is User => !!u)
      .map((u) => u.id)
      .uniq()
      .value();

    if (!userIds.length) return [];
    const threepids = (await this.threepidService.find({
      source: ThreepidSource.discord,
      userId: In(userIds),
    })) as Threepid<ThreepidSource.discord>[];
    this.logger.debug(
      `Found threepids of users connected to task: ${JSON.stringify({
        count: threepids.length,
        ids: threepids.map((t) => t.id),
      })}`
    );
    return threepids;
  }
}
