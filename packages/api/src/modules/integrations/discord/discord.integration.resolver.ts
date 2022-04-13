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
import { DiscordIntegrationRole } from "./dto/DiscordIntegrationRole";
import { Organization } from "@dewo/api/models/Organization";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

registerEnumType(DiscordGuildMembershipState, {
  name: "DiscordGuildMembershipState",
});

@Injectable()
export class DiscordIntegrationResolver {
  constructor(
    private readonly discord: DiscordService,
    private readonly discordIntegration: DiscordIntegrationService,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>
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

  // TODO(fant): do we want to make sure the requesting user is an org admin?
  @Query(() => [DiscordIntegrationRole], { nullable: true })
  public async getDiscordGuildRoles(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<DiscordIntegrationRole[]> {
    return this.discord.getDiscordGuildRoles(organizationId);
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

  @Query(() => [Organization])
  @UseGuards(AuthGuard)
  public async getOrganizationsUserFollowsOnDiscord(
    @Context("user") user: User
  ): Promise<Organization[]> {
    const threepids = await user.threepids;
    const threepid = threepids.find(
      (t): t is Threepid<ThreepidSource.discord> =>
        t.source === ThreepidSource.discord
    );
    if (!threepid) return [];

    const { accessToken } = await this.discord.refreshAccessToken(threepid);
    const guilds = (await new REST({ version: "9" })
      .setToken(accessToken)
      .get(Routes.userGuilds(), { authPrefix: "Bearer" })) as { id: string }[];
    const guildIds = guilds.map((guild) => guild.id);

    if (!guildIds.length) return [];
    return this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoin("organization.integrations", "integration")
      .where("integration.type = :discord", {
        discord: OrganizationIntegrationType.DISCORD,
      })
      .andWhere(`integration."config"->>'guildId' IN (:...guildIds)`, {
        guildIds,
      })
      .getMany();
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
