import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import {
  GithubProjectIntegrationFeature,
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { TaskService } from "@dewo/api/modules/task/task.service";
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
    private readonly taskService: TaskService,
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
      if (event.action === "opened") {
        await this.process(integrations, event, this.pullRequestCreated);
      } else if (event.action === "review_requested") {
        await this.process(integrations, event, this.reviewRequested);
      }
    }

    if ("ref" in event && "ref_type" in event && event.ref_type === "branch") {
      if ("master_branch" in event) {
        await this.process(integrations, event, this.branchCreated);
      } else {
        await this.process(integrations, event, this.branchDeleted);
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

  private async branchCreated(
    event: Github.CreateEvent | Github.DeleteEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    organizationIntegration: OrganizationIntegration<OrganizationIntegrationType.GITHUB>
  ) {
    if (
      integration.config.features.includes(
        GithubProjectIntegrationFeature.SHOW_BRANCHES
      )
    ) {
      const branch = await this.github.getBranchAndTask(
        event.ref,
        event.repository,
        organizationIntegration.config.installationId
      );

      if (!branch) return;

      await this.github.upsertBranch({
        taskId: branch.task.id,
        name: branch.name,
        organization: branch.organization,
        repo: branch.repo,
      });

      if ([TaskStatus.TODO, TaskStatus.BACKLOG].includes(branch.task.status)) {
        this.logger.debug(
          `branchCreated: moving task to IN_PROGRESS (${JSON.stringify({
            taskId: branch.task.id,
          })})`
        );
        await this.taskService.update({
          id: branch.task.id,
          status: TaskStatus.IN_PROGRESS,
        });
      }
    }
  }

  private async branchDeleted(
    event: Github.DeleteEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    organizationIntegration: OrganizationIntegration<OrganizationIntegrationType.GITHUB>
  ) {
    if (
      integration.config.features.includes(
        GithubProjectIntegrationFeature.SHOW_BRANCHES
      )
    ) {
      const branch = await this.github.getBranchAndTask(
        event.ref,
        event.repository,
        organizationIntegration.config.installationId
      );

      if (!branch) return;

      await this.github.upsertBranch({
        taskId: branch.task.id,
        name: branch.name,
        organization: branch.organization,
        repo: branch.repo,
        deletedAt: new Date(),
      });
    }
  }

  private async pullRequestCreated(
    event: Github.PullRequestOpenedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    organizationIntegration: OrganizationIntegration<OrganizationIntegrationType.GITHUB>
  ) {
    const task = await this.getTaskFromPullRequest(
      event.pull_request.id,
      integration
    );
    if (!task || !task.owners.length) return;

    const client = this.github.createClient(
      organizationIntegration.config.installationId
    );

    const githubUsernames = await this.github.getGithubUsernames(
      task.owners.map((u) => u.id)
    );

    await client.pulls.requestReviewers({
      pull_number: event.pull_request.number,
      repo: event.repository.name,
      owner: event.organization?.login!,
      reviewers: Object.values(githubUsernames),
    });
  }

  private async process<T>(
    integrations: ProjectIntegration<ProjectIntegrationType.GITHUB>[],
    event: T,
    fn: (
      event: T,
      integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
      organizationIntegration: OrganizationIntegration<OrganizationIntegrationType.GITHUB>
    ) => Promise<void>
  ) {
    for (const integration of integrations) {
      this.logger.debug(
        `Processing event for integration: ${JSON.stringify({
          integrationId: integration.id,
          functionName: fn.name,
        })}`
      );
      const orgInt =
        (await integration.organizationIntegration) as OrganizationIntegration<OrganizationIntegrationType.GITHUB>;
      await fn.call(this, event, integration, orgInt);
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
