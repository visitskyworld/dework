import _ from "lodash";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindConditions, Repository } from "typeorm";
import {
  DiscordThreepidConfig,
  GithubThreepidConfig,
  Threepid,
  ThreepidSource,
} from "@dewo/api/models/Threepid";
import { AtLeast } from "@dewo/api/types/general";
import { ethers } from "ethers";

type GithubThreepidConfigProfileJson = {
  location: string;
};

@Injectable()
export class ThreepidService {
  // private readonly logger = new Logger("ThreepidService");

  constructor(
    @InjectRepository(Threepid)
    private readonly threepidRepo: Repository<Threepid>
  ) {}

  public create(
    partial: AtLeast<Threepid, "source" | "threepid" | "config">
  ): Promise<Threepid> {
    return this.threepidRepo.save(partial);
  }

  public findOne(
    partial: DeepPartial<Threepid>
  ): Promise<Threepid | undefined> {
    return this.threepidRepo.findOne(_.omit(partial, ["user"]));
  }

  public find(query: FindConditions<Threepid>): Promise<Threepid[]> {
    return this.threepidRepo.find(query);
  }

  public findById(id: string): Promise<Threepid | undefined> {
    return this.threepidRepo.findOne(id);
  }

  public update(partial: DeepPartial<Threepid>): Promise<Threepid> {
    return this.threepidRepo.save(partial);
  }

  public async findOrCreate(
    partial: AtLeast<Threepid, "source" | "threepid" | "config">
  ): Promise<Threepid> {
    const found = await this.findOne({
      source: partial.source,
      threepid: partial.threepid,
    });

    if (!!found) {
      await this.update({ id: found.id, ...partial });
      return this.findById(found.id) as Promise<Threepid>;
    }
    return this.create(partial);
  }

  public async getImageUrl(threepid: Threepid): Promise<string | undefined> {
    switch (threepid.source) {
      case ThreepidSource.discord:
        const profile = this.getDiscordThreePidConfig(threepid).profile;
        if (!profile.avatar) return undefined;
        return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg`;
      case ThreepidSource.github:
        return this.getGithubThreePidConfig(threepid).profile.photos?.[0]
          ?.value;
      case ThreepidSource.metamask:
        if (process.env.NODE_ENV !== "test") {
          return (
            (await ethers.getDefaultProvider().getAvatar(threepid.threepid)) ??
            undefined
          );
        }
    }
  }

  public async getUsername(threepid: Threepid): Promise<string> {
    switch (threepid.source) {
      case ThreepidSource.discord: {
        return this.getDiscordThreePidConfig(threepid).profile.username;
      }
      case ThreepidSource.github: {
        const githubUsername =
          this.getGithubThreePidConfig(threepid).profile.username;
        if (!!githubUsername) return githubUsername;
        break;
      }
      case ThreepidSource.metamask: {
        if (process.env.NODE_ENV !== "test") {
          const resolved = await ethers
            .getDefaultProvider()
            .lookupAddress(threepid.threepid);
          if (!!resolved) return resolved;
        }
        break;
      }
    }

    return "deworker";
  }

  public getLocation(threepid: Threepid): string | undefined {
    switch (threepid.source) {
      case ThreepidSource.github:
        const githubThreepidConfigProfileJson = this.getGithubThreePidConfig(
          threepid
        ).profile._json as GithubThreepidConfigProfileJson;
        return githubThreepidConfigProfileJson?.location;
    }
  }

  public getProfileDetail(
    threepid: Threepid<ThreepidSource.github | ThreepidSource.discord>
  ): string {
    switch (threepid.source) {
      case ThreepidSource.discord:
        const discordProfile = this.getDiscordThreePidConfig(threepid).profile;
        return `${discordProfile.username}#${discordProfile.discriminator}`;
      case ThreepidSource.github:
        return this.getGithubThreePidConfig(threepid).profile.profileUrl;
    }
  }

  private getDiscordThreePidConfig(threepid: Threepid): DiscordThreepidConfig {
    return threepid.config as DiscordThreepidConfig;
  }

  private getGithubThreePidConfig(threepid: Threepid): GithubThreepidConfig {
    return threepid.config as GithubThreepidConfig;
  }
}
