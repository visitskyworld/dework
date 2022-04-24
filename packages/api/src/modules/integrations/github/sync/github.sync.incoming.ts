import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as Github from "@octokit/webhooks-types";
import { Repository } from "typeorm";
import { GithubService } from "../github.service";

@Injectable()
export class GithubSyncIncomingService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly github: GithubService,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  public async handleWebhook(event: Github.WebhookEvent) {
    if (!("repository" in event) || !event.repository) return;

    const integrations = await this.github.findIntegrations(
      event.repository.owner.login,
      event.repository.name
    );

    if ("issue" in event) {
      if (event.action === "assigned") {
        await this.process(integrations, event, this.issueAssigned);
      } else if (event.action === "unassigned") {
        await this.process(integrations, event, this.issueUnassigned);
      }
    }

    if ("pull_request" in event) {
      if (event.action === "review_requested") {
        await this.process(integrations, event, this.reviewRequested);
      }
    }
  }

  private async issueAssigned(
    event: Github.IssuesAssignedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ) {
    if (!event.assignee) return;
    const [task, users] = await Promise.all([
      this.getTaskFromIssue(event.issue.id, integration),
      this.github.getUsersFromGithubIds([event.assignee.id]),
    ]);
    if (!task) return;

    await this.taskRepo
      .createQueryBuilder()
      .relation("assignees")
      .of(task.id)
      .add(
        Object.values(users).filter(
          (u) => !task.assignees.some((a) => a.id === u.id)
        )
      );
  }

  private async issueUnassigned(
    event: Github.IssuesUnassignedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ) {
    if (!event.assignee) return;
    const [task, users] = await Promise.all([
      this.getTaskFromIssue(event.issue.id, integration),
      this.github.getUsersFromGithubIds([event.assignee.id]),
    ]);
    if (!task) return;

    await this.taskRepo
      .createQueryBuilder()
      .relation("assignees")
      .of(task.id)
      .remove(Object.values(users));
  }

  private async reviewRequested(
    event: Github.PullRequestReviewRequestedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ) {
    if (!("requested_reviewer" in event)) return;
    const [task, users] = await Promise.all([
      this.getTaskFromPullRequest(event.pull_request.id, integration),
      this.github.getUsersFromGithubIds([event.requested_reviewer.id]),
    ]);
    if (!task) return;

    await this.taskRepo
      .createQueryBuilder()
      .relation("owners")
      .of(task.id)
      .add(
        Object.values(users).filter(
          (u) => !task.owners.some((o) => o.id === u.id)
        )
      );
  }

  private async process<T>(
    integrations: ProjectIntegration<ProjectIntegrationType.GITHUB>[],
    event: T,
    fn: (
      event: T,
      integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
    ) => Promise<void>
  ) {
    for (const integration of integrations) {
      this.logger.debug(
        `Processing event for integration: ${JSON.stringify({
          integrationId: integration.id,
          functionName: fn.name,
        })}`
      );
      await fn.call(this, event, integration);
    }
  }

  private getTaskFromIssue(
    issueId: number,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ): Promise<Task | undefined> {
    return this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.githubIssue", "issue")
      .leftJoinAndSelect("task.assignees", "assignee")
      .where("issue.externalId = :issueId", { issueId })
      .andWhere("task.projectId = :projectId", {
        projectId: integration.projectId,
      })
      .getOne();
  }

  private getTaskFromPullRequest(
    pullRequestId: number,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ): Promise<Task | undefined> {
    return this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.githubPullRequests", "pullRequest")
      .leftJoinAndSelect("task.assignees", "assignee")
      .leftJoinAndSelect("task.owners", "owner")
      .where("pullRequest.externalId = :pullRequestId", { pullRequestId })
      .andWhere("task.projectId = :projectId", {
        projectId: integration.projectId,
      })
      .getOne();
  }
}
