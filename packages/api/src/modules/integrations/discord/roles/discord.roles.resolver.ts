import { Args, Mutation } from "@nestjs/graphql";
import { Injectable, Logger, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../auth/guards/auth.guard";
import { DiscordRolesService } from "./discord.roles.service";
import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import GraphQLUUID from "graphql-type-uuid";
import { IntegrationService } from "../../integration.service";
import { Organization } from "@dewo/api/models/Organization";

@Injectable()
export class DiscordRolesResolver {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly integrationService: IntegrationService,
    private readonly service: DiscordRolesService
  ) {}

  @Mutation(() => Organization)
  @UseGuards(AuthGuard)
  public async updateOrganizationDiscordRoles(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<Organization> {
    const integration =
      await this.integrationService.findOrganizationIntegration(
        organizationId,
        OrganizationIntegrationType.DISCORD
      );

    if (!integration) {
      throw new Error(
        "Must have Discord integration to refresh Discord roles."
      );
    }

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

    return integration.organization;
  }
}
