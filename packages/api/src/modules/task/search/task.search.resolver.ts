import { Args, Query, Context } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { TaskSearchService } from "./task.search.service";
import { TaskSearchResponse } from "./dto/TaskSearchResponse";
import { SearchTasksInput } from "./dto/SearchTasksInput";
import { OrganizationService } from "../../organization/organization.service";

@Injectable()
export class TaskSearchResolver {
  constructor(
    private readonly service: TaskSearchService,
    private readonly organizationService: OrganizationService
  ) {}

  @Query(() => TaskSearchResponse)
  public async getPaginatedTasks(
    @Context("user") user: User | undefined,
    @Args("filter") filter: SearchTasksInput,
    @Args("cursor", { type: () => String, nullable: true })
    cursor: string | undefined
  ): Promise<TaskSearchResponse> {
    let projectIds = filter.projectIds;

    if (!!filter.organizationIds && filter.organizationIds.length > 0) {
      const projectsByOrg = await Promise.all(
        filter.organizationIds.map((orgId) =>
          this.organizationService.getProjects(orgId, user?.id)
        )
      );

      if (!projectIds) projectIds = [];
      projectIds.push(...projectsByOrg.flat().map((p) => p.id));
    }

    const isQueryingOnLandingPage = !projectIds && !filter.applicantIds;

    // TODO(fant): if projectId is set, make sure user has access to it
    return this.service.search({
      ...filter,
      cursor,
      projectIds,
      ...(isQueryingOnLandingPage ? { public: true, spam: false } : {}),
    });
  }
}
