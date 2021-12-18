import encoder from "uuid-base62";
import _ from "lodash";
import { Task } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  In,
  InsertEvent,
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

@Injectable()
@EventSubscriber()
export class DiscordIntegrationService
  implements EntitySubscriberInterface<Task>
{
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly threepidService: ThreepidService,
    private readonly config: ConfigService<ConfigType>,
    @InjectConnection() readonly connection: Connection
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Task;
  }

  async afterInsert(event: InsertEvent<Task>) {
    // const task = event.entity;
    const task = await event.manager
      .createQueryBuilder(Task, "task")
      .leftJoinAndSelect("task.owner", "owner")
      .leftJoinAndSelect("task.assignees", "assignees")
      .where("task.id = :id", { id: event.entity.id })
      .getOne();
    if (!task) return;

    const [project, integration] = await Promise.all([
      event.manager.findOne(Project, task.projectId) as Promise<Project>,
      event.manager.findOne(ProjectIntegration, {
        projectId: task.projectId,
        source: ProjectIntegrationSource.discord,
      }) as Promise<
        ProjectIntegration<ProjectIntegrationSource.discord> | undefined
      >,
    ]);

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

    this.logger.debug(
      `Found Discord guild: ${JSON.stringify({ guildId: guild.id })}`
    );

    const threepids = await this.findTaskUserThreepids(task);
    this.logger.debug(
      `Found threepids of users connected to task: ${JSON.stringify({
        count: threepids.length,
        ids: threepids.map((t) => t.id),
      })}`
    );

    // TODO(fant): abstract this into separate module
    const oid = encoder.encode(project.organizationId);
    const pid = encoder.encode(project.id);
    const permalink = `${this.config.get("APP_URL")}/o/${oid}/p/${pid}?taskId=${
      task.id
    }`;

    const category = await this.getOrCreateCategory(guild);

    await guild.roles.fetch();
    const members = await guild.members.fetch({
      user: threepids.map((t) => t.config.profile.id),
    });

    const channel = await category.createChannel(
      `${task.number} ${task.name}`,
      {
        type: "GUILD_TEXT",
        topic: `Discussion for Dework task "${task.name}": ${permalink}`,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
          },
          ...members.map((member) => ({
            id: member,
            allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
          })),
        ],
      }
    );

    this.logger.debug(
      `Created task-specific Discord channel: ${JSON.stringify({
        guildId: guild.id,
        channelId: channel.id,
      })}`
    );

    await event.manager.save(DiscordChannel, {
      guildId: guild.id,
      channelId: channel.id,
      taskId: task.id,
      name: channel.name,
    });
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

  public async findTaskUserThreepids(
    task: Task
  ): Promise<Threepid<ThreepidSource.discord>[]> {
    const userIds = _([await task.owner, ...(await task.assignees)])
      .filter((u): u is User => !!u)
      .map((u) => u.id)
      .uniq()
      .value();

    if (!userIds.length) return [];
    return this.threepidService.find({
      source: ThreepidSource.discord,
      userId: In(userIds),
    }) as Promise<Threepid<ThreepidSource.discord>[]>;
  }

  /*
  async afterInsert(event: InsertEvent<Task>) {
    const task = await this.taskRepo.findOne(event.entity.id);
    if (!task) return;

    const integration = await this.getDiscordIntegration(
      task.projectId,
      DiscordProjectIntegrationFeature.POST_CREATED_TASKS
    );

    if (!integration) return;
    this.logger.log(
      `Posting task to Discord: ${JSON.stringify({
        taskId: task.id,
        integrationId: integration.id,
      })}`
    );

    const channel = await this.getDiscordChannel(integration);
    if (!channel) return;

    const project = await integration.project;
    const permalink = `${this.config.get("APP_URL")}/o/${encoder.encode(
      project.organizationId
    )}/p/${project.slug}?taskId=${task.id}`;
    channel.send(`New bounty up for grabs! ${task.name}\n${permalink}`);
  }

  async afterUpdate(event: UpdateEvent<Task>) {
    if (!event.entity) return;
    const task = await this.taskRepo.findOne(event.entity.id);
    if (!task) return;

    const integration = await this.getDiscordIntegration(
      task.projectId,
      DiscordProjectIntegrationFeature.POST_CREATED_TASKS
    );

    if (!integration) return;
    this.logger.log(
      `Posting task update to Discord: ${JSON.stringify({
        taskId: task.id,
        integrationId: integration.id,
      })}`
    );

    const channel = await this.getDiscordChannel(integration);
    if (!channel) return;

    const project = await task.project;
    const permalink = `${this.config.get("APP_URL")}/o/${encoder.encode(
      project.organizationId
    )}/p/${project.slug}/task/${task.id}`;

    const msgEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Bounty updated: ${task.name}`)
      .setURL(`${permalink}`)
      .setAuthor(task.assignees[0]?.username ?? "", task.assignees[0]?.imageUrl)
      .setDescription(`${task.description}`)
      .setTimestamp()
      .setFooter("Dewo™");

    channel.send({ embeds: [msgEmbed] });
  }

  private async getDiscordIntegration(
    projectId: string,
    feature: DiscordProjectIntegrationFeature
  ): Promise<ProjectIntegration<ProjectIntegrationSource.discord> | undefined> {
    const integration = (await this.projectIntegrationRepo.findOne({
      projectId,
      source: ProjectIntegrationSource.discord,
    })) as ProjectIntegration<ProjectIntegrationSource.discord>;

    if (!integration) return undefined;
    if (!integration.config.features.includes(feature)) {
      return undefined;
    }

    return integration;
  }

  private async getDiscordChannel(
    integration: ProjectIntegration<ProjectIntegrationSource.discord>
  ) {
    const channel = await this.discord.client.channels.fetch(
      integration.config.channelId
    );
    if (!channel) {
      this.logger.error(
        `Could not find channel: ${JSON.stringify({
          channelId: integration.config.channelId,
          integrationId: integration.id,
        })}`
      );
      return undefined;
    }

    if (!channel.isText()) {
      this.logger.error(
        `Channel is not text channel: ${JSON.stringify({
          channel,
          integrationId: integration.id,
        })}`
      );
      return undefined;
    }

    return channel ?? undefined;
  }
  */
}
