import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { TaskStatus } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { IssuesOpenedEvent } from "@octokit/webhooks-types";
import { TaskService } from "../../task/task.service";

@Injectable()
export class GithubIntegrationService {
  private logger = new Logger(this.constructor.name);

  constructor(private readonly taskService: TaskService) {}

  public async onIssueCreated(
    event: IssuesOpenedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ): Promise<void> {
    this.logger.log(
      `Process (${JSON.stringify({
        issueId: event.issue.id,
        integrationId: integration.id,
      })})`,
      "onIssueCreated"
    );

    const task = await this.taskService.create({
      name: event.issue.title,
      description: [
        event.issue.body,
        `Originally created from Github issue: ${event.issue.url}`,
      ]
        .filter((s) => !!s)
        .join("\n\n"),
      status: TaskStatus.TODO,
      projectId: integration.projectId,
    });

    this.logger.log(
      `Created task (${JSON.stringify({ taskId: task.id })})`,
      "onIssueCreated"
    );
  }
}
