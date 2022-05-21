import { GithubIssue } from "@dewo/api/models/GithubIssue";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import {
  TaskCreatedEvent,
  TaskUpdatedEvent,
} from "@dewo/api/modules/task/task.events";
import { Injectable, Logger } from "@nestjs/common";
import { Octokit } from "@octokit/rest";
import { IntegrationService } from "../../integration.service";
import { GithubService } from "../github.service";

@Injectable()
export class GithubSyncOutgoingService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly github: GithubService,
    private readonly integrationService: IntegrationService
  ) {}

  public async handle(event: TaskCreatedEvent | TaskUpdatedEvent) {
    const integration = await this.integrationService.findProjectIntegration(
      event.task.projectId,
      ProjectIntegrationType.GITHUB
    );
    const orgInt = (await integration?.organizationIntegration) as
      | OrganizationIntegration<OrganizationIntegrationType.GITHUB>
      | undefined;
    if (!integration || !orgInt) return;
    const client = this.github.createClient(orgInt.config.installationId);

    this.logger.log(`Handle event: ${JSON.stringify(event)}`);

    if (event.diff.has("assignees")) {
      const issue = await event.task.githubIssue;
      if (!!issue) {
        await this.assigneesChanged(
          issue,
          integration,
          event.task.assignees,
          event.prevTask?.assignees ?? [],
          client
        );
      }
    }

    if (event.diff.has("owners")) {
      const pullRequests = await event.task.githubPullRequests;
      for (const pullRequest of pullRequests) {
        await this.ownersChanged(
          pullRequest,
          integration,
          event.task.owners,
          event.prevTask?.owners ?? [],
          client
        );
      }
    }

    if (event.diff.has("status")) {
      const issue = await event.task.githubIssue;
      if (!!issue) {
        await this.statusChanged(
          issue,
          integration,
          client,
          event.task,
          event.prevTask
        );
      }
    }
  }

  private async statusChanged(
    issue: GithubIssue,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    client: Octokit,
    task: Task,
    prevTask?: Task
  ) {
    if (!prevTask?.status) return;

    if (
      task.status === TaskStatus.DONE &&
      prevTask.status !== TaskStatus.DONE
    ) {
      await client.issues.update({
        owner: integration.config.organization,
        repo: integration.config.repo,
        issue_number: issue.number,
        state: "closed",
      });
    } else if (
      prevTask.status === TaskStatus.DONE &&
      task.status !== TaskStatus.DONE
    ) {
      await client.issues.update({
        owner: integration.config.organization,
        repo: integration.config.repo,
        issue_number: issue.number,
        state: "open",
      });
    }
  }

  private async assigneesChanged(
    issue: GithubIssue,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    assignees: User[],
    prevAssignees: User[],
    client: Octokit
  ) {
    const githubUsernames = await this.github.getGithubUsernames(
      [...assignees, ...(prevAssignees ?? [])].map((u) => u.id)
    );

    const usernamesToAdd = assignees
      .filter((a) => !prevAssignees.some((pa) => pa.id === a.id))
      .map((a) => githubUsernames[a.id])
      .filter((id): id is string => !!id);
    const usernamesToRemove = prevAssignees
      ?.filter((a) => !assignees.some((pa) => pa.id === a.id))
      .map((a) => githubUsernames[a.id])
      .filter((id): id is string => !!id);

    if (!!usernamesToAdd.length) {
      this.logger.log(
        `Adding assignees to issue: ${JSON.stringify({
          usernamesToAdd,
          issueNumber: issue.number,
          repo: integration.config.repo,
          owner: integration.config.organization,
        })}`
      );
      await client.issues.addAssignees({
        issue_number: issue.number,
        repo: integration.config.repo,
        owner: integration.config.organization,
        assignees: usernamesToAdd,
      });
    }

    if (!!usernamesToRemove.length) {
      this.logger.log(
        `Removing assignees from issue: ${JSON.stringify({
          usernamesToRemove,
          issueNumber: issue.number,
          repo: integration.config.repo,
          owner: integration.config.organization,
        })}`
      );
      await client.issues.removeAssignees({
        issue_number: issue.number,
        repo: integration.config.repo,
        owner: integration.config.organization,
        assignees: usernamesToRemove,
      });
    }
  }

  private async ownersChanged(
    pullRequest: GithubPullRequest,
    integration: ProjectIntegration<ProjectIntegrationType.GITHUB>,
    owners: User[],
    prevOwners: User[],
    client: Octokit
  ) {
    const githubUsernames = await this.github.getGithubUsernames(
      [...owners, ...(prevOwners ?? [])].map((u) => u.id)
    );

    const usernamesToAdd = owners
      .filter((a) => !prevOwners.some((pa) => pa.id === a.id))
      .map((a) => githubUsernames[a.id])
      .filter((id): id is string => !!id);
    const usernamesToRemove = prevOwners
      ?.filter((a) => !owners.some((pa) => pa.id === a.id))
      .map((a) => githubUsernames[a.id])
      .filter((id): id is string => !!id);

    if (!!usernamesToAdd.length) {
      this.logger.log(
        `Adding reviewers to PR: ${JSON.stringify({
          usernamesToAdd,
          issueNumber: pullRequest.number,
          repo: integration.config.repo,
          owner: integration.config.organization,
        })}`
      );
      await client.pulls.requestReviewers({
        pull_number: pullRequest.number,
        repo: integration.config.repo,
        owner: integration.config.organization,
        reviewers: usernamesToAdd,
      });
    }

    if (!!usernamesToRemove.length) {
      this.logger.log(
        `Removing reviewers from PR: ${JSON.stringify({
          usernamesToRemove,
          issueNumber: pullRequest.number,
          repo: integration.config.repo,
          owner: integration.config.organization,
        })}`
      );
      await client.pulls.removeRequestedReviewers({
        pull_number: pullRequest.number,
        repo: integration.config.repo,
        owner: integration.config.organization,
        reviewers: usernamesToRemove,
      });
    }
  }
}
