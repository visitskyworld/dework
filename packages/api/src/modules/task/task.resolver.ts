import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { TaskService } from "./task.service";
import { CreateTaskInput } from "./dto/CreateTaskInput";
import { Task } from "@dewo/api/models/Task";
import { UpdateTaskInput } from "./dto/UpdateTaskInput";
import { TaskTag } from "@dewo/api/models/TaskTag";
import GraphQLUUID from "graphql-type-uuid";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { ProjectRolesGuard } from "../project/project.roles.guard";
import { TaskRolesGuard } from "./task.roles.guard";

@Injectable()
@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [TaskTag])
  public async tags(@Parent() task: Task): Promise<TaskTag[]> {
    if (!!task.tags) return task.tags;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.tags;
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Task)
  public async createTask(
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    return this.taskService.create({
      sortKey: String(Date.now()),
      tags: !!input.tagIds ? (input.tagIds.map((id) => ({ id })) as any) : [],
      assignees: !!input.assigneeIds
        ? (input.assigneeIds.map((id) => ({ id })) as any)
        : [],
      ...input,
    });
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  @UseAbility(Actions.update, Task, [
    TaskService,
    (service: TaskService, { params }) => service.findById(params.input.id),
  ])
  public async updateTask(
    @Args("input") input: UpdateTaskInput
  ): Promise<Task> {
    const task = await this.taskService.update({
      ...input,
      tags: !!input.tagIds
        ? (input.tagIds.map((id) => ({ id })) as any)
        : undefined,
      assignees: !!input.assigneeIds
        ? (input.assigneeIds.map((id) => ({ id })) as any)
        : undefined,
    });

    return task;
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  @UseAbility(Actions.delete, Task, [
    TaskService,
    (service: TaskService, { params }) => service.findById(params.id),
  ])
  public async deleteTask(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task> {
    const task = await this.taskService.update({ id, deletedAt: new Date() });
    return task;
  }

  @Query(() => Task)
  public async getTask(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task | undefined> {
    const task = await this.taskService.findById(id);
    if (!task) throw new NotFoundException();
    return task;
  }
}
