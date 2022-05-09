import { Controller, Logger, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { TaskService } from "../../task/task.service";
import { DiscordIntegrationService } from "./discord.integration.service";

@Controller("discord-notifications")
export class DiscordIntegrationPoller {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly taskService: TaskService,
    private readonly discordIntegrationService: DiscordIntegrationService
  ) {}

  @Post("overdue-tasks")
  public async notifyOverdueTasks(@Res() res: Response) {
    await this.poll();
    res.json({ ok: true });
  }

  public async poll(): Promise<void> {
    const overdueTasks = await this.taskService.findOverdueTasks();
    const startedAt = new Date();
    this.logger.log(
      `Notifying ${overdueTasks.length} overdue tasks: ${JSON.stringify({
        startedAt,
      })}, Ids: ${overdueTasks.map((task) => task.id).join(",")}`
    );

    for (const task of overdueTasks) {
      try {
        const integration =
          await this.discordIntegrationService.getNonStatusBoardMessageChannel(
            task.projectId
          );

        if (!integration) return;

        const { channelToPostTo } =
          await this.discordIntegrationService.getChannelFromTask(
            task,
            integration
          );

        if (!channelToPostTo) {
          this.logger.warn(
            `No channel to post to found: ${JSON.stringify({ integration })}`
          );
          return;
        }

        await this.discordIntegrationService.postOverdueDateWarning(
          task,
          channelToPostTo
        );

        this.logger.log(`Overdue task with id ${task.id} has been notified`);
      } catch (error) {
        const errorString = JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        );
        this.logger.error(
          `Failed sending overdue task notification: ${JSON.stringify({
            error: errorString,
            task,
          })}`
        );
      }
    }
  }
}
