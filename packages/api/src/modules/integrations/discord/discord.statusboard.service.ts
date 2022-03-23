import _ from "lodash";
import * as Discord from "discord.js";
import { Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { IntegrationService } from "../integration.service";
import { PermalinkService } from "../../permalink/permalink.service";
import { TaskService } from "../../task/task.service";
import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";

@Injectable()
export class DiscordStatusboardService {
  constructor(
    private readonly permalink: PermalinkService,
    private readonly taskService: TaskService,
    private readonly integrationService: IntegrationService
  ) {}

  public async postStatusboardMessage(
    task: Task,
    integration: ProjectIntegration<ProjectIntegrationType.DISCORD>,
    channel: Discord.TextChannel
  ) {
    const discordFieldLimit = 25;
    let tasks = (
      await this.taskService.findWithRelations({
        projectIds: [task.projectId],
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
          projectIds: [task.projectId],
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
    // Chunk tasks into rows of three, with a space in the middle for grid-like effect in Discord
    const nSpaces = Math.floor(tasks.length / 2);
    const nFields = tasks.length + nSpaces;
    const tasksWithSpaces = _.flatten(
      _.chunk(tasks, 2).map((taskRow, index) => {
        const isFullRow = !!taskRow[1];
        const addVerticalSpace = index < nFields - 3;
        if (isFullRow) {
          return [
            this.getTaskDiscordEmbedField(taskRow[0], addVerticalSpace),
            {
              name: "\u200b",
              value: "\u200b",
              inline: true,
            },
            this.getTaskDiscordEmbedField(taskRow[1], addVerticalSpace),
          ];
        }
        return this.getTaskDiscordEmbedField(taskRow[0], false);
      })
    );
    const messageContent = {
      content: `**${(await task.project).name} Task Board**`,
      embeds: [
        {
          url: await this.permalink.get(await task.project),
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

    let tags: string[] = [];
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
}
