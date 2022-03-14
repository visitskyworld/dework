import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { Project } from "@dewo/api/models/Project";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@dewo/api/models/User";
import { TrelloImportService } from "./trello.import.service";
import { Organization } from "@dewo/api/models/Organization";

import { OrganizationService } from "../../organization/organization.service";
import { CreateProjectsFromTrelloInput } from "./dto/CreateProjectsFromTrelloInput";
import { TrelloBoard } from "./dto/TrelloBoard";
import GraphQLUUID from "graphql-type-uuid";
import { ProjectService } from "../../project/project.service";
import { RoleGuard } from "../../rbac/rbac.guard";

@Injectable()
export class TrelloResolver {
  constructor(
    private readonly importService: TrelloImportService,
    private readonly organizationService: OrganizationService
  ) {}

  @Mutation(() => Organization)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Project,
      inject: [ProjectService],
      getOrganizationId: async (
        _subject: Project,
        params: { input: CreateProjectsFromTrelloInput }
      ) => params.input.organizationId,
    })
  )
  public async createProjectsFromTrello(
    @Context("user") user: User,
    @Args("input") input: CreateProjectsFromTrelloInput
  ): Promise<Organization> {
    await this.importService.createProjectsFromBoards(
      input.organizationId,
      input.threepidId,
      input.boardIds,
      user
    );
    return this.organizationService.findById(
      input.organizationId
    ) as Promise<Organization>;
  }

  @Query(() => [TrelloBoard])
  public async getTrelloBoards(
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<TrelloBoard[]> {
    return this.importService.getBoards(threepidId);
  }
}
