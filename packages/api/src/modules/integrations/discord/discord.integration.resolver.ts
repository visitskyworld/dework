import { Args, Mutation, Query } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { DiscordIntegrationChannel } from "./dto/DiscordIntegrationChannel";
import { DiscordService } from "./discord.service";

@Injectable()
export class DiscordIntegrationResolver {
  constructor(private readonly discord: DiscordService) {}

  // TODO(fant): do we want to make sure the requesting user is an org admin?
  @Query(() => [DiscordIntegrationChannel], { nullable: true })
  public async getDiscordIntegrationChannels(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string,
    @Args("discordParentChannelId", { nullable: true })
    parentChannelId: string
  ): Promise<DiscordIntegrationChannel[]> {
    return this.discord.getChannels(organizationId, parentChannelId);
  }

  @Mutation(() => Boolean)
  public async postFeedbackToDiscord(
    @Args("feedbackContent", { type: () => String })
    feedbackContent: string,
    @Args("discordUsername", { type: () => String, nullable: true })
    discordUsername?: string
  ): Promise<boolean> {
    return this.discord.postFeedback(feedbackContent, discordUsername);
  }
}
