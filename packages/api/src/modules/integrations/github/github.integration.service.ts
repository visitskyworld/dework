import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { TaskStatus } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { IssuesOpenedEvent, Label } from "@octokit/webhooks-types";
import * as Colors from "@ant-design/colors";
import NearestColor from "nearest-color";
import { TaskService } from "../../task/task.service";
import { TaskTag, TaskTagSource } from "@dewo/api/models/TaskTag";
import { Project } from "@dewo/api/models/Project";
import { ProjectService } from "../../project/project.service";

@Injectable()
export class GithubIntegrationService {
  private logger = new Logger(this.constructor.name);

  private nearestColor = NearestColor.from({
    red: Colors.red.primary!,
    volcano: Colors.volcano.primary!,
    gold: Colors.gold.primary!,
    orange: Colors.orange.primary!,
    yellow: Colors.yellow.primary!,
    lime: Colors.lime.primary!,
    green: Colors.green.primary!,
    cyan: Colors.cyan.primary!,
    blue: Colors.blue.primary!,
    geekblue: Colors.geekblue.primary!,
    purple: Colors.purple.primary!,
    magenta: Colors.magenta.primary!,
    grey: Colors.grey.primary!,
  });

  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService
  ) {}

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

    const project = await integration.project;
    const tags = await this.getOrCreateTaskTags(
      event.issue.labels ?? [],
      project
    );

    const task = await this.taskService.create({
      name: event.issue.title,
      description: [
        event.issue.body,
        `Originally created from Github issue: ${event.issue.url}`,
      ]
        .filter((s) => !!s)
        .join("\n\n"),
      tags,
      status: TaskStatus.TODO,
      projectId: integration.projectId,
    });

    this.logger.log(
      `Created task (${JSON.stringify({ taskId: task.id })})`,
      "onIssueCreated"
    );
  }

  private async getOrCreateTaskTags(
    githubLabels: Label[],
    project: Project
  ): Promise<TaskTag[]> {
    if (!githubLabels) return [];

    const matchesLabel = (label: Label) => (tag: TaskTag) =>
      tag.source === TaskTagSource.GITHUB &&
      tag.externalId === String(label.id);

    const existingTags = await project.taskTags;
    const newGithubLabels = githubLabels.filter(
      (label) => !existingTags.some(matchesLabel(label))
    );

    const newTags = await Promise.all(
      newGithubLabels.map((label) =>
        this.projectService.createTag({
          color: this.nearestColor(`#${label.color}`).name,
          label: label.name,
          projectId: project.id,
          source: TaskTagSource.GITHUB,
          externalId: String(label.id),
        })
      )
    );

    return githubLabels
      .map(
        (l) =>
          existingTags.find(matchesLabel(l)) ?? newTags.find(matchesLabel(l))
      )
      .filter((tag): tag is TaskTag => !!tag);
  }
}
