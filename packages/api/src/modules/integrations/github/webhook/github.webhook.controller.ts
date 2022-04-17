import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import * as Github from "@octokit/webhooks-types";
import {
  GithubPullRequest,
  GithubPullRequestStatus,
} from "@dewo/api/models/GithubPullRequest";
import { ConfigType } from "../../../app/config";
import { GithubService } from "../github.service";
import { TaskService } from "../../../task/task.service";
import { IntegrationService } from "../../integration.service";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { GithubIntegrationService } from "../github.integration.service";
import { DiscordIntegrationService } from "../../discord/discord.integration.service";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { GithubProjectIntegrationFeature } from "@dewo/api/models/ProjectIntegration";
import * as qs from "query-string";
import { GithubSyncIncomingService } from "../sync/github.sync.incoming";

type GithubPullRequestPayload = Pick<
  GithubPullRequest,
  | "title"
  | "status"
  | "number"
  | "branchName"
  | "link"
  | "taskId"
  | "externalId"
>;

function PreventConcurrency(): MethodDecorator {
  let promise = Promise.resolve();
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      await promise;
      promise = promise.finally(() => fn.apply(this, args));
      return promise;
    };
  };
}

@Controller("github")
export class GithubWebhookController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly integrationService: IntegrationService,
    private readonly taskService: TaskService,
    private readonly githubService: GithubService,
    private readonly githubIntegrationService: GithubIntegrationService,
    private readonly discordIntegrationService: DiscordIntegrationService,
    private readonly githubSyncIncomingService: GithubSyncIncomingService
  ) {}

  // Hit when user finishes the GH app installation
  @Get("app-callback")
  async githubAppCallback(@Req() { query }: Request, @Res() res: Response) {
    const stateString = query.state as string;
    const installationId = Number(query.installation_id);
    const { creatorId, organizationId, appUrl, ...redirectProps } =
      JSON.parse(stateString);

    await this.integrationService.upsertOrganizationIntegration({
      creatorId,
      organizationId,
      type: OrganizationIntegrationType.GITHUB,
      config: { installationId },
    });

    res.redirect(
      `${this.getAppUrl(stateString)}?${qs.stringify(redirectProps)}`
    );
  }

  @Post("webhook")
  @PreventConcurrency()
  async githubWebhook(@Req() request: Request) {
    const event = request.body as Github.WebhookEvent;
    this.log("Incoming Github webhook", event);

    await this.githubSyncIncomingService.handleWebhook(event);

    if (
      !("installation" in event) ||
      !("repository" in event) ||
      !event.installation ||
      !event.repository
    ) {
      this.log("No Github installation in event", {});
      return;
    }

    const [integration] = await this.githubService.findIntegrations(
      event.repository.owner.login,
      event.repository.name
    );
    if (!integration) {
      this.log("No integration found for Github installation", event);
      return;
    }

    this.log("Found project integration for Github installation", integration);
    if ("issue" in event) {
      const project = await integration.project;
      await this.githubIntegrationService.updateIssue(event.issue, project);
    }

    if (
      "ref" in event &&
      integration.config.features.includes(
        GithubProjectIntegrationFeature.SHOW_BRANCHES
      )
    ) {
      const result = await this.getBranchAndTask(
        event.ref,
        event.repository,
        event.installation.id
      );
      if (!result) return;
      const {
        task,
        branchName,
        organization: githubOrganizationSlug,
        repo,
      } = result;

      const branch = await this.githubService.findBranchByName(branchName);
      if (branch) {
        this.log("Found existing branch", {
          name: branchName,
          repo: branch.repo,
          organization: branch.organization,
        });

        if ("deleted" in event && event.deleted) {
          await this.githubService.updateBranch({
            id: branch.id,
            deletedAt: new Date(),
          });
        } else {
          await this.githubService.updateBranch({
            id: branch.id,
            deletedAt: null!,
          });
        }
      } else {
        await this.githubService.createBranch({
          name: branchName,
          repo,
          organization: githubOrganizationSlug,
          link: `https://github.com/${githubOrganizationSlug}/${repo}/compare/${branchName}`,
          taskId: task.id,
        });
        this.log("Created a new branch", {
          name: branchName,
          repo,
          githubOrganizationSlug,
        });
      }

      if (task.status === TaskStatus.TODO) {
        await this.taskService.update({
          id: task.id,
          status: TaskStatus.IN_PROGRESS,
        });
        this.log("Moving task into IN_PROGRESS", {
          id: task.id,
          name: task.name,
        });
      } else {
        await this.triggerTaskUpdatedSubscription(task.id);
      }
    }

    if (
      "pull_request" in event &&
      integration.config.features.includes(
        GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS
      )
    ) {
      const result = await this.getBranchAndTask(
        event.pull_request.head.ref,
        event.repository,
        event.installation.id
      );
      if (!result) return;
      const { task, branchName } = result;

      const { id, title, state, html_url, number, draft } = event.pull_request;
      const pr = await this.githubService.findPullRequestByTaskId(task.id);
      const prData: GithubPullRequestPayload = {
        title,
        number,
        branchName,
        externalId: id,
        status: {
          open: GithubPullRequestStatus.OPEN,
          closed: GithubPullRequestStatus.CLOSED,
        }[state],
        link: html_url,
        taskId: task.id,
      };

      if (event.action === "closed") {
        if (!pr) {
          this.log(
            "Closed PR but no GithubPullRequest registered in Dework",
            {}
          );
          return;
        }
        const merged = event.pull_request.merged;
        const status = merged
          ? GithubPullRequestStatus.MERGED
          : GithubPullRequestStatus.CLOSED;
        this.log("Closed PR", { merged, status, prId: pr.id });
        await this.githubService.updatePullRequest({
          ...prData,
          id: pr.id,
          status,
        });

        this.log("Updated PR's status", { title: pr.title, status });

        const subtasks = await task.subtasks;
        const everySubtaskDone = subtasks.every(
          (subTask) => subTask.status === TaskStatus.DONE
        );
        if (merged && everySubtaskDone) {
          await this.taskService.update({
            id: task.id,
            status: TaskStatus.DONE,
          });
          this.log("Updated task status", {
            taskNumber: task.number,
            status: TaskStatus.DONE,
          });
        }
      } else if (event.action === "submitted") {
        const wasSingleCommentAdded = event.review.body === null;
        if (!wasSingleCommentAdded) {
          this.discordIntegrationService.postReviewSubmittal(
            task.id,
            event.review.html_url,
            event.review?.state === "approved"
          );
          this.log("A review was submitted in Github:", {
            pullRequestTitle: prData.title,
            taskId: task.id,
          });
        }
      } else {
        if (pr) {
          await this.githubService.updatePullRequest({ ...prData, id: pr.id });
          this.log("Updated PR", { title: pr.title, taskId: task.id });
        } else {
          await this.githubService.createPullRequest(prData);
          this.log("Created a new PR", {
            title: prData.title,
            taskId: task.id,
          });
        }

        if (!draft) {
          if (task.status !== TaskStatus.IN_REVIEW) {
            await this.taskService.update({
              id: task.id,
              status: TaskStatus.IN_REVIEW,
            });
            this.log("Updated task status", {
              taskNumber: task.number,
              status: TaskStatus.IN_REVIEW,
            });
          } else if (event.action === "review_requested") {
            this.discordIntegrationService.postReviewRequest(
              task,
              event.pull_request.html_url
            );
            this.log("Another review was requested from Github:", {
              pullRequestTitle: prData.title,
              taskId: task.id,
            });
          }
        }
      }

      await this.triggerTaskUpdatedSubscription(task.id);
    }
  }

  private async getBranchAndTask(
    ref: string,
    repository: Github.Repository,
    installationId: number
  ): Promise<
    | { branchName: string; task: Task; organization: string; repo: string }
    | undefined
  > {
    const branchName = ref.replace("refs/head/", "");
    const taskNumber =
      this.githubService.parseTaskNumberFromBranchName(branchName);

    if (!taskNumber) {
      this.log("Failed to parse task number from branch name", branchName);
      return undefined;
    }

    this.log("Parsed task number from branch name", {
      branchName,
      taskNumber,
    });

    const organization = repository.owner.login;
    const repo = repository.name;

    const task = await this.githubService.findTask({
      taskNumber,
      installationId,
      organization,
      repo,
    });

    if (!task) {
      this.log("Failed to find task", { taskNumber, installationId });
      return undefined;
    }

    this.log("Found task", { taskId: task.id, taskNumber, installationId });
    return { task, branchName, organization, repo };
  }

  private async triggerTaskUpdatedSubscription(taskId: string) {
    await this.taskService.update({ id: taskId });
  }

  private getAppUrl(stateString: unknown): string {
    try {
      if (typeof stateString === "string") {
        const state = JSON.parse(stateString);
        if (!!state.appUrl) return state.appUrl;
      }
    } catch {}
    return this.configService.get("APP_URL") as string;
  }

  private log(description: string, body: any): void {
    this.logger.debug(`${description}: ${JSON.stringify(body)}`);
  }
}
