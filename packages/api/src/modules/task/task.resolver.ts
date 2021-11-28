import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import { TaskService } from "./task.service";
import { CreateTaskInput } from "./dto/CreateTaskInput";
import { Task } from "@dewo/api/models/Task";
import { ProjectMemberGuard } from "../auth/guards/projectMember.guard";
import { UpdateTaskInput } from "./dto/UpdateTaskInput";
import { TaskTag } from "@dewo/api/models/TaskTag";

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
  @UseGuards(RequireGraphQLAuthGuard, ProjectMemberGuard)
  public async createTask(
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    return this.taskService.create({
      sortKey: String(Date.now()),
      tags: !!input.tagIds
        ? (input.tagIds.map((id) => ({ id })) as any)
        : undefined,
      ...input,
    });
  }

  @Mutation(() => Task)
  @UseGuards(RequireGraphQLAuthGuard)
  public async updateTask(
    @Args("input") input: UpdateTaskInput
  ): Promise<Task> {
    const task = await this.taskService.update({
      ...input,
      tags: !!input.tagIds
        ? (input.tagIds.map((id) => ({ id })) as any)
        : undefined,
    });

    return task;
  }
}
