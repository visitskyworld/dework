import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Workspace } from "@dewo/api/models/Workspace";
import { UpdateWorkspaceInput } from "../workspace/dto/UpdateWorkspaceInput";
import { RoleGuard } from "../rbac/rbac.guard";
import { CreateWorkspaceInput } from "./dto/CreateWorkspaceInput";
import { WorkspaceService } from "./workspace.service";
import { PermalinkService } from "../permalink/permalink.service";

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
