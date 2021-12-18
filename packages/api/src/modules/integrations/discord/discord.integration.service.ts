import encoder from "uuid-base62";
import { Task } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
  UpdateEvent,
} from "typeorm";
import {
  DiscordProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationSource,
} from "@dewo/api/models/ProjectIntegration";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { DiscordService } from "./discord.service";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import * as DiscordJS from "discord.js";
import { DiscordChannel } from "@dewo/api/models/DiscordChannel";

@Injectable()
@EventSubscriber()
export class DiscordIntegrationService
  implements EntitySubscriberInterface<Task>
{
  private logger = new Logger(this.constructor.name);
  // private client: REST;

  constructor(
    private readonly discord: DiscordService,
    private readonly config: ConfigService<ConfigType>,
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    @InjectRepository(DiscordChannel)
    private readonly discordChannelRepo: Repository<DiscordChannel>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {
    connection.subscribers.push(this);

    // this.client = new REST().setToken(
    //   config.get("DISCORD_BOT_TOKEN") as string
    // );
  }

  listenTo() {
    return Task;
  }

  async afterInsert(event: InsertEvent<Task>) {
    const task = event.entity;
    const integration = (await this.projectIntegrationRepo.findOne({
      projectId: task.projectId,
      source: ProjectIntegrationSource.discord,
    })) as ProjectIntegration<ProjectIntegrationSource.discord> | undefined;

    if (!integration) return;

    const guild = await this.discord.client.guilds.fetch(
      integration.config.guildId
    );

    const category = await this.getOrCreateCategory(guild);
    const channel = await category.createChannel(`${task.name} (${task.id})`, {
      type: "GUILD_TEXT",
    });
    // TODO(fant): make channel invisible to other users
    // https://stackoverflow.com/questions/57339085/discord-bot-how-to-create-a-private-text-channel?rq=1

    // TODO(fant): add task owner to discord channel

    await event.manager.save(DiscordChannel, {
      guildId: guild.id,
      channelId: channel.id,
      taskId: task.id,
    });
  }

  private async getOrCreateCategory(
    guild: DiscordJS.Guild
  ): Promise<DiscordJS.CategoryChannel> {
    const channels = await guild.channels.fetch();
    const category = channels.find(
      (c): c is DiscordJS.CategoryChannel =>
        c.type === "GUILD_CATEGORY" && c.name === "Dework"
    );

    if (!!category) return category;
    return guild.channels.create("Dework", { type: "GUILD_CATEGORY" });
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
