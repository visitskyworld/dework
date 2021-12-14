import { ProjectIntegrationSource } from "@dewo/api/models/ProjectIntegration";
import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { ConfigType } from "../app/config";
import { ProjectService } from "../project/project.service";
import { StrategyResponse } from "./strategies/types";
import { GithubPrService } from "../githubPr/githubPr.service";
import { GithubPr, GithubPrStatusEnum } from "@dewo/api/models/GithubPr";

type RequestFromCallback = Request & { user: StrategyResponse };

type GithubPrPayload = Omit<
  GithubPr,
  "id" | "createdAt" | "updatedAt" | "task"
>;

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly projectService: ProjectService,
    private readonly githubPrService: GithubPrService
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
  async githubAppCallbac(@Req() req: any, @Res() res: Response) {
    // First create a ProjectIntegration in the db
    const stateString = req.query.state;
    const installationId = req.query.installation_id;
    const { creatorId, projectId, organizationId } = JSON.parse(stateString);

    this.projectService.createIntegration({
      creatorId,
      projectId,
      source: ProjectIntegrationSource.github,
      config: {
        organizationId,
        installationId,
      },
    });

    // Then redirect user back to app
    res.redirect(this.getAppUrl(stateString));
  }

  // TODO: move to a separate controller
  @Post("github/webhook")
  async githubWebhook(@Req() req: any) {
    if (req.body.pull_request) {
      const { title, body, state, html_url } = req.body.pull_request;

      if (!body) return;

      const existingPr = await this.githubPrService.findByTaskId(body);
      const githubPr: GithubPrPayload = {
        title,
        status: state.toUpperCase() as GithubPrStatusEnum, // TODO: map
        link: html_url,
        taskId: body,
      };

      if (existingPr) {
        this.githubPrService.update({ ...githubPr, id: existingPr.id });
      } else {
        this.githubPrService.create(githubPr);
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
