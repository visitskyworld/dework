/*
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { Project } from "@dewo/api/models/Project";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { DiscordService } from "./discord.service";
import { User } from "@dewo/api/models/User";
import { DiscordGuild } from "./dto/DiscordGuild";
import { DiscordChannel } from "./dto/DiscordChannel";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { AuthGuard } from "../../auth/guards/auth.guard";

@Resolver(() => Project)
@Injectable()
export class DiscordIntegrationResolver {
  constructor(private readonly discord: DiscordService) {}

  @Query(() => [DiscordGuild])
  @UseGuards(AuthGuard)
  public async discordListGuilds(
    @Context("user") user: User
  ): Promise<DiscordGuild[]> {
    const threepids = await user.threepids;
    const discordThreepid = threepids.find(
      (t): t is Threepid<ThreepidSource.discord> =>
        t.source === ThreepidSource.discord
    );
    if (!discordThreepid) {
      throw new NotFoundException("No Discord threepid found");
    }

    // TODO(fant): refresh token first
    const rest = new REST().setToken(discordThreepid.config.accessToken);

    const guilds = (await rest.get(Routes.userGuilds(), {
      authPrefix: "Bearer",
    })) as any[];

    return guilds
      .filter((guild) => Number(guild.permissions) & 2048)
      .map<DiscordGuild>((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: !!guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`
          : undefined,
      }));
  }

  @Query(() => [DiscordChannel])
  public async discordListTextChannels(
    @Args("discordGuildId") discordGuildId: string
  ): Promise<DiscordChannel[]> {
    const guild = await this.discord.client.guilds.fetch(discordGuildId);
    const channels = await guild.channels.fetch();

    return channels
      .map((channel) => channel)
      .filter((channel) => channel.type === "GUILD_TEXT")
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
      }));
  }

  @Mutation(() => ProjectIntegration)
  public async createDiscordProjectIntegration(): Promise<ProjectIntegration> {
    return undefined as any;
  }
}
*/

export const wip = {};
