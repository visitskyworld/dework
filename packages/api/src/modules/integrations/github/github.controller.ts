import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { WebhookEvent } from "@octokit/webhooks-types";
import { GithubPullRequest } from "@dewo/api/models/GithubPullRequest";
import { ConfigType } from "../../app/config";
import { GithubService } from "./github.service";
import { TaskService } from "../../task/task.service";
import { IntegrationService } from "../integration.service";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";

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

@Controller("github")
export class GithubController {
  private readonly logger = new Logger("GithubController");

  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly integrationService: IntegrationService,
    private readonly taskService: TaskService,
    private readonly githubService: GithubService
  ) {}

  // Hit when user finishes the GH app installation
  @Get("app-callback")
  async githubAppCallback(@Req() { query }: Request, @Res() res: Response) {
    const stateString = query.state as string;
    const installationId = query.installation_id as string;
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
  async githubWebhook(@Req() request: Request) {
    const event = request.body as WebhookEvent;
    this.log("Incoming Github webhook", event);

    if ("issue" in event) {
      if (event.action === "created") {
      }
    }

    /*
    // First validate the event's installation and taskId
    const branchName = (body.pull_request?.head?.ref ?? body.ref).replace(
      "refs/heads/",
      ""
    );
    const taskNumber =
      this.githubService.parseTaskNumberFromBranchName(branchName);

    if (!taskNumber) {
      this.log("Failed to parse task number from branch name", branchName);
      return;
    }

    this.log("Parsed task number from branch name", { branchName, taskNumber });

    const installationId = body.installation.id;
    const organization = body.repository.owner.login;
    const repo = body.repository.name;

    const task = await this.githubService.findTask({
      taskNumber,
      installationId,
      organization,
      repo,
    });

    if (!task) {
      this.log("Failed to find task", { taskNumber, installationId });
      return;
    }

    this.log("Found task", { taskId: task.id, taskNumber, installationId });

    // Then handle branch and pull request updates separately
    const branch = await this.githubService.findBranchByName(branchName);
    if (branch) {
      this.log("Found existing branch", {
        name: branchName,
        repo: branch.repo,
        organization: branch.organization,
      });

      // Check if it's a deletion push
      if (body.deleted) {
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
      const repo = body.repository.name;
      const organization = body.repository.owner.login;
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

    if (body.pull_request) {
      const { title, state, html_url, number, draft } = body.pull_request;
      const pr = await this.githubService.findPullRequestByTaskId(task.id);
      const newPr: GithubPullRequestPayload = {
        title,
        number,
        branchName,
        status: state.toUpperCase(),
        link: html_url,
        taskId: task.id,
      };

      switch (body.action) {
        case GithubPullRequestActions.CLOSED:
          if (!pr) return;
          const isMerged = body.pull_request.merged as boolean;
          const newStatus = isMerged
            ? GithubPullRequestStatusEnum.MERGED
            : GithubPullRequestStatusEnum.CLOSED;
          await this.githubService.updatePullRequest({
            ...newPr,
            id: pr.id,
            status: newStatus,
          });
          if (isMerged) {
            await this.taskService.update({
              id: task.id,
              status: TaskStatus.DONE,
            });
            this.log("Updated task status", {
              taskNumber: task.number,
              status: TaskStatus.DONE,
            });
          }
          this.log("Updated PR's status", {
            title: pr.title,
            status: newStatus,
          });
          break;
        default:
          if (pr) {
            await this.githubService.updatePullRequest({ ...newPr, id: pr.id });
            this.log("Updated PR", { title: pr.title, taskId: task.id });
          } else {
            await this.githubService.createPullRequest(newPr);
            this.log("Created a new PR", {
              title: newPr.title,
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
          await this.triggerTaskUpdatedSubscription(task.id);
      }
    }
    */
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
