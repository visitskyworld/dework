import { PassportStrategy, AbstractStrategy } from "@nestjs/passport";
import { Strategy } from "passport-notion";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "@dewo/api/modules/app/config";

import { ThreepidService } from "../../threepid/threepid.service";
import { Request } from "express";
import { NotionOAuthToken } from "passport-notion/lib/passport-notion/strategy";
import { StrategyResponse } from "./types";
import {
  NotionThreepidConfig,
  ThreepidSource,
} from "@dewo/api/models/Threepid";

const PassportNotionStrategy = PassportStrategy(Strategy) as new (
  ...args: any[]
) => AbstractStrategy & Strategy;

@Injectable()
export class NotionStrategy extends PassportNotionStrategy {
  constructor(
    private readonly threepidService: ThreepidService,
    readonly config: ConfigService<ConfigType>
  ) {
    super({
      clientID: config.get<string>("NOTION_OAUTH_CLIENT_ID"),
      clientSecret: config.get<string>("NOTION_OAUTH_CLIENT_SECRET"),
      callbackURL: `${config.get<string>("API_URL")}/auth/notion/callback`,
      passReqToCallback: true,
    });
  }

  async authenticate(req: Request, options: any): Promise<void> {
    options.state = req.query.state;
    await super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    _refreshToken: undefined,
    profile: NotionOAuthToken
  ): Promise<StrategyResponse> {
    const config: NotionThreepidConfig = { accessToken, profile };
    const threepid = await this.threepidService.findOrCreate({
      threepid:
        profile.owner.type === "user"
          ? profile.owner.user.id
          : profile.workspace_id,
      source: ThreepidSource.notion,
      config,
    });

    return {
      threepidId: threepid.id,
      userId: threepid.userId,
      state: req.query.state,
    };
  }
}
