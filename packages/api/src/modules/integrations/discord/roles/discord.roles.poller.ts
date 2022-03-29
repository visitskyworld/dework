import { Controller, Logger, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiscordRolesService } from "./discord.roles.service";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";

@Controller("discord-roles")
export class DiscordRolesPoller {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly service: DiscordRolesService,
    @InjectRepository(OrganizationIntegration)
    private readonly organizationIntegrationRepo: Repository<OrganizationIntegration>
  ) {}

  @Post("update")
  public async updateDiscordRoles(
    @Query("organizationId") organizationId: string | undefined,
    @Res() res: Response
  ) {
    const integrations = (await this.organizationIntegrationRepo.find({
      type: OrganizationIntegrationType.DISCORD,
      ...(!!organizationId && { organizationId }),
    })) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>[];

    this.logger.log(
      `Update Discord roles: ${JSON.stringify({ count: integrations.length })}`
    );

    for (const integration of integrations) {
      try {
        await this.service.syncOrganizationRoles(integration);
      } catch (error) {
        const errorString = JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        );
        this.logger.error(
          `Error scraping Discord roles: ${JSON.stringify({
            integration,
            errorString,
          })}`
        );
      }
    }

    res.json({ ok: true });
  }
}
