import { EventHandler } from "@dewo/api/modules/app/eventHandler";
import { TaskApplicationDeletedEvent } from "@dewo/api/modules/task/task.events";
import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { DiscordTaskApplicationService } from "./discord.taskApplication.service";

@Injectable()
@EventsHandler(TaskApplicationDeletedEvent)
export class DiscordIntegrationTaskApplicationDeletedEventEventHandler extends EventHandler<TaskApplicationDeletedEvent> {
  constructor(private readonly service: DiscordTaskApplicationService) {
    super();
  }

  async process(event: TaskApplicationDeletedEvent) {
    if (!!event.application.discordThreadUrl) {
      await this.service.deleteTaskApplicationThread(
        event.application,
        event.task
      );
    }
  }
}
