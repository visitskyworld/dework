import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import * as Github from "@octokit/webhooks-types";
import {
  GithubPullRequest,
  GithubPullRequestStatus,
} from "@dewo/api/models/GithubPullRequest";
import { ConfigType } from "../../app/config";
import { GithubService } from "./github.service";
import { TaskService } from "../../task/task.service";
import { IntegrationService } from "../integration.service";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { GithubIntegrationService } from "./github.integration.service";
import { Task, TaskStatus } from "@dewo/api/models/Task";

// The actions Github's API uses
export enum GithubPullRequestActions {
  OPENED = "opened",
  REOPENED = "reopened",
  CLOSED = "closed",
  READY_FOR_REVIEW = "ready_for_review", // When PR is updated from draft -> open
}

type GithubPullRequestPayload = Pick<
  GithubPullRequest,
  "title" | "status" | "number" | "branchName" | "link" | "taskId"
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
export class GithubController {
  private readonly logger = new Logger("GithubController");

  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly integrationService: IntegrationService,
    private readonly taskService: TaskService,
    private readonly githubService: GithubService,
    private readonly githubIntegrationService: GithubIntegrationService
  ) {}

  // Hit when user finishes the GH app installation
  @Get("app-callback")
  async githubAppCallback(@Req() { query }: Request, @Res() res: Response) {
    const stateString = query.state as string;
    const installationId = Number(query.installation_id);
    const { creatorId, organizationId } = JSON.parse(stateString);

    await this.integrationService.createOrganizationIntegration({
      creatorId,
      organizationId,
      type: OrganizationIntegrationType.GITHUB,
      config: { installationId },
    });

    res.redirect(this.getAppUrl(stateString));
  }

  @Post("webhook")
  @PreventConcurrency()
  async githubWebhook(@Req() request: Request) {
    const event = request.body as Github.WebhookEvent;
    this.log("Incoming Github webhook", event);

    if (
      !("installation" in event) ||
      !("repository" in event) ||
      !event.installation ||
      !event.repository
    ) {
      this.log("No Github installation in event", {});
      return;
    }

    const integration = await this.githubService.findIntegration(
      event.installation.id,
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

    if ("ref" in event && "installation" in event) {
      const result = await this.getBranchAndTask(
        event.ref,
        event.repository,
        event.installation.id
      );
      if (!result) return;
      const { task, branchName, organization, repo } = result;

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

        await this.triggerTaskUpdatedSubscription(task.id);
      } else {
        await this.githubService.createBranch({
          name: branchName,
          repo,
          organization,
          link: `https://github.com/${organization}/${repo}/compare/${branchName}`,
          taskId: task.id,
        });
        this.log("Created a new branch", {
          name: branchName,
          repo,
          organization,
        });

        await this.triggerTaskUpdatedSubscription(task.id);
      }
    }

    if ("pull_request" in event) {
      const result = await this.getBranchAndTask(
        event.pull_request.head.ref,
        event.repository,
        event.installation.id
      );
      if (!result) return;
      const { task, branchName } = result;

      const { title, state, html_url, number, draft } = event.pull_request;
      const pr = await this.githubService.findPullRequestByTaskId(task.id);
      const prData: GithubPullRequestPayload = {
        title,
        number,
        branchName,
        status: {
          open: GithubPullRequestStatus.OPEN,
          closed: GithubPullRequestStatus.CLOSED,
        }[state],
        link: html_url,
        taskId: task.id,
      };

      if (event.action === "closed") {
        if (!pr) return;
        const merged = event.pull_request.merged;
        const status = merged
          ? GithubPullRequestStatus.MERGED
          : GithubPullRequestStatus.CLOSED;
        await this.githubService.updatePullRequest({
          ...prData,
          id: pr.id,
          status,
        });

        this.log("Updated PR's status", { title: pr.title, status });

        if (merged) {
          await this.taskService.update({
            id: task.id,
            status: TaskStatus.DONE,
          });
          this.log("Updated task status", {
            taskNumber: task.number,
            status: TaskStatus.DONE,
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
          await this.taskService.update({
            id: task.id,
            status: TaskStatus.IN_REVIEW,
          });
          this.log("Updated task status", {
            taskNumber: task.number,
            status: TaskStatus.IN_REVIEW,
          });
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
