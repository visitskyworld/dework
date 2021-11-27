import { PassportStrategy, AbstractStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";

const PassportGithubStrategy = PassportStrategy(Strategy) as new (
  ...args: any[]
) => AbstractStrategy & Strategy;

@Injectable()
export class GithubStrategy extends PassportGithubStrategy {
  constructor(readonly configService: ConfigService<ConfigType>) {
    super({
      clientID: configService.get<string>("GITHUB_OAUTH_CLIENT_ID"),
      clientSecret: configService.get<string>("GITHUB_OAUTH_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GITHUB_OAUTH_REDIRECT_URI"),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    console.warn({ accessToken, refreshToken, profile });
    return {
      provider: "github",
    };
  }
}
