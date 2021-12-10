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
import { ConfigService } from "@nestjs/config";
import { MessageEmbed } from "discord.js";

@Injectable()
@EventSubscriber()
export class SubscriptionTypeormSubscriber
  implements EntitySubscriberInterface<Task>
{
  private logger = new Logger(this.constructor.name);

  constructor(@InjectConnection() readonly connection: Connection) {
    connection.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<unknown>) {
    console.warn("insert...", event);
    // const task = await this.taskRepo.findOne(event.entity.id);
    // if (!task) return;

    // const integration = await this.getDiscordIntegration(
    //   task.projectId,
    //   DiscordProjectIntegrationFeature.POST_CREATED_TASKS
    // );

    // if (!integration) return;
    // this.logger.log(
    //   `Posting task to Discord: ${JSON.stringify({
    //     taskId: task.id,
    //     integrationId: integration.id,
    //   })}`
    // );

    // const channel = await this.getDiscordChannel(integration);
    // if (!channel) return;

    // const project = await integration.project;
    // const permalink = `${this.config.get("APP_URL")}/organization/${
    //   project.organizationId
    // }/project/${project.id}/task/${task.id}`;
    // channel.send(`New bounty up for grabs! ${task.name}\n${permalink}`);
  }

  async afterUpdate(event: UpdateEvent<unknown>) {
    // if (!event.entity) return;
    // const task = await this.taskRepo.findOne(event.entity.id);
    // if (!task) return;
    // const integration = await this.getDiscordIntegration(
    //   task.projectId,
    //   DiscordProjectIntegrationFeature.POST_CREATED_TASKS
    // );
    // if (!integration) return;
    // this.logger.log(
    //   `Posting task update to Discord: ${JSON.stringify({
    //     taskId: task.id,
    //     integrationId: integration.id,
    //   })}`
    // );
    // const channel = await this.getDiscordChannel(integration);
    // if (!channel) return;
    // const project = await task.project;
    // const permalink = `${this.config.get("APP_URL")}/organization/${
    //   project.organizationId
    // }/project/${project.id}/task/${task.id}`;
    // const msgEmbed = new MessageEmbed()
    //   .setColor("#0099ff")
    //   .setTitle(`Bounty updated: ${task.name}`)
    //   .setURL(`${permalink}`)
    //   .setAuthor(task.assignees[0]?.username ?? "", task.assignees[0]?.imageUrl)
    //   .setDescription(`${task.description}`)
    //   .setTimestamp()
    //   .setFooter("Dewo™");
    // channel.send({ embeds: [msgEmbed] });
  }
}
