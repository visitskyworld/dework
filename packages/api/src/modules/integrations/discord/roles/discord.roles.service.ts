import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Connection, In, Repository } from "typeorm";
import * as Colors from "@ant-design/colors";
import * as request from "request-promise";
import NearestColor from "nearest-color";
import * as Discord from "discord.js";
import { Role, RoleSource } from "@dewo/api/models/rbac/Role";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { DiscordService } from "../discord.service";
import { User } from "@dewo/api/models/User";
import { RbacService } from "@dewo/api/modules/rbac/rbac.service";
import { Threepid, ThreepidSource } from "@dewo/api/models/Threepid";
import { UserRole } from "@dewo/api/models/rbac/UserRole";
import { StatusCodeError } from "request-promise/errors";
import Bluebird from "bluebird";

interface GuildMember {
  userId: string;
  roles: string[];
}

@Injectable()
export class DiscordRolesService {
  private logger = new Logger(this.constructor.name);

  private nearestColor = NearestColor.from({
    red: Colors.red.primary!,
    volcano: Colors.volcano.primary!,
    gold: Colors.gold.primary!,
    orange: Colors.orange.primary!,
    yellow: Colors.yellow.primary!,
    lime: Colors.lime.primary!,
    green: Colors.green.primary!,
    cyan: Colors.cyan.primary!,
    blue: Colors.blue.primary!,
    geekblue: Colors.geekblue.primary!,
    purple: Colors.purple.primary!,
    magenta: Colors.magenta.primary!,
    grey: Colors.grey.primary!,
  });

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(OrganizationIntegration)
    private readonly organizationIntegrationRepo: Repository<OrganizationIntegration>,
    private readonly discord: DiscordService,
    private readonly rbacService: RbacService
  ) {}

  public async syncUserRoles(user: User): Promise<void> {
    const threepid = (await user.threepids).find(
      (t) => t.source === ThreepidSource.discord
    ) as Threepid<ThreepidSource.discord> | undefined;

    this.logger.log(
      `Scraping user Discord roles: ${JSON.stringify({
        userId: user.id,
        threepid,
      })}`
    );

    const guildIds = threepid?.config.profile.guilds?.map((g) => g.id) ?? [];
    if (!threepid || !guildIds.length) {
      this.logger.warn(
        `Tried syncing Discord roles, but nothing to scape: ${JSON.stringify({
          userId: user.id,
          threepidId: threepid?.id,
          guildIds,
        })}`
      );
      return;
    }

    const integrations = (await this.organizationIntegrationRepo
      .createQueryBuilder("integration")
      .where("integration.type = :type", {
        type: OrganizationIntegrationType.DISCORD,
      })
      .andWhere(`integration."config"->>'guildId' IN (:...guildIds)`, {
        guildIds,
      })
      .getMany()) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>[];

    const discordRoleIds: string[] = [];
    for (const integration of integrations) {
      const client = this.discord.getClient(integration);
      const guild = await client.guilds.fetch(integration.config.guildId);
      const member = await guild.members.fetch(threepid.threepid);
      // @ts-expect-error
      discordRoleIds.push(...member._roles);
    }

    if (!discordRoleIds.length) {
      return;
    }

    const roles = await this.rbacService.findRoles({
      source: RoleSource.DISCORD,
      externalId: In(discordRoleIds),
    });
    const roleIds = roles.map((r) => r.id);
    this.logger.debug(
      `Adding roles to user: ${JSON.stringify({
        userId: user.id,
        discordRoleIds,
        roleIds,
      })}`
    );

    if (!!roles.length) {
      await this.rbacService.addRoles(user.id, roleIds);
    }
  }

  // TODO(fant): look into SQL merge
  public async syncOrganizationRoles(
    integration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>
  ): Promise<void> {
    this.logger.log(
      `Scraping organization Discord roles and rules: ${JSON.stringify({
        organizationId: integration.organizationId,
      })}`
    );

    const client = this.discord.getClient(integration);

    const organization = await integration.organization;
    const existingRoles = await organization.roles;

    const guild = await client.guilds.fetch(integration.config.guildId);
    const discordRoles = await guild.roles.fetch(undefined, { force: true });

    // const fallbackRole = existingRoles.find((r) => r.fallback);
    // const discordEveryoneRole = discordRoles.find(isEveryoneRole);

    const members = await this.getGuildMembers(
      client,
      integration.config.guildId
    );
    const userByDiscordId = await this.discord.getUsersFromDiscordIds(
      members.map((m) => m.userId)
    );

    const newDiscordRoles = discordRoles.filter(
      (dr) =>
        !existingRoles.some(
          (r) => r.source === RoleSource.DISCORD && r.externalId === dr.id
        ) &&
        !["Dework", "Dework Demo", "Dework Dev"].includes(dr.name) &&
        !this.isEveryoneRole(dr)
    );
    const rolesToUpdate = existingRoles.filter(
      (r) =>
        r.source === RoleSource.DISCORD &&
        !!r.externalId &&
        discordRoles.has(r.externalId)
    );
    const rolesToDelete = existingRoles.filter(
      (r) =>
        !r.fallback &&
        r.source === RoleSource.DISCORD &&
        !!r.externalId &&
        !discordRoles.has(r.externalId)
    );

    this.logger.debug(
      `Changed Discord roles: ${JSON.stringify({
        new: newDiscordRoles.map((r) => r),
        updated: rolesToUpdate.map((r) => r.externalId),
        deleted: rolesToDelete.map((r) => r.externalId),
      })}`
    );

    await this.connection.transaction(async (manager) => {
      if (!!rolesToDelete.length) {
        await manager.delete(
          Role,
          rolesToDelete.map((r) => r.id)
        );
      }

      await manager.save(Role, [
        ...newDiscordRoles.map((r) => ({
          ...this.extractDiscordRoleFields(r),
          organizationId: integration.organizationId,
        })),
        ...rolesToUpdate.map((r) => ({
          ...r,
          ...this.extractDiscordRoleFields(discordRoles.get(r.externalId!)!),
        })),
        // ...(!!discordEveryoneRole && !!fallbackRole
        //   ? [
        //       {
        //         ...fallbackRole,
        //         ...this.extractDiscordRoleFields(discordEveryoneRole),
        //         organizationId: integration.organizationId,
        //       },
        //     ]
        //   : []),
      ]);

      const updatedRoles = await manager
        .createQueryBuilder(Role, "role")
        .leftJoinAndSelect("role.users", "user")
        .where("role.organizationId = :organizationId", {
          organizationId: integration.organizationId,
        })
        .getMany();

      for (const role of updatedRoles) {
        if (role.source !== RoleSource.DISCORD || !role.externalId) {
          continue;
        }

        const discordIdsWithRole = members
          .filter((m) => !!role.externalId && m.roles.includes(role.externalId))
          .map((m) => m.userId);
        const usersWithRole = discordIdsWithRole
          .map((discordId) => userByDiscordId[discordId])
          .filter((u): u is User => !!u);

        this.logger.debug(
          `Assigning Discord roles to users: ${JSON.stringify({
            role,
            discordIds: discordIdsWithRole,
            userIds: usersWithRole.map((u) => u.id),
          })}`
        );

        const currentUsers = await role.users;
        const usersToAdd = usersWithRole.filter(
          (user) => !currentUsers.some((u) => u.id === user.id)
        );
        const usersToRemove = currentUsers.filter(
          (user) => !usersWithRole.some((u) => u.id === user.id)
        );

        await Promise.all([
          manager.upsert(
            UserRole,
            usersToAdd.map((u) => ({ roleId: role.id, userId: u.id })),
            { conflictPaths: ["userId", "roleId"] }
          ),
          !role.fallback &&
            usersToRemove.length &&
            manager.delete(
              UserRole,
              usersToRemove.map((u) => ({ roleId: role.id, userId: u.id }))
            ),
        ]);
      }
    });
  }

  private async getGuildMembers(
    client: Discord.Client,
    guildId: string
  ): Promise<GuildMember[]> {
    const members: GuildMember[] = [];

    while (true) {
      try {
        const limit = 1000;
        const after = members[members.length - 1]?.userId;
        this.logger.debug(
          `Fetching guild member chunk: ${JSON.stringify({
            guildId,
            after,
            fetched: members.length,
          })}`
        );
        const memberChunk = await request.get({
          url: `https://discord.com/api/guilds/${guildId}/members`,
          qs: { limit, after },
          json: true,
          headers: { authorization: `Bot ${client.token}` },
        });

        members.push(
          ...memberChunk.map((m: any) => ({
            roles: m.roles,
            userId: m.user.id,
          }))
        );

        if (memberChunk.length < limit) break;
      } catch (error) {
        if (error instanceof StatusCodeError && error.statusCode === 429) {
          this.logger.warn(
            `Discord API rate limit exceeded: ${JSON.stringify({
              error: error.error,
              headers: error.response.headers,
            })}`
          );
          await Bluebird.delay(Number(error.response.headers["retry-after"]));
        } else {
          throw error;
        }
      }
    }

    return members;
  }

  private extractDiscordRoleFields(discordRole: Discord.Role): Partial<Role> {
    return {
      source: RoleSource.DISCORD,
      externalId: discordRole.id,
      name: discordRole.name,
      color: this.nearestColor(
        `#${discordRole.color.toString(16).padStart(6, "0")}`
      ).name,
      fallback: this.isEveryoneRole(discordRole),
    };
  }

  private isEveryoneRole(role: Discord.Role) {
    return role.id === role.guild.id;
  }
}
