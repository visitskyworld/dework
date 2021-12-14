import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Int,
  Context,
} from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { TaskService } from "./task.service";
import { CreateTaskInput } from "./dto/CreateTaskInput";
import { Task, TaskStatusEnum } from "@dewo/api/models/Task";
import { UpdateTaskInput } from "./dto/UpdateTaskInput";
import { TaskTag } from "@dewo/api/models/TaskTag";
import GraphQLUUID from "graphql-type-uuid";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { ProjectRolesGuard } from "../project/project.roles.guard";
import { TaskRolesGuard } from "./task.roles.guard";
import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { CustomPermissionActions } from "../auth/permissions";
import { User } from "@dewo/api/models/User";

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
    @Context("user") user: User,
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    return this.taskService.create({
      sortKey: String(Date.now()),
      tags: !!input.tagIds ? (input.tagIds.map((id) => ({ id })) as any) : [],
      assignees: !!input.assigneeIds
        ? (input.assigneeIds.map((id) => ({ id })) as any)
        : [],
      creatorId: user.id,
      ownerId: user.id,
      ...input,
    });
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(CustomPermissionActions.claimTask, Task, [
    TaskService,
    (service: TaskService, { params }) => service.findById(params.id),
  ])
  public async claimTask(
    @Context("user") user: User,
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task> {
    return this.taskService.claim(id, user);
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard)
  // @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  // @UseAbility(Actions.update, Task, [
  //   TaskService,
  //   (service: TaskService, { params }) => service.findById(params.id),
  // ])
  public async unclaimTask(
    @Context("user") user: User,
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task> {
    return this.taskService.unclaim(id, user);
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

@Injectable()
@Resolver(() => Organization)
export class OrganizationTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() organization: Organization): Promise<Task[]> {
    return this.taskService.findWithRelations({
      organizationId: organization.id,
    });
  }
}

@Injectable()
@Resolver(() => Project)
export class ProjectTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() project: Project): Promise<Task[]> {
    return this.taskService.findWithRelations({ projectId: project.id });
  }

  @ResolveField(() => Int)
  public async taskCount(
    @Parent() project: Project,
    @Args("status", { type: () => TaskStatusEnum, nullable: true })
    status: TaskStatusEnum | undefined
  ): Promise<number> {
    return this.taskService.count({ projectId: project.id, status });
  }
}
