import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ProjectService } from "../../project/project.service";
import { RoleGuard } from "../../rbac/rbac.guard";
import { TaskView } from "@dewo/api/models/TaskView";
import { CreateTaskViewInput } from "./dto/CreateTaskViewInput";
import { TaskViewService } from "./taskView.service";
import { PermalinkService } from "../../permalink/permalink.service";
import { UpdateTaskViewInput } from "./dto/UpdateTaskViewInput";
import { WorkspaceService } from "../../workspace/workspace.service";

@Injectable()
@Resolver(() => TaskView)
export class TaskViewResolver {
  constructor(
    private readonly service: TaskViewService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() taskView: TaskView
  ): Promise<string> {
    return this.permalinkService.get(taskView, origin);
  }

  @Mutation(() => TaskView)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskView,
      inject: [ProjectService, WorkspaceService],
      getSubject: (params: { input: CreateTaskViewInput }) =>
        Object.assign(new TaskView(), params.input),
      async getOrganizationId(
        _subject,
        params: { input: CreateTaskViewInput },
        projectService: ProjectService,
        workspaceService: WorkspaceService
      ) {
        if (params.input.organizationId) return params.input.organizationId;
        if (!!params.input.projectId) {
          const project = await projectService.findById(params.input.projectId);
          return project?.organizationId;
        }
        if (!!params.input.workspaceId) {
          const workspace = await workspaceService.findById(
            params.input.workspaceId
          );
          return workspace?.organizationId;
        }
      },
    })
  )
  public async createTaskView(
    @Args("input") input: CreateTaskViewInput
  ): Promise<TaskView> {
    return this.service.create(input);
  }

  @Mutation(() => TaskView)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: TaskView,
      inject: [TaskViewService],
      getSubject: (
        params: { input: UpdateTaskViewInput },
        service: TaskViewService
      ) => service.findById(params.input.id),
      async getOrganizationId(subject) {
        if (!!subject.organizationId) return subject.organizationId;
        if (!!subject.projectId) {
          const project = await subject.project;
          return project?.organizationId;
        }
        if (!!subject.workspaceId) {
          const workspace = await subject.workspace;
          return workspace?.organizationId;
        }
      },
    })
  )
  public async updateTaskView(
    @Args("input") input: UpdateTaskViewInput
  ): Promise<TaskView> {
    return this.service.update(input);
  }
}
