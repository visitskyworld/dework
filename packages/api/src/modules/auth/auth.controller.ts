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
    // @ts-ignore
    res.redirect(
      `${this.configService.get("APP_URL")}/auth/3pid/${
        req.user.threepidId
      }?state=${req.user.state}`
    );
    return req.user;
  }

  @Get("discord")
  @UseGuards(AuthGuard("discord"))
  async discord() {}

  @Get("discord/callback")
  @UseGuards(AuthGuard("discord"))
  async discordCallback(@Req() req: RequestFromCallback, @Res() res: Response) {
    // @ts-ignore
    res.redirect(
      `${this.configService.get("APP_URL")}/auth/3pid/${
        req.user.threepidId
      }?state=${req.user.state}`
    );
    return req.user;
  }
}
