import { Task, TaskStatus } from "@dewo/api/models/Task";
import _ from "lodash";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Repository } from "typeorm";
import {
  DiscordProjectIntegrationConfig,
  DiscordProjectIntegrationFeature,
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
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";

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
    const organizationIntegration =
      (await integration.organizationIntegration) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
    if (!organizationIntegration) return;

    try {
      this.logger.log(`Handle task event: ${JSON.stringify(event)}`);

      const guild = await this.discord.client.guilds.fetch(
        organizationIntegration.config.guildId
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

      const channelToPostTo = await this.getDiscordChannelToPostTo(
        event.task,
        channel,
        integration.config
      );

      if (!channelToPostTo) return;
      if (channelToPostTo.isThread()) {
        await this.addTaskUsersToDiscordThread(
          event.task,
          channelToPostTo,
          guild
        );
      }

      const statusChanged =
        event instanceof TaskCreatedEvent ||
        event.task.status !== event.prevTask.status;
      if (statusChanged) {
        switch (event.task.status) {
          case TaskStatus.IN_PROGRESS:
            await this.postInProgress(event.task, channelToPostTo);
            break;
          case TaskStatus.IN_REVIEW:
            await this.postMovedIntoReview(event.task, channelToPostTo);
            break;
          case TaskStatus.DONE:
            await this.postDone(
              channelToPostTo,
              event.task,
              !integration.config.features.includes(
                DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD
              )
            );

            const threepids = await this.findTaskUserThreepids(event.task);
            await channel.send({
              content: ":partying_face:",
              embeds: [
                {
                  title: event.task.name,
                  description: `Task is now done! ${threepids
                    .map((t) => `<@${t.threepid}>`)
                    .join(" ")}`,
                  url: await this.permalink.get(event.task),
                },
              ],
            });
            break;
        }
      }

      if (event instanceof TaskUpdatedEvent) {
        if (event.task.ownerId !== event.prevTask.ownerId) {
          await this.postOwnerChange(event.task, channelToPostTo);
        }

        const assigneeIds = event.task.assignees.map((u) => u.id).sort();
        const prevAssigneeIds = event.prevTask.assignees
          .map((u) => u.id)
          .sort();
        if (!_.isEqual(assigneeIds, prevAssigneeIds)) {
          await this.postAssigneesChange(event.task, channelToPostTo);
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

  private async getDiscordChannelToPostTo(
    task: Task,
    channel: Discord.TextChannel,
    config: DiscordProjectIntegrationConfig
  ): Promise<Discord.TextBasedChannels | undefined> {
    const toChannel =
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL;
    const toThread =
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD;
    const toThreadPerTask =
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK;
    if (config.features.includes(toChannel)) {
      return channel;
    }

    if (config.features.includes(toThread) && !!config.threadId) {
      const thread = await channel.threads.fetch(config.threadId, {
        force: true,
      });
      return thread ?? undefined;
    }

    if (config.features.includes(toThreadPerTask)) {
      const discordThread = await task.discordChannel;
      if (!!discordThread?.deletedAt) return undefined;

      const existingThread = await this.getExistingDiscordThread(task, channel);
      if (!!existingThread) return existingThread;

      const shouldCreate = await this.shouldCreateThread(task);
      if (!shouldCreate) {
        this.logger.debug(
          `No previous thread exists and should not create a new thread (${JSON.stringify(
            task
          )})`
        );
        return;
      }

      return this.createDiscordThread(task, channel);
    }

    return undefined;
  }

  private async getProjectIntegration(
    projectId: string
  ): Promise<ProjectIntegration<ProjectIntegrationType.DISCORD>> {
    const integration = await this.projectIntegrationRepo.findOne({
      projectId,
      type: ProjectIntegrationType.DISCORD,
      deletedAt: IsNull(),
    });

    return integration as ProjectIntegration<ProjectIntegrationType.DISCORD>;
  }

  private async getDiscordId(userId: string): Promise<string | undefined> {
    const threepid = (await this.threepidService.findOne({
      userId,
      source: ThreepidSource.discord,
    })) as Threepid<ThreepidSource.discord>;
    return threepid?.threepid;
  }

  private async postDone(
    channel: Discord.TextBasedChannels,
    task: Task,
    shouldArchiveThread: boolean
  ) {
    await this.postTaskCard(channel, task, "Task completed!");
    if (channel.isThread() && shouldArchiveThread) {
      await channel.setArchived(true);
    }
  }

  private async postOwnerChange(
    task: Task,
    channel: Discord.TextBasedChannels
  ) {
    const owner = await task.owner;
    if (!owner) return;
    const ownerDiscordId = await this.getDiscordId(owner.id);

    await this.postTaskCard(
      channel,
      task,
      `${
        !!ownerDiscordId ? `<@${ownerDiscordId}>` : owner.username
      } added as the reviewer of the task`,
      !!ownerDiscordId ? [ownerDiscordId] : undefined
    );
  }

  private async postAssigneesChange(
    task: Task,
    channel: Discord.TextBasedChannels
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

    await this.postTaskCard(
      channel,
      task,
      `${assigneesString} assigned to the task`
    );
  }

  private async postMovedIntoReview(
    task: Task,
    channel: Discord.TextBasedChannels
  ) {
    const owner = !!task.ownerId
      ? await this.getDiscordId(task.ownerId)
      : undefined;

    const firstAssignee = task.assignees[0];
    await this.postTaskCard(
      channel,
      task,
      "Ready for review!",
      !!owner ? [owner] : undefined,
      !!firstAssignee
        ? {
            author: {
              name: firstAssignee.username,
              iconURL: firstAssignee.imageUrl,
              url: await this.permalink.get(firstAssignee),
            },
          }
        : undefined
    );
  }

  private async postInProgress(task: Task, channel: Discord.TextBasedChannels) {
    const threepids = await this.findTaskUserThreepids(task);
    // const intro = !!threepids.length
    //   ? `Hey ${threepids.map((t) => `<@${t.threepid}>`).join(", ")},`
    //   : "";

    await this.postTaskCard(
      channel,
      task,
      "Task moved to in progress!",
      !!threepids.length ? threepids.map((t) => t.threepid) : undefined
    );
    // await this.post(
    //   channel,
    //   `${intro} This task has been moved to the next stage.`.trim()
    // );
  }

  private async postTaskCard(
    channel: Discord.TextBasedChannels,
    task: Task,
    message: string,
    discordIdsToTag?: string[],
    embedOverride?: Partial<Discord.MessageEmbedOptions>
  ): Promise<void> {
    await this.post(channel, {
      content: discordIdsToTag?.map((id) => `<@${id}>`).join(" "),
      embeds: [
        {
          title: task.name,
          description: message,
          url: await this.permalink.get(task),
          ...embedOverride,
        },
      ],
    });
  }

  private async post(
    channel: Discord.TextBasedChannels,
    message: string | Discord.MessageOptions
  ): Promise<void> {
    this.logger.debug(
      `Sending message to channel: ${JSON.stringify({
        channelId: channel.id,
        message,
      })}`
    );
    if (channel.isThread() && channel.archived) {
      await channel.setArchived(false);
    }
    await channel.send(message);
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
    if (task.status === TaskStatus.IN_PROGRESS) return true;
    if (task.status === TaskStatus.IN_REVIEW) return true;
    if (!!task.assignees.length) return true;
    if (!!(await task.applications).length) return true;
    return false;
  }

  private async createDiscordThread(
    task: Task,
    channel: Discord.TextChannel
  ): Promise<Discord.ThreadChannel> {
    this.logger.debug(
      `Creating discord thread for task: ${JSON.stringify({
        taskId: task.id,
        channelId: channel.id,
      })}`
    );

    const thread = await channel.threads.create({
      name: task.name.length > 100 ? `${task.name.slice(0, 97)}...` : task.name,
      autoArchiveDuration: 1440,
    });

    const creator = await task.creator;
    await this.postTaskCard(
      thread,
      task,
      `Thread for Dework task "${task.name}"`,
      undefined,
      {
        author: !!creator
          ? {
              name: creator.username,
              iconURL: creator.imageUrl,
              url: await this.permalink.get(creator),
            }
          : undefined,
      }
    );

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
