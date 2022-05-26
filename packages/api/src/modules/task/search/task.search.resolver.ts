import { Args, Query, Context, Int } from "@nestjs/graphql";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { TaskSearchService } from "./task.search.service";
import { TaskSearchResponse } from "./dto/TaskSearchResponse";
import { CountTasksInput, SearchTasksInput } from "./dto/SearchTasksInput";
import { OrganizationService } from "../../organization/organization.service";
import { WorkspaceService } from "../../workspace/workspace.service";

@Injectable()
export class TaskSearchResolver {
  constructor(
    private readonly service: TaskSearchService,
    private readonly organizationService: OrganizationService,
    private readonly workspaceService: WorkspaceService
  ) {}

  @Query(() => TaskSearchResponse)
  public async getPaginatedTasks(
    @Context("user") user: User | undefined,
    @Args("filter") filter: SearchTasksInput,
    @Args("cursor", { type: () => String, nullable: true })
    cursor: string | undefined
  ): Promise<TaskSearchResponse> {
    let projectIds = filter.projectIds;

    if (!!filter.organizationIds?.length) {
      const projects = await Promise.all(
        filter.organizationIds.map((id) =>
          this.organizationService.getProjects(id, user?.id)
        )
      );

      if (!projectIds) projectIds = [];
      projectIds.push(...projects.flat().map((p) => p.id));
    }

    if (!!filter.workspaceIds?.length) {
      const projects = await Promise.all(
        filter.workspaceIds.map((id) =>
          this.workspaceService.getProjects(id, user?.id)
        )
      );

      if (!projectIds) projectIds = [];
      projectIds.push(...projects.flat().map((p) => p.id));
    }

    const isQueryingOnLandingPage = !projectIds && !filter.applicantIds;
    if (filter.public === false && !isQueryingOnLandingPage) {
      throw new ForbiddenException();
    }

    // TODO(fant): if projectId is set, make sure user has access to it
    return this.service.search(
      {
        ...filter,
        cursor,
        projectIds,
        ...(isQueryingOnLandingPage ? { public: true, spam: false } : {}),
      },
      filter.sortBy
    );
  }

  @Query(() => Int)
  public async getTaskCount(
    @Args("filter") filter: CountTasksInput
  ): Promise<number> {
    let projectIds = filter.projectIds;

    if (!!filter.organizationIds && filter.organizationIds.length > 0) {
      const projectsByOrg = await Promise.all(
        filter.organizationIds.map((orgId) =>
          this.organizationService.getProjects(orgId, undefined)
        )
      );

      if (!projectIds) projectIds = [];
      projectIds.push(...projectsByOrg.flat().map((p) => p.id));
    }

    return this.service.count(filter);
  }
}
