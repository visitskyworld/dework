import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import _ from "lodash";
import Bluebird from "bluebird";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  In,
  Repository,
} from "typeorm";
import {
  ProjectIntegration,
  ProjectIntegrationSource,
} from "@dewo/api/models/ProjectIntegration";
import { DiscordService } from "./discord.service";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import * as Discord from "discord.js";
import { DiscordChannel } from "@dewo/api/models/DiscordChannel";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import { ThreepidService } from "../../threepid/threepid.service";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import encoder from "uuid-base62";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { TaskUpdatedEvent } from "../../task/task-updated.event";

@Injectable()
@EventSubscriber()
@EventsHandler(TaskUpdatedEvent)
export class DiscordIntegrationService
  implements EntitySubscriberInterface<Task>, IEventHandler<TaskUpdatedEvent>
{
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly threepidService: ThreepidService,
    @InjectRepository(DiscordChannel)
    private readonly discordChannelRepo: Repository<DiscordChannel>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    private readonly config: ConfigService<ConfigType>,
    @InjectConnection() readonly connection: Connection
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Task;
  }

  /*
  async afterInsert(event: InsertEvent<Task>) {
    const task = await this.getTask(event.entity.id, event.manager);
    if (!task) return;

    const integration = await this.getProjectIntegration(task.projectId);
    if (!integration) return;

    this.logger.debug(
      `Task.afterInsert: ${JSON.stringify({
        taskId: task.id,
        projectId: task.projectId,
        integrationId: integration.id,
        config: integration.config,
      })}`
    );

    const guild = await this.discord.client.guilds.fetch(
      integration.config.guildId
    );
    await guild.roles.fetch();

    this.logger.debug(
      `Found Discord guild: ${JSON.stringify({ guildId: guild.id })}`
    );

    const category = await this.getOrCreateCategory(guild);
    const channel = await this.getOrCreateChannel(task, guild, category);

    if (!!channel) {
      await this.addRelevantUsersToTaskDiscordChannel(task, channel, guild);
    }
  }
  */

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

  async handle({ oldTask, newTask }: TaskUpdatedEvent) {
    if (process.env.NODE_ENV === "test") return;

    const task = await this.taskRepo.findOne({ id: newTask.id });
    if (!task) return;

    const integration = await this.getProjectIntegration(task.projectId);
    if (!integration) return;

    this.logger.debug(
      `Task.afterUpdate: ${JSON.stringify({
        taskId: task.id,
        projectId: task.projectId,
        integrationId: integration.id,
        config: integration.config,
      })}`
    );

    const guild = await this.discord.client.guilds.fetch(
      integration.config.guildId
    );
    await guild.roles.fetch();

    this.logger.debug(
      `Found Discord guild: ${JSON.stringify({ guildId: guild.id })}`
    );

    const category = await this.getOrCreateCategory(guild);
    const channel = await this.getOrCreateChannel(task, guild, category);

    if (!!channel) {
      await this.addRelevantUsersToTaskDiscordChannel(task, channel, guild);
    }

    await this.updateMessageStatus(oldTask, task);
  }

  private async updateMessageStatus(oldTask: Task, newTask: Task) {
    // New applicant added
    if (
      newTask.assignees &&
      newTask.assignees.length > oldTask?.assignees?.length
    ) {
      this.postNewAssignee(newTask);
    }

    const statusChanged = oldTask.status !== newTask.status;
    if (statusChanged) {
      switch (newTask.status) {
        case TaskStatusEnum.IN_PROGRESS:
          this.postInProgress(newTask);
          break;
        case TaskStatusEnum.IN_REVIEW:
          this.postMovedIntoReview(newTask);
          break;
        case TaskStatusEnum.DONE:
          this.postDone(newTask);
          break;
      }
    }
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
            // TODO: add permalink util
            url: `${this.config.get("APP_URL")}/profile/${author.id}`,
          },
          // TODO: add permalink util
          url: `${this.config.get("APP_URL")}/o/${encoder.encode(
            (await task.project).organizationId
          )}/p/${encoder.encode(task.projectId)}?taskId=${task.id}`,
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

  private async postNewAssignee(task: Task) {
    const owner = task.ownerId && (await this.getDiscordId(task.ownerId));
    if (!owner) return;
    const message = `<@${owner}> A person has applied to this task.`;
    const channel = await this.getDiscordChannel(task);
    if (!channel) return;
    channel.send(message);
  }

  private async getOrCreateChannel(
    task: Task,
    guild: Discord.Guild,
    category: Discord.CategoryChannel
  ): Promise<Discord.TextChannel | undefined> {
    this.logger.debug(
      `Get or create channel: ${JSON.stringify({
        taskId: task.id,
        guildId: guild.id,
        categoryId: category.id,
      })}`
    );

    const existingDiscordChannel = await task.discordChannel;
    if (!!existingDiscordChannel) {
      this.logger.debug(
        `Found existing Discord channel record: ${existingDiscordChannel.id}`
      );

      const channel = await guild.channels.fetch(
        existingDiscordChannel.channelId
      );

      if (!!channel) {
        this.logger.debug(`Existing Discord channel exists: ${channel.id}`);
        return channel as Discord.TextChannel;
      }

      this.logger.warn(
        `Existing Discord channel record's channel doesn't exist: ${existingDiscordChannel.channelId}`
      );
    }

    if (task.status === TaskStatusEnum.TODO && !task.assignees.length) {
      return undefined;
    }

    const project = await this.projectRepo.findOne(task.projectId);
    if (!project) return undefined;

    // TODO(fant): abstract this into separate module
    const oid = encoder.encode(project.organizationId);
    const pid = encoder.encode(project.id);
    const permalink = `${this.config.get("APP_URL")}/o/${oid}/p/${pid}?taskId=${
      task.id
    }`;

    const channel = await category.createChannel(
      `${task.name} ${task.number}`,
      {
        type: "GUILD_TEXT",
        topic: `Discussion for Dework task "${task.name}": ${permalink}`,
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
      `Created task-specific Discord channel: ${JSON.stringify({
        guildId: guild.id,
        channelId: channel.id,
      })}`
    );

    await this.discordChannelRepo.save({
      guildId: guild.id,
      channelId: channel.id,
      taskId: task.id,
      name: channel.name,
    });

    return channel;
  }

  private async addRelevantUsersToTaskDiscordChannel(
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
    const members = await guild.members.fetch({
      user: threepids.map((t) => t.threepid),
    });

    await Bluebird.mapSeries(members.values(), (member) =>
      channel.permissionOverwrites.edit(member.user.id, { VIEW_CHANNEL: true })
    );

    this.logger.debug(
      `Added VIEW_CHANNEL to members: ${JSON.stringify({
        ids: members.keys(),
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
