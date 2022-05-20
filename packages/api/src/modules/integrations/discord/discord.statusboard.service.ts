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
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from "../../task/task.events";
import { TaskSearchService } from "../../task/search/task.search.service";
import {
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/api/models/TaskView";

@Injectable()
export class DiscordStatusboardService {
  private logger = new Logger(this.constructor.name);
  private taskLimit = 25;

  constructor(
    private readonly discord: DiscordService,
    private readonly permalink: PermalinkService,
    private readonly taskService: TaskService,
    private readonly taskSearchService: TaskSearchService,
    private readonly integrationService: IntegrationService
  ) {}

  private async postOpenTasksStatusBoardMessage(
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>
  ) {
    const query = {
      projectIds: [integration.projectId],
      statuses: [TaskStatus.TODO],
      assigneeIds: [null],
      hasReward: true,
      size: this.taskLimit,
      sortBy: {
        field: TaskViewSortByField.priority,
        direction: TaskViewSortByDirection.DESC,
      },
    };
    const { tasks } = await this.taskSearchService.search(query);

    if (tasks.length !== this.taskLimit) {
      const { tasks: tasksWithoutReward } = await this.taskSearchService.search(
        {
          ...query,
          hasReward: false,
          size: this.taskLimit - tasks.length,
        }
      );

      tasks.push(...tasksWithoutReward);
    }

    const project = await integration.project;
    const name = `${project.name} Task Board`;
    await this.postStatusboardMessage(name, tasks, integration);
  }

  private async postCommunitySuggestionsStatusBoardMessage(
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>
  ) {
    const { tasks } = await this.taskSearchService.search({
      projectIds: [integration.projectId],
      statuses: [TaskStatus.COMMUNITY_SUGGESTIONS],
      size: this.taskLimit,
      sortBy: {
        field: TaskViewSortByField.votes,
        direction: TaskViewSortByDirection.DESC,
      },
    });

    const project = await integration.project;
    const name = `${project.name} Community Suggestions`;
    await this.postStatusboardMessage(name, tasks, integration);
  }

  private async postStatusboardMessage(
    name: string,
    tasks: Task[],
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>
  ) {
    this.logger.debug(
      `Posting status board: ${JSON.stringify({
        name,
        numTasks: tasks.length,
        projectId: integration.projectId,
        integrationId: integration.id,
      })}`
    );

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
      content: `**${name}**`,
      embeds: [{ fields: await Promise.all(tasksWithSpaces) }],
    };

    try {
      const messageId = integration.config.messageId;
      if (!!messageId) {
        const message = await channel.messages.fetch(messageId);
        if (message) await message.edit(messageContent);
      } else {
        const newMessage = await channel.send(messageContent);
        await this.integrationService.updateProjectIntegration({
          id: integration.id,
          config: { ...integration.config, messageId: newMessage.id },
        });
      }
    } catch (error) {
      const errorString = JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      );
      this.logger.error(
        `Failed using existing message: ${JSON.stringify({
          errorString,
          integration,
        })}`
      );
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

    const reactions = await task.reactions;
    const numUpvotes = reactions.filter(
      (r) => r.reaction === ":arrow_up_small:"
    ).length;
    const upvotesString = !!numUpvotes ? `🔼 ${numUpvotes} votes` : undefined;

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
        upvotesString,
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
    event: ProjectIntegrationCreatedEvent | TaskCreatedEvent | TaskUpdatedEvent,
    feature: DiscordProjectIntegrationFeature
  ): Promise<ProjectIntegration<ProjectIntegrationType.DISCORD>[]> {
    if (event instanceof ProjectIntegrationCreatedEvent) {
      if (event.projectIntegration.type === ProjectIntegrationType.DISCORD) {
        const discordIntegration =
          event.projectIntegration as ProjectIntegration<ProjectIntegrationType.DISCORD>;
        if (discordIntegration.config.features.includes(feature)) {
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
        integration.config.features.includes(feature)
      );
    }

    return [];
  }

  async handle(
    event:
      | ProjectIntegrationCreatedEvent
      | TaskCreatedEvent
      | TaskUpdatedEvent
      | TaskDeletedEvent
  ) {
    this.logger.log(
      `Handle event: ${JSON.stringify({
        type: event.constructor.name,
        ...event,
      })}`
    );

    if (
      event instanceof TaskCreatedEvent ||
      event instanceof TaskUpdatedEvent ||
      event instanceof TaskDeletedEvent
    ) {
      await this.taskSearchService.refresh();
    }

    for (const feature of [
      DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE,
      DiscordProjectIntegrationFeature.POST_COMMUNITY_SUGGESTIONS_STATUS_BOARD_MESSAGE,
    ]) {
      const integrations = await this.getProjectIntegrations(event, feature);
      this.logger.debug(
        `Found status board integrations: ${JSON.stringify({
          feature,
          integrations,
        })}`
      );

      for (const integration of integrations) {
        if (
          feature === DiscordProjectIntegrationFeature.POST_STATUS_BOARD_MESSAGE
        ) {
          this.postOpenTasksStatusBoardMessage(integration);
        } else if (
          feature ===
          DiscordProjectIntegrationFeature.POST_COMMUNITY_SUGGESTIONS_STATUS_BOARD_MESSAGE
        ) {
          await this.postCommunitySuggestionsStatusBoardMessage(integration);
        }
      }
    }
  }
}
