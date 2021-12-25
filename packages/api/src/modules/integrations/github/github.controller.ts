import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import {
  GithubPullRequest,
  GithubPullRequestStatusEnum,
} from "@dewo/api/models/GithubPullRequest";
import {
  ProjectIntegrationSource,
  GithubProjectIntegrationFeature,
} from "@dewo/api/models/ProjectIntegration";
import { ConfigType } from "../../app/config";
import { GithubService } from "./github.service";
import { ProjectService } from "../../project/project.service";
import { TaskStatusEnum } from "@dewo/api/models/Task";
import { TaskService } from "../../task/task.service";

type GithubPullRequestPayload = Pick<
  GithubPullRequest,
  "title" | "status" | "number" | "branchName" | "link" | "taskId"
>;

@Controller("github")
export class GithubController {
  private readonly logger = new Logger("GithubController");

  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly githubService: GithubService
  ) {}

  // Hit when user finishes the GH app installation
  @Get("app-callback")
  async githubAppCallback(@Req() { query }: Request, @Res() res: Response) {
    const stateString = query.state as string;
    const installationId = query.installation_id as string;
    const { creatorId, projectId } = JSON.parse(stateString);

    await this.projectService.createIntegration({
      creatorId,
      projectId,
      source: ProjectIntegrationSource.github,
      config: {
        installationId,
        features: [GithubProjectIntegrationFeature.ADD_PR_TO_TASK],
      },
    });

    res.redirect(this.getAppUrl(stateString));
  }

  @Post("webhook")
  async githubWebhook(@Req() { body }: Request) {
    this.log("Incoming Github webhook", body);

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
    const task = await this.githubService.findTask(taskNumber, installationId);

    if (!task) {
      this.log("Failed to find task", { taskNumber, installationId });
      return;
    }

    this.log("Found task", { taskId: task.id, taskNumber, installationId });

    // Then handle branch and pull request updates separately
    const branch = await this.githubService.findBranchByName(branchName);
    if (branch) {
      this.log("Found branch in db", { id: branch.id, name: branchName });

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
      const repository = body.repository.full_name;
      this.log("Creating new branch in db", { name: branchName, repository });

      await this.githubService.createBranch({
        name: branchName,
        repository,
        link: `https://github.com/${repository}/compare/${branchName}`,
        taskId: task.id,
      });
      await this.triggerTaskUpdatedSubscription(task.id);
    }

    if (body.pull_request) {
      const { title, state, html_url, number } = body.pull_request;

      // Check if there's an existing DB entry for this pr
      const pr = await this.githubService.findPullRequestByTaskId(task.id);
      const newPr: GithubPullRequestPayload = {
        title,
        number,
        branchName,
        status: state.toUpperCase() as GithubPullRequestStatusEnum, // TODO: map
        link: html_url,
        taskId: task.id,
      };

      if (pr) {
        await this.githubService.updatePullRequest({ ...newPr, id: pr.id });
      } else {
        await this.githubService.createPullRequest(newPr);
        if (task.status === TaskStatusEnum.IN_PROGRESS) {
          await this.taskService.update({
            id: task.id,
            status: TaskStatusEnum.IN_REVIEW,
          });
        }
      }

      await this.triggerTaskUpdatedSubscription(task.id);
    }
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
