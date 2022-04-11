import _ from "lodash";
import * as Discord from "discord.js";
import { Injectable, Logger } from "@nestjs/common";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { IntegrationService } from "../integration.service";
import { PermalinkService } from "../../permalink/permalink.service";
import { TaskService } from "../../task/task.service";
import {
  DiscordProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { ProjectIntegrationCreatedEvent } from "../integration.events";
import { DiscordService } from "./discord.service";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { TaskCreatedEvent, TaskUpdatedEvent } from "../../task/task.events";

@Injectable()
export class DiscordStatusboardService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly taskService: TaskService,
    private readonly integrationService: IntegrationService
  ) {}

  private async postStatusboardMessage(
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>
  ) {
    const project = await integration.project;
    const organizationIntegration =
      (await integration.organizationIntegration) as
        | OrganizationIntegration<OrganizationIntegrationType.DISCORD>
        | undefined;
    if (!organizationIntegration) {
      this.logger.warn("No organization integration found");
      return;
    }
    const guild = await this.discord
      .getClient(organizationIntegration)
      .guilds.fetch(organizationIntegration.config.guildId);
    const channel = await guild.channels.fetch(integration.config.channelId);
    if (!channel || !channel.isText()) {
      this.logger.warn(`No text channel found (${JSON.stringify(channel)})`);
      return;
    }

    const discordFieldLimit = 25;
    let tasks = (
      await this.taskService.findWithRelations({
        projectIds: [integration.projectId],
        statuses: [TaskStatus.TODO],
        userId: null,
        rewardNotNull: true,
        limit: discordFieldLimit,
      })
    ).sort((a, b) => b.tags.length - a.tags.length);
    // Backfill with tasks without reward
    if (tasks.length < discordFieldLimit) {
      const tasksWithoutReward = (
        await this.taskService.findWithRelations({
          projectIds: [integration.projectId],
          statuses: [TaskStatus.TODO],
          userId: null,
          limit: discordFieldLimit,
        })
      )
        .filter((t) => !t.rewardId)
        .splice(0, discordFieldLimit - tasks.length)
        .sort((a, b) => b.tags.length - a.tags.length);
      tasks = [...tasks, ...tasksWithoutReward];
    }
    if (tasks.length === 0) return;
    // Chunk tasks into rows of three, with a space in the middle for grid-like effect in Discord
    const numberOfRows = Math.ceil(tasks.length / 2);
    const tasksWithSpaces = _.flatten(
      _.chunk(tasks, 2).map((row, rowIndex) => {
        const isFullRow = !!row[1];
        const addVerticalSpace = rowIndex < numberOfRows - 1;
        if (isFullRow) {
          return [
            this.getTaskDiscordEmbedField(row[0], addVerticalSpace),
            {
              name: "\u200b",
              value: "\u200b",
              inline: true,
            },
            this.getTaskDiscordEmbedField(row[1], addVerticalSpace),
          ];
        }
        return this.getTaskDiscordEmbedField(row[0], false);
      })
    );
    const messageContent = {
      content: `**${project.name} Task Board**`,
      embeds: [
        {
          fields: await Promise.all(tasksWithSpaces),
        },
      ],
    };

    try {
      const messageId = integration.config.messageId;
      if (messageId) {
        const message = await channel.messages.fetch(messageId);
        if (message) await message.edit(messageContent);
      } else {
        throw new Error("Outdated Discord message ID");
      }
    } catch {
      const newMessage = await channel.send(messageContent);
      await this.integrationService.updateProjectIntegration({
        id: integration.id,
        config: { ...integration.config, messageId: newMessage.id },
      });
    }
  }

  private async getTaskDiscordEmbedField(
    task: Task,
    addVerticalSpace: boolean
  ): Promise<Discord.EmbedField> {
    const nameString = `**${_.truncate(task.name, { length: 60 })}**`;
    const rewardString = task.reward
      ? `💰 Reward: ${await this.taskService.formatTaskReward(task.reward)}`
      : undefined;

    const tags: string[] = [];
    let tagString = undefined;
    const tagsCharLimit = 20;
    if (task.tags.length > 0 && task.tags[0].label.length < tagsCharLimit) {
      task.tags.forEach((tag) => {
        if ([...tags, tag.label].join(", ").length < tagsCharLimit) {
          tags.push(tag.label);
        }
      });
      tagString = tags.map((t) => `\`${t}\``).join(", ");
    }

    return {
      name: nameString,
      value: [
        tagString,
        rewardString,
        `**${Discord.Formatters.hyperlink(
          "View task",
          await this.permalink.get(task)
        )}**`,
        addVerticalSpace ? "\u200b" : undefined,
      ]
        .filter((s) => !!s)
        .join("\n"),
      inline: true,
    };
  }

  private async getProjectIntegrations(
    event: ProjectIntegrationCreatedEvent | TaskCreatedEvent | TaskUpdatedEvent
  ): Promise<ProjectIntegration<ProjectIntegrationType.DISCORD>[]> {
    if (event instanceof ProjectIntegrationCreatedEvent) {
      if (event.projectIntegration.type === ProjectIntegrationType.DISCORD) {
        const discordIntegration =
          event.projectIntegration as ProjectIntegration<ProjectIntegrationType.DISCORD>;
        if (
          discordIntegration.config.features.includes(
            DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE
          )
        ) {
          return [discordIntegration];
        }
      }
    }

    if (
      event instanceof TaskCreatedEvent ||
      event instanceof TaskUpdatedEvent
    ) {
      const integrations =
        await this.integrationService.findProjectIntegrations(
          event.task.projectId,
          ProjectIntegrationType.DISCORD
        );

      return integrations.filter((integration) =>
        integration.config.features.includes(
          DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE
        )
      );
    }

    return [];
  }

  async handle(
    event: ProjectIntegrationCreatedEvent | TaskCreatedEvent | TaskUpdatedEvent
  ) {
    this.logger.log(
      `Handle event: ${JSON.stringify({
        type: event.constructor.name,
        ...event,
      })}`
    );

    const integrations = await this.getProjectIntegrations(event);
    this.logger.debug(
      `Found status board integrations: ${JSON.stringify(integrations)}`
    );
    for (const integration of integrations) {
      await this.postStatusboardMessage(integration);
    }
  }
}
