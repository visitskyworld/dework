import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { Project } from "@dewo/api/models/Project";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@dewo/api/models/User";
import { NotionImportService } from "./notion.import.service";
import { OrganizationRolesGuard } from "../../organization/organization.roles.guard";
import { Organization } from "@dewo/api/models/Organization";
import { ThreepidService } from "../../threepid/threepid.service";
import {
  NotionThreepidConfig,
  ThreepidSource,
} from "@dewo/api/models/Threepid";
import { OrganizationService } from "../../organization/organization.service";
import { CreateProjectsFromNotionInput } from "./dto/CreateProjectsFromNotionInput";

@Injectable()
export class NotionResolver {
  constructor(
    private readonly importService: NotionImportService,
    private readonly threepidService: ThreepidService,
    private readonly organizationService: OrganizationService
  ) {}

  @Mutation(() => Organization)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Project)
  public async createProjectsFromNotion(
    @Context("user") user: User,
    @Args("input") input: CreateProjectsFromNotionInput
  ): Promise<Organization> {
    const threepid = await this.threepidService.findOne({
      id: input.threepidId,
      source: ThreepidSource.notion,
    });
    if (!threepid) throw new NotFoundException();
    await this.importService.createProjectsFromNotion(
      input.organizationId,
      (threepid.config as NotionThreepidConfig).accessToken,
      user
    );
    return this.organizationService.findById(
      input.organizationId
    ) as Promise<Organization>;
  }
}
