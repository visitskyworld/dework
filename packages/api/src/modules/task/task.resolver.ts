import { Args, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import { TaskService } from "./task.service";
import { CreateTaskInput } from "./dto/CreateTaskInput";
import { Task } from "@dewo/api/models/Task";
import { ProjectMemberGuard } from "../auth/guards/projectMember.guard";

@Injectable()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  @UseGuards(RequireGraphQLAuthGuard, ProjectMemberGuard)
  public async createTask(
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    return this.taskService.create(input);
  }
}
