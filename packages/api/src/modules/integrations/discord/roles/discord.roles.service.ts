import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import * as Colors from "@ant-design/colors";
import NearestColor from "nearest-color";
import * as Discord from "discord.js";
import { Role, RoleSource } from "@dewo/api/models/rbac/Role";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { DiscordService } from "../discord.service";
import { User } from "@dewo/api/models/User";

const isEveryoneRole = (role: Discord.Role) => role.id === role.guild.id;

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
    private readonly discord: DiscordService
  ) {}

  // TODO(fant): look into SQL merge
  public async syncRoles(
    integration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>
  ): Promise<void> {
    this.logger.log(
      `Scraping Discord roles: ${JSON.stringify({
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

    const members = await guild.members.fetch();
    const discordUserIds = members.map((m) => m.user.id);
    const userByDiscordId = await this.discord.getUsersFromDiscordIds(
      discordUserIds
    );

    const newDiscordRoles = discordRoles.filter(
      (dr) =>
        !existingRoles.some(
          (r) => r.source === RoleSource.DISCORD && r.externalId === dr.id
        ) &&
        !["Dework", "Dework Demo", "Dework Dev"].includes(dr.name) &&
        !isEveryoneRole(dr)
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
          .filter((m) => m.roles.cache.some((r) => r.id === role.externalId))
          .map((m) => m.user.id);
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
          manager
            .createQueryBuilder()
            .relation(Role, "users")
            .of(role)
            .add(usersToAdd),
          !role.fallback &&
            manager
              .createQueryBuilder()
              .relation(Role, "users")
              .of(role)
              .remove(usersToRemove),
        ]);
      }
    });
  }

  private extractDiscordRoleFields(discordRole: Discord.Role): Partial<Role> {
    return {
      source: RoleSource.DISCORD,
      externalId: discordRole.id,
      name: discordRole.name,
      color: this.nearestColor(
        `#${discordRole.color.toString(16).padStart(6, "0")}`
      ).name,
      fallback: isEveryoneRole(discordRole),
    };
  }
}
