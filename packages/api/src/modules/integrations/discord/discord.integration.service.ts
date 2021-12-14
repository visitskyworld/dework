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
import { DiscordService } from "./discord.service";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import { MessageEmbed } from "discord.js";
import { DiscordProjectIntegrationConfig } from "../../../models/ProjectIntegration";
import { ProjectIntegrationSource } from "../../../../../app/src/graphql/types";

@Injectable()
@EventSubscriber()
export class DiscordIntegrationService
  implements EntitySubscriberInterface<Task>
{
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly config: ConfigService<ConfigType>,
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Task;
  }

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
  ): Promise<ProjectIntegration | undefined> {
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
}
