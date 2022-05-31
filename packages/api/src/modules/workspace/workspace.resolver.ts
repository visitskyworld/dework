import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Workspace } from "@dewo/api/models/Workspace";
import { UpdateWorkspaceInput } from "../workspace/dto/UpdateWorkspaceInput";
import { RoleGuard } from "../rbac/rbac.guard";
import { CreateWorkspaceInput } from "./dto/CreateWorkspaceInput";
import { WorkspaceService } from "./workspace.service";
import { PermalinkService } from "../permalink/permalink.service";
import { TaskView } from "@dewo/api/models/TaskView";
import { Organization } from "@dewo/api/models/Organization";
import { User } from "@dewo/api/models/User";
import { Project } from "@dewo/api/models/Project";

@Resolver(() => Workspace)
@Injectable()
export class WorkspaceResolver {
  constructor(
    private readonly service: WorkspaceService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() workspace: Workspace
  ): Promise<string> {
    return this.permalinkService.get(workspace, origin);
  }

  @ResolveField(() => [TaskView])
  public async taskViews(
    @Parent() workspace: Organization
  ): Promise<TaskView[]> {
    const views = await workspace.taskViews;
    return views.filter((s) => !s.deletedAt);
  }

  @ResolveField(() => [Project])
  public async projects(
    @Context("user") user: User | undefined,
    @Parent() workspace: Workspace
  ): Promise<Project[]> {
    return this.service.getProjects(workspace.id, user?.id);
  }

  @Query(() => Workspace)
  public async getWorkspaceBySlug(
    @Args("slug") slug: string
  ): Promise<Workspace> {
    const workspace = await this.service.findBySlug(slug);
    if (!workspace) throw new NotFoundException();
    return workspace;
  }

  @Mutation(() => Workspace)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Workspace,
      inject: [WorkspaceService],
      getOrganizationId: (_subject, params: { input: CreateWorkspaceInput }) =>
        params.input.organizationId,
    })
  )
  public async createWorkspace(
    @Args("input") input: CreateWorkspaceInput
  ): Promise<Workspace> {
    return this.service.create(input);
  }

  @Mutation(() => Workspace)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Workspace,
      inject: [WorkspaceService],
      getOrganizationId: (_subject, params: { input: UpdateWorkspaceInput }) =>
        params.input.organizationId,
    })
  )
  public async updateWorkspace(
    @Args("input") input: UpdateWorkspaceInput
  ): Promise<Workspace> {
    return this.service.update(input);
  }
}
