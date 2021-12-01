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

const PassportDiscordStrategy = PassportStrategy(Strategy) as new (
  ...args: any[]
) => AbstractStrategy & Strategy;

@Injectable()
export class DiscordStrategy extends PassportDiscordStrategy {
  constructor(
    private readonly threepidService: ThreepidService,
    readonly configService: ConfigService<ConfigType>
  ) {
    super({
      clientID: configService.get<string>("DISCORD_OAUTH_CLIENT_ID"),
      clientSecret: configService.get<string>("DISCORD_OAUTH_CLIENT_SECRET"),
      callbackURL: configService.get<string>("DISCORD_OAUTH_REDIRECT_URI"),
      // scope: ["identify", "guilds"],
      scope: ["identify", "bot", "guilds"],
    });
  }

  async validate(
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
    };
  }
}
