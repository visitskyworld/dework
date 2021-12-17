import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import {
  GithubPullRequest,
  GithubPullRequestStatusEnum,
} from "@dewo/api/models/GithubPullRequest";
import {
  ProjectIntegrationSource,
  GithubProjectIntegrationFeature,
} from "@dewo/api/models/ProjectIntegration";
import { Task } from "@dewo/api/models/Task";
import { GithubBranch } from "@dewo/api/models/GithubBranch";
import { ConfigType } from "../../app/config";
import { GithubService } from "./github.service";
import { TaskService } from "../../task/task.service";
import { ProjectService } from "../../project/project.service";

type GithubPullRequestPayload = Pick<
  GithubPullRequest,
  "title" | "status" | "link" | "taskId"
>;

type GithubBranchPayLoad = Pick<
  GithubBranch,
  "name" | "repository" | "link" | "taskId"
>;

@Controller("github")
export class GithubController {
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
    // First validate the event's installation and taskId
    const branchName = body.pull_request?.head?.ref ?? body.ref;
    const task = await this.getTaskFromBranch(branchName);
    if (!task) return;
    const installationId = body.installation.id;
    const isValidIntegration = await this.projectService.findIntegration(
      installationId,
      task.projectId,
      ProjectIntegrationSource.github
    );
    if (!isValidIntegration) return;

    // Then handle branch and pull request updates separately
    if (body.commits?.length > 0) {
      const repository = body.repository.full_name;
      const branch = await this.githubService.findBranchByName(branchName);
      const newBranch: GithubBranchPayLoad = {
        name: branchName.replace("refs/heads/", ""),
        repository,
        link: `https://github.com/${repository}/compare/${branchName}`,
        taskId: task.id,
      };

      if (branch) {
        await this.githubService.updateBranch(branch);
      } else {
        await this.githubService.createBranch(newBranch);
      }
    }
    if (body.pull_request) {
      const { title, state, html_url } = body.pull_request;

      // Check if there's an existing DB entry for this pr
      const pr = await this.githubService.findPullRequestByTaskId(task.id);
      const newPr: GithubPullRequestPayload = {
        title,
        status: state.toUpperCase() as GithubPullRequestStatusEnum, // TODO: map
        link: html_url,
        taskId: task.id,
      };

      if (pr) {
        await this.githubService.updatePullRequest({ ...newPr, id: pr.id });
      } else {
        await this.githubService.createPullRequest(newPr);
      }
    }
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

  private async getTaskFromBranch(
    branchName: string
  ): Promise<Task | undefined> {
    const taskId = branchName?.match(/\/dw-([a-z0-9-]+)\//)?.[1];
    if (!taskId || taskId.length > 36) return undefined;

    // Check there's an actual existing task associated with the branch's taskId
    const associatedTask = await this.taskService.findById(taskId);
    return associatedTask;
  }
}
