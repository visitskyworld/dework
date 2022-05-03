import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Context,
} from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
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
    if (!!filter.organizationId) {
      const projects = await this.organizationService.getProjects(
        filter.organizationId,
        user?.id
      );
      if (!projectIds) projectIds = [];
      projectIds.push(...projects.map((p) => p.id));
    }

    return this.service.search({
      ...filter,
      cursor,
      spam: false,
      public: true,
      projectIds,
    });
  }
}

@Injectable()
@Resolver(() => Organization)
export class OrganizationTaskSearchResolver {
  constructor(
    private readonly service: TaskSearchService,
    private readonly organizationService: OrganizationService
  ) {}

  @ResolveField(() => TaskSearchResponse)
  public async paginatedTasks(
    @Context("user") user: User | undefined,
    @Parent() organization: Organization,
    @Args("filter", { nullable: true }) filter: SearchTasksInput,
    @Args("cursor", { type: () => String, nullable: true })
    cursor: string | undefined
  ): Promise<TaskSearchResponse> {
    const projects = await this.organizationService.getProjects(
      organization.id,
      user?.id
    );
    return this.service.search({
      ...filter,
      cursor,
      projectIds: projects.map((p) => p.id),
    });
  }
}

@Injectable()
@Resolver(() => Project)
export class ProjectTaskSearchResolver {
  constructor(private readonly service: TaskSearchService) {}

  @ResolveField(() => TaskSearchResponse)
  public async paginatedTasks(
    @Parent() project: Project,
    @Args("filter", { nullable: true }) filter: SearchTasksInput,
    @Args("cursor", { type: () => String, nullable: true })
    cursor: string | undefined
  ): Promise<TaskSearchResponse> {
    return this.service.search({
      ...filter,
      cursor,
      projectIds: [project.id],
    });
  }
}

@Injectable()
@Resolver(() => User)
export class UserTaskSearchResolver {
  // constructor(private readonly service: TaskSearchService) {}
  // @ResolveField(() => TaskSearchResponse)
  // public async paginatedTasks(
  //   @Context("user") requestingUser: User | undefined,
  //   @Parent() user: User,
  //   @Args("filter", { nullable: true }) filter: SearchTasksInput
  //   @Args("cursor", { type: () => String, nullable: true }) cursor: string | undefined
  // ): Promise<TaskSearchResponse> {
  //   return this.taskService.findWithRelations({
  //     ...filter,
  //     cursor,
  //     userId: user.id,
  //     requestingUserId: requestingUser?.id,
  //   });
  // }
}
