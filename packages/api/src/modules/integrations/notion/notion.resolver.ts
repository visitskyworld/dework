import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { Project } from "@dewo/api/models/Project";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@dewo/api/models/User";
import { NotionImportService } from "./notion.import.service";
import { OrganizationRolesGuard } from "../../organization/organization.roles.guard";
import { Organization } from "@dewo/api/models/Organization";

import { OrganizationService } from "../../organization/organization.service";
import { CreateProjectsFromNotionInput } from "./dto/CreateProjectsFromNotionInput";
import { NotionDatabase } from "./dto/NotionDatabase";
import GraphQLUUID from "graphql-type-uuid";

@Injectable()
export class NotionResolver {
  constructor(
    private readonly importService: NotionImportService,
    private readonly organizationService: OrganizationService
  ) {}

  @Mutation(() => Organization)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Project)
  public async createProjectsFromNotion(
    @Context("user") user: User,
    @Args("input") input: CreateProjectsFromNotionInput
  ): Promise<Organization> {
    await this.importService.createProjectsFromNotion(
      input.organizationId,
      input.threepidId,
      input.databaseIds,
      user
    );
    return this.organizationService.findById(
      input.organizationId
    ) as Promise<Organization>;
  }

  @Query(() => [NotionDatabase])
  public async getNotionDatabases(
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<NotionDatabase[]> {
    return this.importService.getDatabases(threepidId);
  }
}
