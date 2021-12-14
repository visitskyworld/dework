import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { ConfigType } from "../app/config";
import { ProjectService } from "../project/project.service";
import { StrategyResponse } from "./strategies/types";
import { GithubPullRequestService } from "../githubPullRequest/githubPullRequest.service";
import {
  GithubPullRequestojectIntegrationFeature,
  ProjectIntegrationSource,
} from "../../models/ProjectIntegration";
import {
  GithubPullRequest,
  GithubPullRequestStatusEnum,
} from "@dewo/api/models/GithubPullRequest";

type RequestFromCallback = Request & { user: StrategyResponse };

type GithubPullRequestPayload = Omit<
  GithubPullRequest,
  "id" | "createdAt" | "updatedAt" | "task"
>;

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly projectService: ProjectService,
    private readonly githubPullRequestService: GithubPullRequestService
  ) {}

  @Get("github")
  @UseGuards(AuthGuard("github"))
  async github() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req: RequestFromCallback, @Res() res: Response) {
    res.redirect(
      `${this.getAppUrl(req.user.state)}/auth/3pid/${
        req.user.threepidId
      }?state=${req.user.state ?? ""}`
    );
    return req.user;
  }

  // Called from Github when user finishes gh app installation
  @Get("github/app-callback")
  async githubAppCallback(@Req() req: any, @Res() res: Response) {
    // First create a ProjectIntegration in the db
    const stateString = req.query.state;
    const installationId = req.query.installation_id;
    const { creatorId, projectId, organizationId } = JSON.parse(stateString);

    await this.projectService.createIntegration({
      creatorId,
      projectId,
      source: ProjectIntegrationSource.github,
      config: {
        organizationId,
        installationId,
        features: [GithubPullRequestojectIntegrationFeature.ADD_WEBHOOK],
      },
    });

    // Then redirect user back to app
    res.redirect(this.getAppUrl(stateString));
  }

  @Post("github/webhook")
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

  @Get("discord")
  @UseGuards(AuthGuard("discord"))
  async discord() {}

  @Get("discord/callback")
  @UseGuards(AuthGuard("discord"))
  async discordCallback(@Req() req: RequestFromCallback, @Res() res: Response) {
    res.redirect(
      `${this.getAppUrl(req.user.state)}/auth/3pid/${
        req.user.threepidId
      }?state=${req.user.state ?? ""}`
    );
    return req.user;
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
