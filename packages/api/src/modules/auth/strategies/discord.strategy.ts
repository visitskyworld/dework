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

const PassportDiscordStrategy = (name?: string) =>
  PassportStrategy(Strategy, name) as new (...args: any[]) => AbstractStrategy &
    Strategy;

@Injectable()
export class DiscordStrategy extends PassportDiscordStrategy() {
  constructor(
    private readonly threepidService: ThreepidService,
    readonly config: ConfigService<ConfigType>
  ) {
    super({
      clientID: config.get<string>("MAIN_DISCORD_OAUTH_CLIENT_ID"),
      clientSecret: config.get<string>("MAIN_DISCORD_OAUTH_CLIENT_SECRET"),
      callbackURL: `${config.get<string>("API_URL")}/auth/discord/callback`,
      scope: ["identify", "guilds"],
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

    return {
      threepidId: threepid.id,
      userId: threepid.userId,
      state: req.query.state,
    };
  }
}

@Injectable()
export class DiscordJoinGuildStrategy extends PassportDiscordStrategy(
  "discord-join-guild"
) {
  constructor(readonly config: ConfigService<ConfigType>) {
    super({
      clientID: config.get<string>("MAIN_DISCORD_OAUTH_CLIENT_ID"),
      clientSecret: config.get<string>("MAIN_DISCORD_OAUTH_CLIENT_SECRET"),
      callbackURL: `${config.get<string>("API_URL")}/auth/discord/callback`,
      scope: ["identify", "guilds", "guilds.join"],
      passReqToCallback: true,
    });
  }

  authenticate(req: Request, options: any): void {
    options.state = req.query.state;
    super.authenticate(req, options);
  }

  async validate() {}
}
