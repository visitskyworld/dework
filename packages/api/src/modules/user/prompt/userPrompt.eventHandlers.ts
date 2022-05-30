import { TaskStatus } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { UserPrompt } from "@dewo/api/models/UserPrompt";
import { Injectable } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { EventHandler } from "../../app/eventHandler";
import { TaskUpdatedEvent } from "../../task/task.events";

import { UserPromptService } from "./userPrompt.service";

@Injectable()
@EventsHandler(TaskUpdatedEvent)
export class UserPromptTaskUpdatedEventHandler extends EventHandler<TaskUpdatedEvent> {
  constructor(private readonly service: UserPromptService) {
    super();
  }

  async process(event: TaskUpdatedEvent) {
    if ([TaskStatus.IN_REVIEW, TaskStatus.DONE].includes(event.task.status)) {
      const rewards = await event.task.rewards;
      if (!!rewards.length) {
        this.logger.debug(
          `Checking if task assignees have Metamask set up (${JSON.stringify({
            taskId: event.task.id,
          })})`
        );
        const promptType: UserPrompt["type"] =
          "Task.v1.ConnectWalletToReceiveReward";
        for (const assignee of event.task.assignees) {
          const [connectedToMetamask, hasBeenPrompted] = await Promise.all([
            assignee.threepids.then((ts) =>
              ts.some((t) => t.source === ThreepidSource.metamask)
            ),
            assignee.prompts.then((ps) =>
              ps.some((p) => p.type === promptType)
            ),
          ]);

          this.logger.debug(
            `Task assignee Metamask status: ${JSON.stringify({
              taskId: event.task.id,
              userId: assignee.id,
              connectedToMetamask,
              hasBeenPrompted,
            })}`
          );
          if (!connectedToMetamask && !hasBeenPrompted) {
            await this.service.create({
              userId: assignee.id,
              type: promptType,
            });
          }
        }
      }
    }
  }
}
