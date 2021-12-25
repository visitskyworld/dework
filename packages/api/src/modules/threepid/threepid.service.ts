import _ from "lodash";
import LocaleCode from "locale-code";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindConditions, Repository } from "typeorm";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { AtLeast } from "@dewo/api/types/general";

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

    if (!!found) return found;
    return this.create(partial);
  }

  public getImageUrl(threepid: Threepid): string | undefined {
    switch (threepid.source) {
      case ThreepidSource.discord:
        const profile = (threepid as Threepid<ThreepidSource.discord>).config
          .profile;
        if (!profile.avatar) return undefined;
        return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg`;
      case ThreepidSource.github:
        return (threepid as Threepid<ThreepidSource.github>).config.profile
          .photos?.[0]?.value;
    }
  }

  public getUsername(threepid: Threepid): string {
    switch (threepid.source) {
      case ThreepidSource.discord: {
        const config = (threepid as Threepid<ThreepidSource.discord>).config;
        return config.profile.username;
      }
      case ThreepidSource.github: {
        const config = (threepid as Threepid<ThreepidSource.github>).config;
        if (!!config.profile.username) return config.profile.username;
        break;
      }
    }

    return "deworker";
  }

  public getLocation(threepid: Threepid): string | undefined {
    switch (threepid.source) {
      case ThreepidSource.discord:
        const locale = (threepid as Threepid<ThreepidSource.discord>).config
          .profile.locale;
        return LocaleCode.getCountryName(locale);
      case ThreepidSource.github:
        const githubThreepidConfigProfileJson = (
          threepid as Threepid<ThreepidSource.github>
        ).config.profile._json as GithubThreepidConfigProfileJson;
        if (!githubThreepidConfigProfileJson?.location) return undefined;
        return githubThreepidConfigProfileJson.location;
    }
  }
}
