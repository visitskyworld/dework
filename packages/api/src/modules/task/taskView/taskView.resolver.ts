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
      inject: [ProjectService],
      getSubject: (params: { input: CreateTaskViewInput }) =>
        Object.assign(new TaskView(), params.input),
      async getOrganizationId(
        _subject,
        params: { input: CreateTaskViewInput },
        service
      ) {
        if (params.input.organizationId) return params.input.organizationId;
        const project = params.input.projectId
          ? await service.findById(params.input.projectId)
          : undefined;
        return project?.organizationId;
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
        const project = await subject.project;
        return project?.organizationId;
      },
    })
  )
  public async updateTaskView(
    @Args("input") input: UpdateTaskViewInput
  ): Promise<TaskView> {
    return this.service.update(input);
  }
}
