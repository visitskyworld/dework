import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import _ from "lodash";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { DiscordService } from "./discord.service";
import * as Discord from "discord.js";
import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { User } from "@dewo/api/models/User";
import { ThreepidService } from "../../threepid/threepid.service";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { PermalinkService } from "../../permalink/permalink.service";
import { TaskCreatedEvent, TaskUpdatedEvent } from "../../task/task.events";
import Bluebird from "bluebird";

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

      const channel = (await guild.channels.fetch(
        integration.config.channelId,
        { force: true }
      )) as Discord.TextChannel;
      if (!channel) {
        this.logger.warn(
          `Could not find Discord channel (${JSON.stringify(
            integration.config
          )})`
        );
        return;
      }

      const discordThread = await event.task.discordChannel;
      let thread =
        event instanceof TaskCreatedEvent
          ? undefined
          : await this.getExistingDiscordThread(event.task, channel);

      if (!thread) {
        if (discordThread?.deletedAt) return;

        const shouldCreate = await this.shouldCreateThread(event.task);
        if (!shouldCreate) {
          this.logger.debug(
            `No previous thread exists and should not create a new thread (${JSON.stringify(
              event.task
            )})`
          );
          return;
        } else {
          thread = await this.createDiscordThread(event.task, channel);
        }
      }

      await this.addTaskUsersToDiscordThread(event.task, thread, guild);

      const statusChanged =
        event instanceof TaskCreatedEvent ||
        event.task.status !== event.prevTask.status;
      if (statusChanged) {
        switch (event.task.status) {
          case TaskStatusEnum.IN_PROGRESS:
            await this.postInProgress(event.task, thread);
            break;
          case TaskStatusEnum.IN_REVIEW:
            await this.postMovedIntoReview(event.task, thread);
            break;
          case TaskStatusEnum.DONE:
            await this.postDone(thread);
            break;
        }
      }

      if (event instanceof TaskUpdatedEvent) {
        if (event.task.ownerId !== event.prevTask.ownerId) {
          await this.postOwnerChange(event.task, thread);
        }

        const assigneeIds = event.task.assignees.map((u) => u.id).sort();
        const prevAssigneeIds = event.prevTask.assignees
          .map((u) => u.id)
          .sort();
        if (!_.isEqual(assigneeIds, prevAssigneeIds)) {
          await this.postAssigneesChange(event.task, thread);
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
      }
    }
  }

  private async getProjectIntegration(
    projectId: string
  ): Promise<ProjectIntegration<ProjectIntegrationType.DISCORD>> {
    const integration = await this.projectIntegrationRepo.findOne({
      projectId,
      type: ProjectIntegrationType.DISCORD,
    });

    return integration as ProjectIntegration<ProjectIntegrationType.DISCORD>;
  }

  private async getDiscordId(userId: string) {
    const threepid = (await this.threepidService.findOne({
      userId,
      source: ThreepidSource.discord,
    })) as Threepid<ThreepidSource.discord>;
    return threepid?.threepid;
  }

  private async postDone(thread: Discord.TextBasedChannels) {
    await this.post(
      thread,
      "This task is now marked as done and has been automatically archived"
    );
    if (thread.isThread()) await thread.setArchived(true);
  }

  private async postOwnerChange(task: Task, thread: Discord.TextBasedChannels) {
    if (!task.ownerId) return;
    const owner = await this.getDiscordId(task.ownerId);
    if (!owner) return;

    await this.post(
      thread,
      `<@${owner}> has been added as the reviewer for this task`
    );
  }

  private async postAssigneesChange(
    task: Task,
    thread: Discord.TextBasedChannels
  ) {
    if (!task.assignees.length) return;

    const discordIds = await Promise.all(
      task.assignees.map((u) => this.getDiscordId(u.id))
    );

    const assigneesString = task.assignees
      .map((u, index) =>
        !!discordIds[index] ? `<@${discordIds[index]}>` : u.username
      )
      .join(", ");

    await this.post(
      thread,
      `${assigneesString} ${
        task.assignees.length === 1 ? "is" : "are"
      } leading the work on this task`
    );
  }

  private async postMovedIntoReview(
    task: Task,
    thread: Discord.TextBasedChannels
  ) {
    if (!task.ownerId) return;
    const owner = await this.getDiscordId(task.ownerId);
    if (!owner) return;

    const fields: {
      name: string;
      value: string;
    }[] = [];
    const pr = (await task.githubPullRequests)?.[0];
    if (pr) {
      fields.push({ name: "Github PR", value: pr.link });
    }
    const author = task.assignees?.[0];
    if (thread.isThread() && thread.archived) await thread.setArchived(false);
    await thread.send({
      embeds: [
        {
          title: `In review`,
          description: `The task is now in review.
          Reviewer: <@${owner}>`,
          fields,
          author: !!author
            ? {
                name: author.username,
                iconURL: author.imageUrl,
                url: await this.permalink.get(author),
              }
            : undefined,
          url: await this.permalink.get(task),
        },
      ],
    });
  }

  private async postInProgress(task: Task, thread: Discord.TextBasedChannels) {
    const owner = task.ownerId && (await this.getDiscordId(task.ownerId));
    if (!owner) return;

    const assigneeId = task.assignees?.[0]?.id;
    if (!assigneeId) return;

    const assignee = await this.getDiscordId(assigneeId);
    if (!assignee) return;

    this.logger.debug(`Got assignee: ${assignee} for task ${task.id}`);

    const message = `Hey <@${owner}> and <@${assignee}>! This task has been moved to the next stage.

  Some ground rules:
  
  - Always push your local branches to remote each time you make a commit
  - I will tag you each morning so that you can have a short written 'standup': basically two sentences about where you are and what you'll be working on
  
  Following this protocol ==> higher chance of successfully completing this task`;
    this.post(thread, message);
  }

  private async post(
    thread: Discord.TextBasedChannels,
    message: string | Discord.MessagePayload
  ): Promise<void> {
    this.logger.debug(
      `Sending message to channel: ${JSON.stringify({
        channelId: thread.id,
        message,
      })}`
    );
    if (thread.isThread() && thread.archived) await thread.setArchived(false);
    await thread.send(message);
  }

  private async getExistingDiscordThread(
    task: Task,
    channel: Discord.TextChannel
  ): Promise<Discord.ThreadChannel | undefined> {
    this.logger.debug(
      `Get existing Discord thread: ${JSON.stringify({
        taskId: task.id,
        channelId: channel.id,
      })}`
    );

    const existing = await task.discordChannel;
    if (!existing || !!existing.deletedAt) {
      this.logger.debug(
        `No existing Discord thread record found: ${JSON.stringify({
          taskId: task.id,
          deletedAt: existing?.deletedAt,
        })}`
      );
      return undefined;
    }

    try {
      const thread = await channel.threads.fetch(existing.channelId, {
        force: true,
      });

      if (!thread) throw new Error("Null channel returned from Discord");

      this.logger.debug(
        `Found existing Discord thread: ${JSON.stringify({
          taskId: task.id,
          channelId: channel.id,
          threadId: thread?.id,
        })}`
      );
      return thread ?? undefined;
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

  private async shouldCreateThread(task: Task): Promise<boolean> {
    if (task.status === TaskStatusEnum.IN_PROGRESS) return true;
    if (task.status === TaskStatusEnum.IN_REVIEW) return true;
    if (!!task.assignees.length) return true;
    if (!!(await task.applications).length) return true;
    return false;
  }

  private async createDiscordThread(
    task: Task,
    channel: Discord.TextChannel
  ): Promise<Discord.ThreadChannel> {
    const thread = await channel.threads.create({
      name: task.name.length > 100 ? `${task.name.slice(0, 97)}...` : task.name,
      autoArchiveDuration: 1440,
    });

    const creator = await task.creator;
    await thread.send({
      content: `Thread for Dework task "${task.name}"`,
      embeds: [
        {
          title: task.name,
          author: !!creator
            ? {
                name: creator.username,
                iconURL: creator.imageUrl,
                url: await this.permalink.get(creator),
              }
            : undefined,
          url: await this.permalink.get(task),
        },
      ],
    });

    await this.discordChannelRepo.save({
      taskId: task.id,
      guildId: channel.guildId,
      channelId: thread.id,
      name: thread.name,
    });

    return thread;
  }

  private async addTaskUsersToDiscordThread(
    task: Task,
    thread: Discord.ThreadChannel,
    guild: Discord.Guild
  ): Promise<void> {
    this.logger.debug(
      `Add relevant users to Discord thread: ${JSON.stringify({
        taskId: task.id,
        threadId: thread.id,
      })}`
    );

    const threepids = await this.findTaskUserThreepids(task);
    await Bluebird.mapSeries(threepids, async (t) => {
      try {
        const member = await guild.members.fetch({
          user: t.threepid,
          force: true,
        });

        await thread.members.add(member.user.id);
        // await channel.permissionOverwrites.edit(member.user.id, {
        //   VIEW_CHANNEL: true,
        // });
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
