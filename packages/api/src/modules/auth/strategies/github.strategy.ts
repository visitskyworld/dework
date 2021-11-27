import { PassportStrategy, AbstractStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import { StrategyResponse } from "./types";
import {
  GithubThreepidConfig,
  ThreepidSource,
} from "@dewo/api/models/Threepid";
import { ThreepidService } from "../threepid.service";

const PassportGithubStrategy = PassportStrategy(Strategy) as new (
  ...args: any[]
) => AbstractStrategy & Strategy;

@Injectable()
export class GithubStrategy extends PassportGithubStrategy {
  constructor(
    private readonly threepidService: ThreepidService,
    readonly configService: ConfigService<ConfigType>
  ) {
    super({
      clientID: configService.get<string>("GITHUB_OAUTH_CLIENT_ID"),
      clientSecret: configService.get<string>("GITHUB_OAUTH_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GITHUB_OAUTH_REDIRECT_URI"),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: undefined,
    profile: Profile
  ): Promise<StrategyResponse> {
    const config: GithubThreepidConfig = {
      accessToken,
      refreshToken,
      profile,
    };
    const threepid = await this.threepidService.findOrCreate({
      threepid: profile.id,
      source: ThreepidSource.github,
      config,
    });

    return {
      threepidId: threepid.id,
      userId: threepid.userId,
    };
  }
}
