import { Task, TaskStatus } from "@dewo/api/models/Task";
import _ from "lodash";
import moment from "moment";
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
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
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { TaskService } from "../../task/task.service";
import { IntegrationService } from "../integration.service";
import { RbacService } from "@dewo/api/modules/rbac/rbac.service";
import { RoleSource } from "@dewo/api/models/rbac/Role";
import { TaskGatingType } from "@dewo/api/models/enums/TaskGatingType";
import { getMarkdownImages } from "@dewo/api/utils/markdown";
import {
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
} from "../../payment/payment.events";

const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.COMMUNITY_SUGGESTIONS]: "Community Suggestions",
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]: "In Review",
  [TaskStatus.DONE]: "Done",
};

export enum DiscordGuildMembershipState {
  MEMBER = "MEMBER",
  HAS_SCOPE = "HAS_SCOPE",
  MISSING_SCOPE = "MISSING_SCOPE",
}

@Injectable()
export class DiscordIntegrationService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly taskService: TaskService,
    private readonly threepidService: ThreepidService,
    private readonly integrationService: IntegrationService,
    private readonly rbacService: RbacService,
    @InjectRepository(DiscordChannel)
    private readonly discordChannelRepo: Repository<DiscordChannel>
  ) {}

  async handlePayment(
    event: PaymentCreatedEvent | PaymentConfirmedEvent,
    task: Task
  ) {
    const integrations = await this.integrationService.findProjectIntegrations(
      task.projectId,
      ProjectIntegrationType.DISCORD
    );

    this.logger.log(
      `Handle task payment event: ${JSON.stringify({
        type: event.constructor.name,
        task,
        ...event,
      })}`
    );

    for (const integration of integrations) {
      if (event instanceof PaymentCreatedEvent) {
        const { channelToPostTo } = await this.getChannelFromTask(
          task,
          integration,
          true
        );
        if (
          channelToPostTo &&
          integration.config.features.includes(
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK
          )
        ) {
          await this.postPaymentStarted(channelToPostTo, task);
        }
        return;
      } else if (event instanceof PaymentConfirmedEvent) {
        const { channelToPostTo } = await this.getChannelFromTask(
          task,
          integration,
          true
        );
        if (
          channelToPostTo &&
          integration.config.features.includes(
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK
          )
        ) {
          await this.postPaymentComplete(channelToPostTo, task);
          await this.postDone(channelToPostTo, task);
        }
        return;
      }
    }
  }

  async handle(
    event:
      | TaskUpdatedEvent
      | TaskCreatedEvent
      | TaskApplicationCreatedEvent
      | TaskSubmissionCreatedEvent
  ) {
    const integrations = await this.integrationService.findProjectIntegrations(
      event.task.projectId,
      ProjectIntegrationType.DISCORD
    );

    for (const integration of integrations) {
      if (
        !integration.config.features.includes(
          DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE
        )
      ) {
        await this.handleIntegration(event, integration);
      }
    }
  }

  async handleIntegration(
    event:
      | TaskUpdatedEvent
      | TaskCreatedEvent
      | TaskApplicationCreatedEvent
      | TaskSubmissionCreatedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>
  ) {
    const task = (await this.taskService.findById(event.task.id)) as Task;
    if (!!task.parentTaskId) return;
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
          task,
          (result, value, key) =>
            _.isEqual(value, event.prevTask[key as keyof Task])
              ? result
              : result.concat(key),
          []
        );
        this.logger.log(
          `Changed fields: ${JSON.stringify({
            fields: changed,
            values: _.pick(task, changed),
          })}`
        );
      }

      const shouldCreateChannelIfNotExists = await (async () => {
        if (event instanceof TaskApplicationCreatedEvent) return true;
        if (event instanceof TaskSubmissionCreatedEvent) return true;
        if (task.status === TaskStatus.IN_PROGRESS) return true;
        if (task.status === TaskStatus.IN_REVIEW) return true;
        if (!!task.assignees.length) return true;
        if (!!(await task.applications).length) return true;
        return false;
      })();

      const {
        mainChannel,
        channelToPostTo,
        guild,
        wasChannelToPostToJustCreated,
      } = await this.getChannelFromTask(
        task,
        integration,
        shouldCreateChannelIfNotExists
      );

      if (!mainChannel || !guild) {
        this.logger.warn(
          `No main channel or guild found: ${JSON.stringify({
            mainChannel,
            guild,
            integration,
          })}`
        );
        return;
      }

      if (
        event instanceof TaskCreatedEvent &&
        task.status === TaskStatus.TODO &&
        integration.config.features.includes(
          DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL
        )
      ) {
        const storyPoints = task.storyPoints;
        const dueDateString = !!task.dueDate
          ? moment(task.dueDate).format("dddd MMM Do")
          : undefined;
        const reward = task.reward;
        const hasAssignees = task.assignees.length;
        const url = await this.permalink.get(task);
        const discordRoleIdsToTag = await this.getDiscordRoleIdsForTask(task);

        await this.postTaskCard(
          mainChannel,
          task,
          "New task created!",
          undefined,
          {
            description: [
              "_New task created!_",
              !!storyPoints ? `- ${storyPoints} task points` : undefined,
              !!reward
                ? `- Reward: ${await this.taskService.formatTaskReward(reward)}`
                : undefined,
              !!dueDateString ? `- Due: ${dueDateString}` : undefined,
              "---",
              !hasAssignees ? `👉 [Apply or grab task](${url})` : undefined,
            ]
              .filter((s) => !!s)
              .join("\n"),
          },
          [],
          discordRoleIdsToTag
        );
      }

      const statusChanged =
        event instanceof TaskCreatedEvent ||
        (event instanceof TaskUpdatedEvent &&
          task.status !== event.prevTask.status);
      const isPostDoneMessageIntegration = integration.config.features.every(
        (f: DiscordProjectIntegrationFeature) =>
          [
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL,
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD,
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
          ].includes(f)
      );

      if (
        statusChanged &&
        isPostDoneMessageIntegration &&
        task.status === TaskStatus.DONE
      ) {
        const threepids = await this.findTaskUserThreepids(task);
        await mainChannel.send({
          embeds: [
            {
              title: task.name,
              description: `Task is now done! ${threepids
                .map((t) => `<@${t.threepid}>`)
                .join(" ")}`,
              url: await this.permalink.get(task),
            },
          ],
        });
      }

      if (!channelToPostTo) {
        this.logger.warn(
          `No channel to post to found: ${JSON.stringify({ integration })}`
        );
        return;
      }

      if (wasChannelToPostToJustCreated) {
        await this.postDefaultInitialMessage(task, channelToPostTo);
      } else if (statusChanged && task.status === TaskStatus.IN_REVIEW) {
        await this.postMovedIntoReview(task, channelToPostTo);
      } else if (statusChanged && task.status === TaskStatus.DONE) {
        if (
          integration.config.features.includes(
            DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK
          ) &&
          !task.reward
        ) {
          await this.postDone(channelToPostTo, task);
        }
      } else if (event instanceof TaskUpdatedEvent) {
        const ownerIds = task.owners.map((u) => u.id).sort();
        const prevOwnerIds = event.prevTask.owners.map((u) => u.id).sort();
        if (!_.isEqual(ownerIds, prevOwnerIds)) {
          await this.postOwnerChange(task, channelToPostTo);
        }

        if (
          task.dueDate?.toUTCString() !== event.prevTask.dueDate?.toUTCString()
        ) {
          await this.postDueDateChange(task, channelToPostTo);
        }

        const assigneeIds = task.assignees.map((u) => u.id).sort();
        const prevAssigneeIds = event.prevTask.assignees
          .map((u) => u.id)
          .sort();
        if (!_.isEqual(assigneeIds, prevAssigneeIds)) {
          await this.postAssigneesChange(task, channelToPostTo);
        }
      } else if (event instanceof TaskSubmissionCreatedEvent) {
        await this.postTaskSubmissionCreated(
          task,
          event.submission,
          channelToPostTo
        );
      } else if (event instanceof TaskApplicationCreatedEvent) {
        await this.postTaskApplicationCreated(
          task,
          event.application,
          channelToPostTo
        );
      }

      if (channelToPostTo.isThread()) {
        await this.addTaskUsersToDiscordThread(task, channelToPostTo, guild);
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
    const integration = await this.getNonStatusBoardMessageChannel(
      task.projectId
    );
    if (!integration) throw new NotFoundException("Integration not found");
    const { channelToPostTo, guild } = await this.getChannelFromTask(
      task,
      integration,
      true
    );

    if (!channelToPostTo) {
      throw new NotFoundException(
        "Discord channel to post to not found or created"
      );
    }

    if (channelToPostTo.isThread() && channelToPostTo.archived) {
      channelToPostTo.setArchived(false);
    }

    const [discordId] = !!user
      ? await this.discord.getDiscordIds([user.id])
      : [];
    if (!discordId) {
      throw new Error("User is not connected to Discord");
    }

    const member = await guild?.members
      .fetch({ user: discordId, force: true })
      .catch(() => undefined);
    if (!member) {
      throw new Error("You need to be part of the DAO's Discord server");
    }

    // Note(fant): for private channels, this will return false for the Discord guild owner...
    const canView = channelToPostTo
      .permissionsFor(member.user.id)
      ?.has("VIEW_CHANNEL");
    if (!canView) {
      throw new ForbiddenException({
        reason: "NO_ACCESS_TO_CHANNEL",
        message:
          "This task is being discussed in a private Discord thread. To get access, reach out to the DAO's core team.",
      });
    }

    if (channelToPostTo.isThread()) {
      await channelToPostTo.members.add(member.user.id);
    }

    return `https://discord.com/channels/${channelToPostTo.guildId}/${channelToPostTo.id}`;
  }

  public async getDiscordGuildMembershipState(
    organizationId: string,
    userId: string
  ): Promise<DiscordGuildMembershipState> {
    this.logger.debug(
      `Adding user to Discord guild: ${JSON.stringify({
        userId,
        organizationId,
      })}`
    );
    const integration =
      await this.integrationService.findOrganizationIntegration(
        organizationId,
        OrganizationIntegrationType.DISCORD
      );

    if (
      !integration ||
      integration.config.useTempDiscordBot ||
      integration.config.useTempDiscordBot2
    ) {
      return DiscordGuildMembershipState.MEMBER;
    }

    const discordThreepid = (await this.threepidService.findOne({
      userId,
      source: ThreepidSource.discord,
    })) as Threepid<ThreepidSource.discord>;
    if (!discordThreepid) {
      return DiscordGuildMembershipState.MISSING_SCOPE;
    }

    const guild = await this.discord
      .getClient(integration)
      .guilds.fetch(integration.config.guildId)
      .catch(() => undefined);
    if (!guild) return DiscordGuildMembershipState.MEMBER;

    try {
      await guild.members.fetch(discordThreepid.threepid);
      return DiscordGuildMembershipState.MEMBER;
    } catch (error) {
      const { scope } = await this.discord.refreshAccessToken(discordThreepid);
      if (scope.includes("guilds.join")) {
        return DiscordGuildMembershipState.HAS_SCOPE;
      }

      return DiscordGuildMembershipState.MISSING_SCOPE;
    }
  }

  public async addUserToDiscordGuild(
    organizationId: string,
    userId: string
  ): Promise<void> {
    this.logger.debug(
      `Adding user to Discord guild: ${JSON.stringify({
        userId,
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

    const discordThreepid = (await this.threepidService.findOne({
      userId,
      source: ThreepidSource.discord,
    })) as Threepid<ThreepidSource.discord>;
    if (!discordThreepid) {
      throw new NotFoundException("User has no connected Discord account");
    }

    const { accessToken } = await this.discord.refreshAccessToken(
      discordThreepid
    );
    const guild = await this.discord
      .getClient(integration)
      .guilds.fetch(integration.config.guildId);

    await guild.members.add(discordThreepid.threepid, {
      accessToken,
    });
  }

  private async getDiscordChannelToPostTo(
    task: Task,
    channel: Discord.TextChannel,
    config: DiscordProjectIntegrationConfig,
    organizationIntegration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>,
    shouldCreateIfNotExists: boolean = false
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
      this.discord
        .getClient(organizationIntegration)
        .channels.cache.delete(config.threadId);
      const thread = await channel.threads.fetch(config.threadId);
      return { channel: thread ?? undefined, new: false };
    }

    if (config.features.includes(toThreadPerTask)) {
      const existingThread = await this.getExistingDiscordThread(
        task,
        channel,
        organizationIntegration
      );
      if (!!existingThread) return { channel: existingThread, new: false };

      if (!shouldCreateIfNotExists) {
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

  private async postPaymentStarted(
    channel: Discord.TextBasedChannel,
    task: Task
  ) {
    const discordIds = await this.discord.getDiscordIds(
      task.assignees.map((u) => u.id)
    );
    await this.postTaskCard(
      channel,
      task,
      "Payment is now processing...",
      discordIds.filter((id): id is string => !!id)
    );
  }

  private async postPaymentComplete(
    channel: Discord.TextBasedChannel,
    task: Task
  ) {
    const discordIds = await this.discord.getDiscordIds(
      task.assignees.map((u) => u.id)
    );
    await this.postTaskCard(
      channel,
      task,
      "💰 Payment confirmed!",
      discordIds.filter((id): id is string => !!id)
    );
  }

  private async postDone(channel: Discord.TextBasedChannel, task: Task) {
    await this.postTaskCard(channel, task, "✅ Task completed!");
    if (channel.isThread()) {
      await channel.setArchived(true);
    }
  }

  private async postOwnerChange(task: Task, channel: Discord.TextBasedChannel) {
    const ownerDiscordIds = await this.discord.getDiscordIds(
      task.owners.map((u) => u.id)
    );
    if (!ownerDiscordIds.length) return;

    const ownersString = task.owners
      .map((u, i) =>
        !!ownerDiscordIds[i] ? `<@${ownerDiscordIds[i]}>` : u.username
      )
      .join(", ");
    await this.postTaskCard(
      channel,
      task,
      task.owners.length === 1
        ? `Task reviewer updated to ${ownersString}`
        : `Task reviewers updated to ${ownersString}`,
      ownerDiscordIds.filter((id): id is string => !!id)
    );
  }

  private async postAssigneesChange(
    task: Task,
    channel: Discord.TextBasedChannel
  ) {
    if (!task.assignees.length) return;
    const discordIds = await this.discord.getDiscordIds(
      task.assignees.map((u) => u.id)
    );
    const assigneesString = task.assignees
      .map((u, index) =>
        !!discordIds[index] ? `<@${discordIds[index]}>` : u.username
      )
      .join(", ");

    await this.postTaskCard(
      channel,
      task,
      `${assigneesString} assigned to the task`,
      discordIds.filter((id): id is string => !!id)
    );
  }

  private async postDueDateChange(
    task: Task,
    channel: Discord.TextBasedChannel
  ) {
    const ownerDiscordIds = await this.discord
      .getDiscordIds(task.owners.map((u) => u.id))
      .then((ids) => ids.filter((id): id is string => !!id));
    if (!ownerDiscordIds.length) return;

    const message = !!task.dueDate
      ? `⏳ Due date updated to ${moment(task.dueDate).format("dddd MMM Do")}`
      : "⌛️ Due date removed";

    await this.postTaskCard(channel, task, message, ownerDiscordIds);
  }

  private async postDefaultInitialMessage(
    task: Task,
    channel: Discord.TextBasedChannel
  ) {
    const project = await task.project,
      subtasks = await Promise.all(
        (
          await task.subtasks
        ).map(async (s) => ({
          name: s.name,
          url: await this.permalink.get(s),
        }))
      );

    const topData = [
      { name: "Status", value: STATUS_LABEL[task.status] },
      {
        name: "Due date",
        value: task.dueDate && moment(task.dueDate).format("DD/MM/YYYY"),
      },
      {
        name: "Task points",
        value: task.storyPoints,
      },
      {
        name: "Reward",
        value:
          task.reward && (await this.taskService.formatTaskReward(task.reward)),
      },
      {
        name: "Assignee",
        value: (await this.findTaskUserThreepids(task, false))
          .map((threepid) => `<@${threepid.threepid}>`)
          .join(", "),
        // Dework usernames with profile link:
        // value: task.assignees
        //   .map((u) => `[${u.username}](${this.permalink.get(u)})`)
        //   .join(", "),
      },
    ].filter(({ value }) => value != null);

    const fields = [
      {
        name: "Subtasks",
        value: subtasks.map((st) => `- [${st.name}](${st.url})`).join("\n"),
      },
    ].filter(({ value }) => !!value);

    await this.postTaskCard(
      channel,
      task,
      `${topData.map((d) => `**${d.name}**: ${d.value}`).join("\n")}\n\n${
        task.description
      }`,
      undefined,
      {
        author: { name: project.name, url: await this.permalink.get(project) },
        fields,
      }
    );
  }

  private async postMovedIntoReview(
    task: Task,
    channel: Discord.TextBasedChannel
  ) {
    const ownerDiscordIds = await this.discord
      .getDiscordIds(task.owners.map((u) => u.id))
      .then((ids) => ids.filter((id): id is string => !!id));
    const firstAssignee = task.assignees[0];
    await this.postTaskCard(
      channel,
      task,
      "📭 Ready for review!",
      ownerDiscordIds,
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

  public async postReviewRequest(task: Task, githubUrl: string) {
    const integration = await this.getNonStatusBoardMessageChannel(
      task.projectId
    );
    if (!integration) return;
    const { channelToPostTo } = await this.getChannelFromTask(
      task,
      integration
    );
    if (!channelToPostTo) return;
    const ownerDiscordIds = await this.discord
      .getDiscordIds(task.owners.map((u) => u.id))
      .then((ids) => ids.filter((id): id is string => !!id));
    const firstAssignee = task.assignees?.[0];
    await this.postTaskCard(
      channelToPostTo,
      task,
      `📭 Review re-requested in Github!\n\n${githubUrl}`,
      ownerDiscordIds,
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

  public async postReviewSubmittal(
    taskId: string,
    githubUrl: string,
    approved: boolean
  ) {
    const task = await this.taskService.findById(taskId);
    if (!task) return;
    const integration = await this.getNonStatusBoardMessageChannel(
      task.projectId
    );
    if (!integration) return;
    const { channelToPostTo } = await this.getChannelFromTask(
      task,
      integration
    );
    if (!channelToPostTo) return;
    const firstAssignee = task.assignees?.[0];
    const assignees = await this.findTaskUserThreepids(task, false);
    const reviewMessage = approved
      ? "PR approved!"
      : `📬 A review was submitted in Github!\n\n${githubUrl}`;
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

  private async getDiscordRoleIdsForTask(task: Task): Promise<string[]> {
    // Note(fant): only enable this for the Dework development project for now
    if (task.projectId !== "cdba0597-6aed-4fd3-a3da-2c1c2b45912d") return [];
    if (task.gating !== TaskGatingType.ROLES) {
      return [];
    }
    const roles = await this.rbacService.findRolesForTask(
      task.id,
      RoleSource.DISCORD
    );
    return roles.map((r) => r.externalId).filter((id): id is string => !!id);
  }

  private async getChannelFromTask(
    task: Task,
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>,
    shouldCreateIfNotExists?: boolean
  ): Promise<{
    mainChannel: Discord.TextChannel | undefined;
    channelToPostTo: Discord.TextChannel | Discord.ThreadChannel | undefined;
    wasChannelToPostToJustCreated: boolean;
    guild: Discord.Guild | undefined;
  }> {
    const organizationIntegration =
      (await integration.organizationIntegration) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
    if (!organizationIntegration) {
      return {
        mainChannel: undefined,
        channelToPostTo: undefined,
        wasChannelToPostToJustCreated: false,
        guild: undefined,
      };
    }

    const guild = await this.discord
      .getClient(organizationIntegration)
      .guilds.fetch({
        guild: organizationIntegration.config.guildId,
        force: true,
      });
    await guild.roles.fetch();

    this.logger.debug(
      `Found Discord guild: ${JSON.stringify({ guildId: guild.id })}`
    );

    const mainChannel = (await guild.channels
      .fetch(integration.config.channelId, { force: true })
      .catch(() => null)) as Discord.TextChannel;

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
        integration.config,
        organizationIntegration,
        shouldCreateIfNotExists
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
    channel: Discord.TextBasedChannel
  ) {
    const ownerDiscordIds = await this.discord
      .getDiscordIds(task.owners.map((u) => u.id))
      .then((ids) => ids.filter((id): id is string => !!id));
    const applicant = await application.user;
    await this.postTaskCard(
      channel,
      task,
      "🙋 New applicant!",
      ownerDiscordIds,
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
    channel: Discord.TextBasedChannel
  ) {
    const ownerDiscordIds = await this.discord
      .getDiscordIds(task.owners.map((u) => u.id))
      .then((ids) => ids.filter((id): id is string => !!id));
    const submitter = await submission.user;
    const images = getMarkdownImages(submission.content);
    await this.postTaskCard(
      channel,
      task,
      `✉️ New submission!${
        images.length > 0
          ? `\n\n[${images.length} ${
              images.length === 1 ? "image" : "images"
            } attached](${await this.permalink.get(task)})`
          : ""
      }`,
      ownerDiscordIds,
      !!submitter
        ? {
            author: {
              name: submitter.username,
              iconURL: submitter.imageUrl,
              url: await this.permalink.get(submitter),
            },
          }
        : undefined,
      images.slice(0, 4)
    );
  }

  private async postTaskCard(
    channel: Discord.TextBasedChannel,
    task: Task,
    message: string,
    discordIdsToTag?: string[],
    embedOverride?: Partial<Discord.MessageEmbedOptions>,
    images: string[] = [],
    discordRoleIdsToTag?: string[]
  ): Promise<void> {
    const url = await this.permalink.get(task);
    const tags = [
      ...(discordIdsToTag || []).map((id) => `<@${id}>`),
      ...(discordRoleIdsToTag || []).map((id) => `<@&${id}>`),
    ];
    const content = tags.length ? tags.join(" ") : " ";
    await this.post(channel, {
      content,
      embeds: [
        {
          title: task.name,
          description: message,
          url,
          image: images ? { url: images[0] } : undefined,
          ...embedOverride,
        },
        // Sending rest of images as separate "embeds" (but same URL) will
        // allow including up to 4 images in one embed.
        ...(images.length > 1
          ? images?.slice(1, 4).map((a) => ({ image: { url: a }, url }))
          : []),
      ],
    });
  }

  private async post(
    channel: Discord.TextBasedChannel,
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
    channel: Discord.TextChannel,
    organizationIntegration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>
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
      this.discord
        .getClient(organizationIntegration)
        .channels.cache.delete(existing.channelId);
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

    await channel
      .setDefaultAutoArchiveDuration(
        channel.guild.features.includes("SEVEN_DAY_THREAD_ARCHIVE")
          ? 10080
          : channel.guild.features.includes("THREE_DAY_THREAD_ARCHIVE")
          ? 4320
          : 1440
      )
      .catch(() => {});
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
    includeOwners = true
  ): Promise<Threepid<ThreepidSource.discord>[]> {
    const userIds = _([
      ...(includeOwners ? task.owners : []),
      ...task.assignees,
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

  private async getNonStatusBoardMessageChannel(
    projectId: string
  ): Promise<ProjectIntegration<ProjectIntegrationType.DISCORD> | undefined> {
    const integrations = await this.integrationService.findProjectIntegrations(
      projectId,
      ProjectIntegrationType.DISCORD
    );
    return integrations.find((i) =>
      i.config.features.some((f) =>
        [
          DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_CHANNEL,
          DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD,
          DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
        ].includes(f)
      )
    );
  }
}
