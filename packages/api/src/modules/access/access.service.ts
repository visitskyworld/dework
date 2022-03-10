import {
  AccessControl,
  AccessControlOp,
  AccessControlType,
  DiscordRoleAccessControl,
  OpAccessControl,
} from "@dewo/api/models/AccessControl";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiscordService } from "../integrations/discord/discord.service";
import { IntegrationService } from "../integrations/integration.service";

@Injectable()
export class AccessService {
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(AccessControl)
    private readonly accessControlRepo: Repository<AccessControl>,
    private readonly discord: DiscordService,
    private readonly integrationService: IntegrationService
  ) {}

  public async create(partial: Partial<AccessControl>): Promise<AccessControl> {
    const created = await this.accessControlRepo.save(partial);
    return this.accessControlRepo.findOne(created.id) as Promise<AccessControl>;
  }

  public async test(
    accessControl: AccessControl,
    userId: string
  ): Promise<boolean> {
    this.logger.log(
      `Test: ${JSON.stringify({
        userId,
        id: accessControl.id,
        type: accessControl.type,
        config: accessControl.config,
      })}`
    );

    try {
      switch (accessControl.type) {
        case AccessControlType.OP:
          const op = await this.testOp(
            accessControl as OpAccessControl,
            userId
          );
          return op;
        case AccessControlType.DISCORD_ROLE:
          const dr = await this.testDiscordRole(
            accessControl as DiscordRoleAccessControl,
            userId
          );
          return dr;
        default:
          return false;
      }
    } catch (error) {
      this.logger.warn(error);
      return false;
    }
  }

  private async testOp(
    accessControl: OpAccessControl,
    userId: string
  ): Promise<boolean> {
    const children = await accessControl.children;
    const childrenTests = await Promise.all(
      children.map((child) => this.test(child, userId))
    );
    this.logger.log(
      `Test op: ${JSON.stringify({
        userId,
        id: accessControl.id,
        childrenTests,
      })}`
    );
    switch (accessControl.config.op) {
      case AccessControlOp.OR:
        return childrenTests.some(Boolean);
      case AccessControlOp.AND:
        return childrenTests.every(Boolean);
    }
  }

  private async testDiscordRole(
    accessControl: DiscordRoleAccessControl,
    userId: string
  ): Promise<boolean> {
    this.logger.log(
      `Test discord role: ${JSON.stringify({
        userId,
        ...accessControl.config,
      })}`
    );

    const [discordId] = await this.discord.getDiscordIds([userId]);
    if (!discordId) {
      this.logger.debug(`User has no Discord ID`);
      return false;
    }

    this.logger.debug(`Discord ID found: ${JSON.stringify({ discordId })}`);

    const integration =
      (await this.integrationService.findOrganizationIntegrationById(
        accessControl.config.integrationId
      )) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
    if (!integration) {
      this.logger.debug(
        `Integration not found: ${JSON.stringify({
          integrationId: accessControl.config.integrationId,
        })}`
      );
      return false;
    }

    const guild = await this.discord
      .getClient(integration)
      .guilds.fetch(integration.config.guildId);
    await guild.roles.fetch(undefined, { force: true });
    const member = await guild.members.fetch({ user: discordId, force: true });

    const roleIds = member.roles.cache.map((role) => role.id);
    this.logger.debug(
      `Found Discord member: ${JSON.stringify({ id: member.id, roleIds })}`
    );
    return roleIds.includes(accessControl.config.roleId);
  }
}
