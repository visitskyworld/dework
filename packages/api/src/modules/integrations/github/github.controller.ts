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
    this.logger.debug(`Incoming Github webhook: ${JSON.stringify(body)}`);

    // First validate the event's installation and taskId
    const branchName = body.pull_request?.head?.ref ?? body.ref;
    const taskNumber =
      this.githubService.parseTaskNumberFromBranchName(branchName);

    if (!taskNumber) {
      this.logger.debug(
        `Failed to parse task number from branch name: ${JSON.stringify({
          branchName,
        })}`
      );
      return;
    }

    this.logger.debug(
      `Parsed task number from branch name: ${JSON.stringify({
        branchName,
        taskNumber,
      })}`
    );

    const installationId = body.installation.id;
    const task = await this.githubService.findTask(taskNumber, installationId);

    if (!task) {
      this.logger.debug(
        `Failed to find task: ${JSON.stringify({ taskNumber, installationId })}`
      );
      return;
    }

    this.logger.debug(
      `Found task: ${JSON.stringify({
        taskId: task.id,
        taskNumber,
        installationId,
      })}`
    );

    // Then handle branch and pull request updates separately
    if (body.ref_type === "branch") {
      const repository = body.repository.full_name;
      const branch = await this.githubService.findBranchByName(branchName);

      if (!branch) {
        await this.githubService.createBranch({
          name: branchName.replace("refs/heads/", ""),
          repository,
          link: `https://github.com/${repository}/compare/${branchName}`,
          taskId: task.id,
        });
      }
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
}
