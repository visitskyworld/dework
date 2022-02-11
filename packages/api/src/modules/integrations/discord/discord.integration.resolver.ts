import {
  Args,
  Context,
  Mutation,
  Query,
  registerEnumType,
} from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { DiscordIntegrationChannel } from "./dto/DiscordIntegrationChannel";
import { DiscordService } from "./discord.service";
import {
  DiscordGuildMembershipState,
  DiscordIntegrationService,
} from "./discord.integration.service";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../../auth/guards/auth.guard";

registerEnumType(DiscordGuildMembershipState, {
  name: "DiscordGuildMembershipState",
});

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

  @Query(() => DiscordGuildMembershipState)
  public async getDiscordGuildMembershipState(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string,
    @Context("user") user: User
  ): Promise<DiscordGuildMembershipState> {
    return this.discordIntegration.getDiscordGuildMembershipState(
      organizationId,
      user.id
    );
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

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  public async addUserToDiscordGuild(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string,
    @Context("user") user: User
  ) {
    await this.discordIntegration.addUserToDiscordGuild(
      organizationId,
      user.id
    );
    return true;
  }
}
