import { Task, TaskStatus } from "@dewo/api/models/Task";
import _ from "lodash";
import moment from "moment";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Repository } from "typeorm";
import { formatFixed } from "@ethersproject/bignumber";
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
import {
  TaskApplicationCreatedEvent,
  TaskCreatedEvent,
  TaskSubmissionCreatedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
import Bluebird from "bluebird";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { gifs } from "../../app/config";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { TaskService } from "../../task/task.service";

@Injectable()
export class DiscordIntegrationService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly taskService: TaskService,
    private readonly threepidService: ThreepidService,
    @InjectRepository(DiscordChannel)
    private readonly discordChannelRepo: Repository<DiscordChannel>,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>
  ) {}

  async handle(
    event:
      | TaskUpdatedEvent
      | TaskCreatedEvent
      | TaskApplicationCreatedEvent
      | TaskSubmissionCreatedEvent
  ) {
    if (!!event.task.parentTaskId) return;
    const integration = await this.getProjectIntegration(event.task.projectId);
    if (!integration) return;
    const organizationIntegration =
      (await integration.organizationIntegration) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
    if (!organizationIntegration) return;

    try {
      this.logger.log(
        `Handle task event: ${JSON.stringify({
          type: event.constructor.name,
          ...event,
        })}`
      );
      this.logger.log(
        `Discord integration: ${JSON.stringify({
          orgIntId: organizationIntegration.id,
          orgConfig: organizationIntegration.config,
          projConfig: integration.config,
        })}`
      );
      if (event instanceof TaskUpdatedEvent) {
        const changed = _.reduce<Task, string[]>(
          event.task,
          (result, value, key) =>
            _.isEqual(value, event.prevTask[key as keyof Task])
              ? result
              : result.concat(key),
          []
        );
        this.logger.log(
          `Changed fields: ${JSON.stringify({
            fields: changed,
            values: _.pick(event.task, changed),
          })}`
        );
      }

      const {
        mainChannel,
        channelToPostTo,
        wasChannelToPostToJustCreated,
        guild,
      } = await this.getChannelFromTask(event.task);

      if (!mainChannel || !guild) return;

      if (
        event instanceof TaskCreatedEvent &&
        event.task.status === TaskStatus.TODO &&
        integration.config.features.includes(
          DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL
        )
      ) {
        const storyPoints = event.task.storyPoints;
        const dueDateString = !!event.task.dueDate
          ? moment(event.task.dueDate).format("dddd MMM Do")
          : undefined;
        const reward = event.task.reward;
        const hasAssignees = event.task.assignees.length;
        const url = await this.permalink.get(event.task);
        await this.postTaskCard(
          mainChannel,
          event.task,
          "New task created!",
          undefined,
          {
            description: [
              "_New task created!_",
              !!storyPoints ? `- ${storyPoints} task points` : undefined,
              !!reward
                ? `- Reward: ${await this.formatTaskReward(reward)}`
                : undefined,
              !!dueDateString ? `- Due: ${dueDateString}` : undefined,
              "---",
              !hasAssignees ? `👉 [Apply or grab task](${url})` : undefined,
            ]
              .filter((s) => !!s)
              .join("\n"),
          }
        );
      }

      if (!channelToPostTo) return;

      const statusChanged =
        event instanceof TaskCreatedEvent ||
        (event instanceof TaskUpdatedEvent &&
          event.task.status !== event.prevTask.status);
      this.logger.log(
        `Found Discord channel to post to: ${JSON.stringify({
          statusChanged,
          status: event.task.status,
        })}`
      );

      if (statusChanged && event.task.status === TaskStatus.IN_REVIEW) {
        await this.postMovedIntoReview(event.task, channelToPostTo);
      } else if (statusChanged && event.task.status === TaskStatus.DONE) {
        if (
          integration.config.features.includes(
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK
          )
        ) {
          await this.postDone(channelToPostTo, event.task);
        }

        const threepids = await this.findTaskUserThreepids(event.task);
        await mainChannel.send({
          embeds: [
            {
              title: event.task.name,
              description: `Task is now done! ${threepids
                .map((t) => `<@${t.threepid}>`)
                .join(" ")}`,
              url: await this.permalink.get(event.task),
              image: {
                url: gifs[Math.floor(Math.random() * gifs.length)],
              },
            },
          ],
        });
      } else if (event instanceof TaskUpdatedEvent) {
        if (event.task.ownerId !== event.prevTask.ownerId) {
          await this.postOwnerChange(event.task, channelToPostTo);
        }
        if (
          event.task.dueDate?.toUTCString() !==
          event.prevTask.dueDate?.toUTCString()
        ) {
          await this.postDueDateChange(event.task, channelToPostTo);
        }

        const assigneeIds = event.task.assignees.map((u) => u.id).sort();
        const prevAssigneeIds = event.prevTask.assignees
          .map((u) => u.id)
          .sort();
        if (!_.isEqual(assigneeIds, prevAssigneeIds)) {
          await this.postAssigneesChange(event.task, channelToPostTo);
        }
      } else if (event instanceof TaskCreatedEvent) {
        if (!!event.task.assignees.length) {
          await this.postAssigneesChange(event.task, channelToPostTo);
        } else if (wasChannelToPostToJustCreated) {
          await this.postDefaultInitialMessage(event.task, channelToPostTo);
        }
      } else if (event instanceof TaskSubmissionCreatedEvent) {
        await this.postTaskSubmissionCreated(
          event.task,
          event.submission,
          channelToPostTo
        );
      } else if (event instanceof TaskApplicationCreatedEvent) {
        await this.postTaskApplicationCreated(
          event.task,
          event.application,
          channelToPostTo
        );
      }

      if (channelToPostTo.isThread()) {
        await this.addTaskUsersToDiscordThread(
          event.task,
          channelToPostTo,
          guild
        );
      }

      // write about task applicant updates (should that be done elsewhere maybe?)
    } catch (error) {
      console.error(error);
      const errorString = JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      );
      this.logger.error(
        `Unknown error: ${JSON.stringify({ event, errorString })}`
      );
    }
  }

  public async createTaskDiscordLink(
    taskId: string,
    user?: User
  ): Promise<string> {
    const task = await this.taskService.findById(taskId);
    if (!task) throw new NotFoundException("Task not found");
    const { channelToPostTo, guild } = await this.getChannelFromTask(task);

    if (!channelToPostTo) {
      throw new NotFoundException(
        "Discord channel to post to not found or created"
      );
    }

    if (channelToPostTo.isThread() && channelToPostTo.archived) {
      channelToPostTo.setArchived(false);
    }

    await this.postDefaultInitialMessage(task, channelToPostTo);

    const discordId = !!user ? await this.getDiscordId(user.id) : undefined;
    if (channelToPostTo.isThread() && !!discordId) {
      const member = await guild?.members.fetch({
        user: discordId,
        force: true,
      });
      if (!!member) await channelToPostTo.members.add(member.user.id);
    }

    return `https://discord.com/channels/${channelToPostTo.guildId}/${channelToPostTo.id}`;
  }

  private async getDiscordChannelToPostTo(
    task: Task,
    channel: Discord.TextChannel,
    config: DiscordProjectIntegrationConfig,
    forceCreate: boolean = false
  ): Promise<{
    channel: Discord.TextChannel | Discord.ThreadChannel | undefined;
    new: boolean;
  }> {
    const toChannel =
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL;
    const toThread =
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD;
    const toThreadPerTask =
      DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK;
    if (config.features.includes(toChannel)) {
      return { channel, new: false };
    }

    if (config.features.includes(toThread) && !!config.threadId) {
      this.discord.client.channels.cache.delete(config.threadId);
      const thread = await channel.threads.fetch(config.threadId);
      return { channel: thread ?? undefined, new: false };
    }

    if (config.features.includes(toThreadPerTask)) {
      const existingThread = await this.getExistingDiscordThread(task, channel);
      if (!!existingThread) return { channel: existingThread, new: false };

      const shouldCreate = await this.shouldCreateThread(task);
      if (!shouldCreate && !forceCreate) {
        this.logger.debug(
          `No previous thread exists and should not create a new thread (${JSON.stringify(
            task
          )})`
        );
        return { channel: undefined, new: false };
      }

      return {
        channel: await this.createDiscordThread(task, channel),
        new: true,
      };
    }

    return { channel: undefined, new: false };
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

  private async postDone(channel: Discord.TextBasedChannels, task: Task) {
    await this.postTaskCard(channel, task, "☑️ Task completed!");
    if (channel.isThread()) {
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

  private async postDueDateChange(
    task: Task,
    channel: Discord.TextBasedChannels
  ) {
    const owner = await task.owner;
    if (!owner) return;
    const ownerDiscordId = await this.getDiscordId(owner.id);

    const message = !!task.dueDate
      ? `⏳ Due date updated to ${moment(task.dueDate).format("dddd MMM Do")}`
      : "⌛️ Due date removed";

    await this.postTaskCard(
      channel,
      task,
      message,
      !!ownerDiscordId ? [ownerDiscordId] : undefined
    );
  }

  private async postDefaultInitialMessage(
    task: Task,
    channel: Discord.TextBasedChannels
  ) {
    const creator = await task.creator;
    await this.postTaskCard(
      channel,
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
      "🦋 Ready for review!",
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

  public async postReviewRequest(task: Task) {
    const { channelToPostTo } = await this.getChannelFromTask(task);
    if (!channelToPostTo) return;
    const owner = !!task.ownerId
      ? await this.getDiscordId(task.ownerId)
      : undefined;
    const firstAssignee = task.assignees?.[0];
    await this.postTaskCard(
      channelToPostTo,
      task,
      "🦋 Ready for another review!",
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

  public async postReviewSubmittal(taskId: string, approved: boolean) {
    const task = await this.taskService.findById(taskId);
    if (!task) return;
    const { channelToPostTo } = await this.getChannelFromTask(task);
    if (!channelToPostTo) return;
    const firstAssignee = task.assignees?.[0];
    const assignees = await this.findTaskUserThreepids(task, false);
    const reviewMessage = approved
      ? "PR approved!"
      : "📬 A review was submitted in Github!";
    await this.postTaskCard(
      channelToPostTo,
      task,
      reviewMessage,
      assignees.map((t) => t.threepid),
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

  private async getChannelFromTask(task: Task): Promise<{
    mainChannel: Discord.TextChannel | undefined;
    channelToPostTo: Discord.TextChannel | Discord.ThreadChannel | undefined;
    wasChannelToPostToJustCreated: boolean;
    guild: Discord.Guild | undefined;
  }> {
    const integration = await this.getProjectIntegration(task.projectId);
    if (!integration)
      return {
        mainChannel: undefined,
        channelToPostTo: undefined,
        wasChannelToPostToJustCreated: false,
        guild: undefined,
      };
    const organizationIntegration =
      (await integration.organizationIntegration) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
    if (!organizationIntegration)
      return {
        mainChannel: undefined,
        channelToPostTo: undefined,
        wasChannelToPostToJustCreated: false,
        guild: undefined,
      };

    const guild = await this.discord.client.guilds.fetch(
      organizationIntegration.config.guildId
    );
    await guild.roles.fetch();

    this.logger.debug(
      `Found Discord guild: ${JSON.stringify({ guildId: guild.id })}`
    );

    const mainChannel = (await guild.channels.fetch(
      integration.config.channelId,
      {
        force: true,
      }
    )) as Discord.TextChannel;

    if (!mainChannel) {
      this.logger.warn(
        `Could not find Discord channel (${JSON.stringify(integration.config)})`
      );
      return {
        mainChannel: undefined,
        channelToPostTo: undefined,
        wasChannelToPostToJustCreated: false,
        guild,
      };
    }

    const { channel: channelToPostTo, new: wasChannelToPostToJustCreated } =
      await this.getDiscordChannelToPostTo(
        task,
        mainChannel,
        integration.config
      );
    this.logger.log(
      `Found Discord channel to post to: ${JSON.stringify({
        channelToPostToId: channelToPostTo?.id,
        integration: integration.config,
        isThread: channelToPostTo?.isThread(),
      })}`
    );
    return {
      mainChannel,
      channelToPostTo,
      wasChannelToPostToJustCreated,
      guild,
    };
  }

  private async postTaskApplicationCreated(
    task: Task,
    application: TaskApplication,
    channel: Discord.TextBasedChannels
  ) {
    const owner = !!task.ownerId
      ? await this.getDiscordId(task.ownerId)
      : undefined;
    const applicant = await application.user;
    await this.postTaskCard(
      channel,
      task,
      "🙋 New applicant!",
      !!owner ? [owner] : undefined,
      !!applicant
        ? {
            author: {
              name: applicant.username,
              iconURL: applicant.imageUrl,
              url: await this.permalink.get(applicant),
            },
          }
        : undefined
    );
  }

  private async postTaskSubmissionCreated(
    task: Task,
    submission: TaskSubmission,
    channel: Discord.TextBasedChannels
  ) {
    const owner = !!task.ownerId
      ? await this.getDiscordId(task.ownerId)
      : undefined;
    const submitter = await submission.user;
    await this.postTaskCard(
      channel,
      task,
      "✉️ New submission!",
      !!owner ? [owner] : undefined,
      !!submitter
        ? {
            author: {
              name: submitter.username,
              iconURL: submitter.imageUrl,
              url: await this.permalink.get(submitter),
            },
          }
        : undefined
    );
  }

  private async postTaskCard(
    channel: Discord.TextBasedChannels,
    task: Task,
    message: string,
    discordIdsToTag?: string[],
    embedOverride?: Partial<Discord.MessageEmbedOptions>
  ): Promise<void> {
    await this.post(channel, {
      content: discordIdsToTag?.length
        ? discordIdsToTag.map((id) => `<@${id}>`).join(" ")
        : " ",
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
    const sentMessage = await channel.send(message);
    this.logger.debug(
      `Sent message to channel: ${JSON.stringify({
        channelId: channel.id,
        sentMessage,
      })}`
    );
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
    if (!existing) {
      this.logger.debug(
        `No existing Discord thread record found: ${JSON.stringify({
          taskId: task.id,
        })}`
      );
      return undefined;
    }

    try {
      this.discord.client.channels.cache.delete(existing.channelId);
      const thread = await channel.threads.fetch(existing.channelId);

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
      await this.discordChannelRepo.delete({ taskId: task.id });
      return undefined;
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
    task: Task,
    includeOwner = true
  ): Promise<Threepid<ThreepidSource.discord>[]> {
    const userIds = _([
      ...(includeOwner ? [await task.owner] : []),
      ...(task.assignees ?? []),
    ])
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

  private async formatTaskReward(reward: TaskReward): Promise<string> {
    const token = await reward.token;
    return [formatFixed(reward.amount, token.exp), token.symbol].join(" ");
  }
}
