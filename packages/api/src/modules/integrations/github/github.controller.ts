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
import { ConfigType } from "../../app/config";
import { ProjectService } from "../../project/project.service";
import { GithubPullRequestService } from "./github.service";
import { queryToString } from "../../../util/queryToString";

type GithubPullRequestPayload = Omit<
  GithubPullRequest,
  "id" | "createdAt" | "updatedAt" | "task"
>;

@Controller("github")
export class GithubController {
  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly projectService: ProjectService,
    private readonly githubPullRequestService: GithubPullRequestService
  ) {}

  // Hit when user finishes the GH app installation
  @Get("app-callback")
  async githubAppCallback(@Req() req: Request, @Res() res: Response) {
    const stateString = queryToString(req.query.state);
    const installationId = queryToString(req.query.installation_id);
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
  async githubWebhook(@Req() req: Request) {
    if (req.body.pull_request) {
      const { title, body, state, html_url } = req.body.pull_request;

      if (!body) return;

      const existingPr = await this.githubPullRequestService.findByTaskId(body);
      const githubPullRequest: GithubPullRequestPayload = {
        title,
        status: state.toUpperCase() as GithubPullRequestStatusEnum, // TODO: map
        link: html_url,
        taskId: body,
      };

      if (existingPr) {
        this.githubPullRequestService.update({
          ...githubPullRequest,
          id: existingPr.id,
        });
      } else {
        this.githubPullRequestService.create(githubPullRequest);
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
