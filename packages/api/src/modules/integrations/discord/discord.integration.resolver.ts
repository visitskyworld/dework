import { Args, Query } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { DiscordIntegrationChannel } from "./dto/DiscordIntegrationChannel";
import { DiscordService } from "./discord.service";
// import { GithubService } from "./github.service";
// import { GithubRepo } from "./dto/GithubRepo";

@Injectable()
export class DiscordIntegrationResolver {
  constructor(private readonly discord: DiscordService) {}

  // TODO(fant): do we want to make sure the requesting user is an org admin?
  @Query(() => [DiscordIntegrationChannel], { nullable: true })
  public async getDiscordIntegrationChannels(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<DiscordIntegrationChannel[]> {
    return this.discord.getChannels(organizationId);
  }
}
