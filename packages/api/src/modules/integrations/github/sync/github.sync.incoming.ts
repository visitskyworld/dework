import { GithubIssue } from "@dewo/api/models/GithubIssue";
import {
  GithubPullRequest,
  GithubPullRequestStatus,
} from "@dewo/api/models/GithubPullRequest";
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
        await this.process(
          integrations,
          event,
          this.requestPullRequestReviewFromTaskOwners
        );
        await this.process(integrations, event, this.linkPullRequestToTask);
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

  private async requestPullRequestReviewFromTaskOwners(
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

  private async linkPullRequestToTask(
    event: Github.PullRequestOpenedEvent,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>
  ) {
    const { title, state, html_url, number, body } = event.pull_request;
    const getLinkedIssues = async (body: string) => {
      const closingKeywords = [
        "close",
        "closes",
        "closed",
        "fix",
        "fixes",
        "fixed",
        "resolve",
        "resolves",
        "resolved",
      ];
      const matchedNumbers = body.matchAll(
        new RegExp(`(?:${closingKeywords.join("|")})\\s+#([0-9]+)`, "gi")
      );
      const linkedIssueNumbers = Array.from(matchedNumbers ?? [], (rga) =>
        parseInt(rga[1])
      );
      const issues = await Promise.all(
        linkedIssueNumbers.map((number) =>
          this.github
            .findIssue(number, integration.projectId)
            .catch(() => undefined)
        )
      );
      return issues.filter((i): i is GithubIssue => i !== undefined);
    };

    const issues = await getLinkedIssues(body ?? "");
    this.logger.debug(
      `Searched PR body for linked issues: ${JSON.stringify({
        url: event.pull_request.url,
        issues,
      })}`
    );

    const linkedIssue = issues[0];
    if (!linkedIssue) return;

    const alreadyLinkedTask = await this.getTaskFromPullRequest(
      number,
      integration
    );
    if (alreadyLinkedTask && alreadyLinkedTask.id === linkedIssue.taskId) {
      return;
    }

    const prData: Partial<GithubPullRequest> = {
      title,
      number,
      branchName: event.pull_request.head.ref.replace("refs/head/", ""),
      externalId: linkedIssue.externalId,
      status: {
        open: GithubPullRequestStatus.OPEN,
        closed: GithubPullRequestStatus.CLOSED,
      }[state],
      link: html_url ?? "",
      taskId: linkedIssue.taskId,
    };
    await this.github.createPullRequest(prData);
  }
}
