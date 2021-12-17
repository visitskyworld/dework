import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { ConfigType } from "../app/config";
import { StrategyResponse } from "./strategies/types";

type RequestFromCallback = Request & { user: StrategyResponse };

@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService<ConfigType>) {}

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

  @Get("discord-bot")
  @UseGuards(AuthGuard("discord-bot"))
  async discordBot() {}

  @Get("discord-bot/callback")
  @UseGuards(AuthGuard("discord-bot"))
  async discordBotCallback(
    @Req() req: RequestFromCallback,
    @Res() res: Response
  ) {
    return { ok: true };
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
