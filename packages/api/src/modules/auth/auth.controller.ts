import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import * as qs from "query-string";
import { Request, Response } from "express";
import * as Discord from "discord.js";
import { ConfigType } from "../app/config";
import { StrategyResponse } from "./strategies/types";
import { IntegrationService } from "../integrations/integration.service";
import {
  DiscordOrganizationIntegrationConfig,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";

type RequestFromCallback = Request & { user: StrategyResponse };

@Controller("auth")
export class AuthController {
  constructor(
    private readonly config: ConfigService<ConfigType>,
    private readonly integrationService: IntegrationService
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
  async discordBot(@Req() req: Request, @Res() res: Response) {
    res.redirect(
      `https://discord.com/api/oauth2/authorize?${qs.stringify({
        response_type: "code",
        // https://discordapi.com/permissions.html
        permissions: new Discord.Permissions([
          Discord.Permissions.FLAGS.MANAGE_THREADS,
          Discord.Permissions.FLAGS.MANAGE_ROLES,
          Discord.Permissions.FLAGS.SEND_MESSAGES,
        ]).bitfield.toString(),
        scope: "bot",
        client_id: this.config.get<string>("DISCORD_OAUTH_CLIENT_ID"),
        state: JSON.stringify(req.query),
        redirect_uri: `${this.config.get<string>(
          "API_URL"
        )}/auth/discord-bot/callback`,
      })}`
    );
  }

  @Get("discord-bot/callback")
  async discordBotCallback(
    @Req() req: RequestFromCallback,
    @Res() res: Response
  ) {
    interface DiscordBotCallbackResponse {
      code: string;
      state?: string;
      guild_id: string;
      permissions: string;
    }

    const query: DiscordBotCallbackResponse = req.query as any;

    try {
      const state = JSON.parse(query.state!);

      if (!!query.guild_id && !!query.permissions) {
        const config: DiscordOrganizationIntegrationConfig = {
          guildId: query.guild_id,
          permissions: query.permissions,
        };

        await this.integrationService.createOrganizationIntegration({
          // TODO(fant): we need to somehow verify that this was the user that initiated the connection
          creatorId: state.userId,
          organizationId: state.organizationId,
          type: OrganizationIntegrationType.DISCORD,
          config,
        });
      }

      const appUrl = this.getAppUrl(query.state);
      const redirectUrl = `${appUrl}${state.redirect ?? ""}`;
      res.redirect(redirectUrl);
    } catch {
      res.redirect(this.config.get("APP_URL") as string);
    }
  }

  private getAppUrl(stateString: unknown): string {
    try {
      if (typeof stateString === "string") {
        const state = JSON.parse(stateString);
        if (!!state.appUrl) return state.appUrl;
      }
    } catch {}
    return this.config.get("APP_URL") as string;
  }
}
