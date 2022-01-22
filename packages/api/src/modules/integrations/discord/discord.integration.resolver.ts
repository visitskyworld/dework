import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { DiscordIntegrationChannel } from "./dto/DiscordIntegrationChannel";
import { DiscordService } from "./discord.service";
import { DiscordIntegrationService } from "./discord.integration.service";
import { User } from "@dewo/api/models/User";

@Injectable()
export class DiscordIntegrationResolver {
  constructor(
    private readonly discord: DiscordService,
    private readonly discordIntegration: DiscordIntegrationService
  ) {}

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

  @Mutation(() => String)
  public async createTaskDiscordLink(
    @Args("taskId", { type: () => GraphQLUUID }) taskId: string,
    @Context("user") user: User | undefined
  ): Promise<string> {
    return this.discordIntegration.createTaskDiscordLink(taskId, user);
  }
}
