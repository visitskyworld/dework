import { PassportStrategy, AbstractStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-discord";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "@dewo/api/modules/app/config";
import { StrategyResponse } from "./types";
import {
  DiscordThreepidConfig,
  ThreepidSource,
} from "@dewo/api/models/Threepid";
import { ThreepidService } from "../../threepid/threepid.service";
import { Request } from "express";
import { VerifyCallback } from "passport-oauth2";

class DiscordBotStrategyClass extends Strategy {
  constructor(
    options: Strategy.StrategyOptions,
    verify: (
      accessToken: string,
      refreshToken: string,
      profile: Strategy.Profile,
      done: VerifyCallback
    ) => void
  ) {
    super(options, verify);
    this.name = "discord-bot";
  }
}

// http://localhost:8080/auth/discord-bot

const PassportDiscordStrategy = PassportStrategy(
  DiscordBotStrategyClass
) as new (...args: any[]) => AbstractStrategy & Strategy;

@Injectable()
export class DiscordBotStrategy extends PassportDiscordStrategy {
  constructor(
    private readonly threepidService: ThreepidService,
    readonly config: ConfigService<ConfigType>
  ) {
    super({
      clientID: config.get<string>("DISCORD_OAUTH_CLIENT_ID"),
      clientSecret: config.get<string>("DISCORD_OAUTH_CLIENT_SECRET"),
      callbackURL: `${config.get<string>("API_URL")}/auth/discord-bot/callback`,
      scope: ["bot"],
      passReqToCallback: true,
    });
  }

  authenticate(req: Request, options: any): void {
    options.state = req.query.state;
    super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): Promise<StrategyResponse> {
    const config: DiscordThreepidConfig = {
      accessToken,
      refreshToken,
      profile,
    };
    const threepid = await this.threepidService.findOrCreate({
      threepid: profile.id,
      source: ThreepidSource.discord,
      config,
    });

    console.warn(JSON.stringify(threepid, null, 2));

    return {
      threepidId: threepid.id,
      userId: threepid.userId,
      state: req.query.state,
    };
  }
}
