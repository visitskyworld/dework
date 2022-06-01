import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { TaskService } from "../task.service";
import { CreateTaskApplicationInput } from "./dto/CreateTaskApplicationInput";
import { Task } from "@dewo/api/models/Task";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { DeleteTaskApplicationInput } from "./dto/DeleteTaskApplicationInput";
import { RoleGuard } from "../../rbac/rbac.guard";
import { TaskApplicationService } from "./taskApplication.service";
import { User } from "@dewo/api/models/User";
import { AcceptTaskApplicationInput } from "./dto/AcceptTaskApplicationInput";

@Injectable()
export class TaskApplicationResolver {
  constructor(private readonly service: TaskApplicationService) {}

  @Mutation(() => TaskApplication)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskApplication,
      inject: [TaskService],
      getSubject: async (
        params: { input: CreateTaskApplicationInput },
        service
      ) => {
        const task = await service.findById(params.input.taskId);
        if (!task) return undefined;
        return Object.assign(new TaskApplication(), params.input, {
          projectId: task.projectId,
        });
      },
      async getOrganizationId(
        _subject,
        params: { input: CreateTaskApplicationInput },
        service
      ) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
  public async createTaskApplication(
    @Args("input") input: CreateTaskApplicationInput
  ): Promise<TaskApplication> {
    return this.service.create(input);
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: TaskApplication,
      inject: [TaskService],
      getSubject: async (
        params: { input: DeleteTaskApplicationInput },
        service
      ) => {
        const task = await service.findById(params.input.taskId);
        if (!task) return undefined;
        return Object.assign(new TaskApplication(), params.input, {
          projectId: task.projectId,
        });
      },
      async getOrganizationId(
        _subject,
        params: { input: CreateTaskApplicationInput },
        service
      ) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
  public async deleteTaskApplication(
    @Context("user") user: User,
    @Args("input") input: DeleteTaskApplicationInput
  ): Promise<Task> {
    return this.service.delete(input.taskId, input.userId, user.id);
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: TaskApplication,
      inject: [TaskService],
      getSubject: async (
        params: { input: AcceptTaskApplicationInput },
        service
      ) => {
        const task = await service.findById(params.input.taskId);
        if (!task) return undefined;
        return Object.assign(new TaskApplication(), params.input, {
          projectId: task.projectId,
        });
      },
      async getOrganizationId(
        _subject,
        params: { input: AcceptTaskApplicationInput },
        service
      ) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
  public async acceptTaskApplication(
    @Args("input") input: AcceptTaskApplicationInput
  ): Promise<Task> {
    return this.service.accept(input.taskId, input.userId);
  }
}
