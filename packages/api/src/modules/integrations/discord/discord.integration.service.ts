import { Task } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
} from "typeorm";
import {
  DiscordProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationSource,
} from "@dewo/api/models/ProjectIntegration";
import { DiscordService } from "./discord.service";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";

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
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Task;
  }

  async afterInsert(event: InsertEvent<Task>) {
    const integration = (await this.projectIntegrationRepo.findOne({
      projectId: event.entity.projectId,
      source: ProjectIntegrationSource.discord,
    })) as ProjectIntegration<ProjectIntegrationSource.discord>;

    if (!integration) return;
    if (
      !integration.config.features.includes(
        DiscordProjectIntegrationFeature.POST_CREATED_TASKS
      )
    ) {
      return;
    }

    this.logger.log(
      `Posting task to Discord: ${JSON.stringify({
        taskId: event.entity.id,
        integrationId: integration.id,
      })}`
    );

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
      return;
    }

    if (!channel.isText()) {
      this.logger.error(
        `Channel is not text channel: ${JSON.stringify({
          channel,
          integrationId: integration.id,
        })}`
      );
      return;
    }

    const project = await integration.project;
    const permalink = `${this.config.get("APP_URL")}/organization/${
      project.organizationId
    }/project/${project.id}/task/${event.entity.id}`;
    channel.send(`New bounty up for grabs! ${event.entity.name}\n${permalink}`);
  }
}
