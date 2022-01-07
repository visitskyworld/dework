import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import * as Github from "@octokit/webhooks-types";
import * as Colors from "@ant-design/colors";
import NearestColor from "nearest-color";
import { TaskService } from "../../task/task.service";
import { TaskTag, TaskTagSource } from "@dewo/api/models/TaskTag";
import { Project } from "@dewo/api/models/Project";
import { ProjectService } from "../../project/project.service";
import { GithubService } from "./github.service";
import { IntegrationService } from "../integration.service";

@Injectable()
export class GithubIntegrationService {
  private logger = new Logger(this.constructor.name);
  private githubIssueLabel: Github.Label = {
    id: 0,
    node_id: "",
    url: "",
    name: "github issue",
    description: null,
    color: "238636",
    default: false,
  };

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
    private readonly projectService: ProjectService,
    private readonly githubService: GithubService,
    private readonly integrationService: IntegrationService
  ) {}

  public async updateIssue(
    issue: Pick<
      Github.Issue,
      "id" | "html_url" | "state" | "title" | "body" | "labels" | "number"
    >,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    taskOverride: Partial<Task> = {}
  ) {
    this.logger.log(
      `Processing Github issue: ${JSON.stringify({
        issueId: issue.id,
        integrationId: integration.id,
      })}`
    );

    const project = await integration.project;
    const tags = await this.getOrCreateTaskTags(
      [...(issue.labels ?? []), this.githubIssueLabel],
      project
    );

    const existingIssue = await this.githubService.findIssue(
      issue.id,
      project.id
    );

    const description = [
      issue.body,
      `Originally created from Github issue: ${issue.html_url}`,
    ]
      .filter((s) => !!s)
      .join("\n\n");

    if (!!existingIssue) {
      this.logger.log(`Found existing issue: ${JSON.stringify(existingIssue)}`);

      const updatedStatus =
        issue.state === "closed" ? TaskStatus.DONE : undefined;
      if (!!updatedStatus) {
        this.logger.log(
          `Will update task status: ${JSON.stringify({
            issueState: issue.state,
            updatedStatus,
          })}`
        );
      }

      const existingTask = (await this.taskService.findById(
        existingIssue.taskId
      )) as Task;
      const nonGithubTags = existingTask.tags.filter(
        (t) => t.source !== TaskTagSource.GITHUB
      );

      const task = await this.taskService.update({
        id: existingIssue.taskId,
        name: issue.title,
        description,
        tags: [...tags, ...nonGithubTags],
        status: updatedStatus,
        ...taskOverride,
      });

      this.logger.log(`Updated task: ${JSON.stringify(task)}`);
    } else {
      this.logger.log(`Creating task from GH issue: ${JSON.stringify(issue)}`);
      const status =
        issue.state === "closed"
          ? TaskStatus.DONE
          : project.options?.showBacklogColumn
          ? TaskStatus.BACKLOG
          : TaskStatus.TODO;
      const task = await this.taskService.create({
        name: issue.title,
        description,
        tags,
        status,
        projectId: integration.projectId,
        ...taskOverride,
      });

      this.logger.log(
        `Creating GithubIssue for task: ${JSON.stringify({ taskId: task.id })}`
      );

      const githubIssue = await this.githubService.createIssue({
        externalId: issue.id,
        number: issue.number,
        taskId: task.id,
      });

      this.logger.log(
        `Created GithubIssue for task: ${JSON.stringify(githubIssue)}`
      );
    }
  }

  public async createTasksFromGithubIssues(
    projectId: string,
    userId: string
  ): Promise<void> {
    const issues = await this.githubService.getProjectIssues(projectId);
    const integration = await this.integrationService.findProjectIntegration(
      projectId,
      ProjectIntegrationType.GITHUB
    );
    if (!integration) return;
    for (const issue of issues) {
      await this.updateIssue(
        {
          ...issue,
          state: issue.state as any,
          body: issue.body ?? null,
          labels: issue.labels as any as Github.Label[],
        },
        integration,
        { creatorId: userId }
      );
    }
  }

  private async getOrCreateTaskTags(
    githubLabels: Github.Label[],
    project: Project
  ): Promise<TaskTag[]> {
    if (!githubLabels) return [];

    const matchesLabel = (label: Github.Label) => (tag: TaskTag) =>
      tag.source === TaskTagSource.GITHUB &&
      tag.externalId === String(label.id);

    const existingTags = await project.taskTags;
    const newGithubLabels = githubLabels.filter(
      (label) => !existingTags.some(matchesLabel(label))
    );

    this.logger.log(
      `Getting/creating task tags: ${JSON.stringify({
        existing: existingTags.map((t) => t.id),
        newGithubLabels,
      })}`
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

    if (!!newGithubLabels.length) {
      this.logger.log(
        `Created new task tags: ${JSON.stringify({
          tagIds: newTags.map((t) => t.id),
        })}`
      );
    }

    return githubLabels
      .map(
        (l) =>
          existingTags.find(matchesLabel(l)) ?? newTags.find(matchesLabel(l))
      )
      .filter((tag): tag is TaskTag => !!tag);
  }
}
