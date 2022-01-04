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
import _ from "lodash";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { TaskService } from "./task.service";
import { CreateTaskInput } from "./dto/CreateTaskInput";
import { CreateTaskApplicationInput } from "./dto/CreateTaskApplicationInput";
import { Task, TaskStatus } from "@dewo/api/models/Task";
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
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import slugify from "slugify";
import { GetTasksInput } from "./dto/GetTasksInput";
import { PermalinkService } from "../permalink/permalink.service";

@Injectable()
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => [TaskTag])
  public async tags(@Parent() task: Task): Promise<TaskTag[]> {
    if (!!task.tags) return _.sortBy(task.tags, (t) => t.createdAt);
    const refetched = await this.taskService.findById(task.id);
    return _.sortBy(refetched!.tags, (t) => t.createdAt);
  }

  @ResolveField(() => String)
  public gitBranchName(
    @Context("user") user: User | undefined,
    @Parent() task: Task
  ): string {
    const root = user?.username ?? "feat";
    const slugifiedRoot = slugify(root, { lower: true, strict: true });
    return `${slugifiedRoot}/dw-${task.number}/${task.slug}`;
  }

  @ResolveField(() => String)
  public permalink(@Parent() task: Task): Promise<string> {
    return this.permalinkService.get(task);
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Task, [
    TaskService,
    async (_service: TaskService, { params }) => ({
      status: params.input.status,
    }),
  ])
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
    @Args("id", { type: () => GraphQLUUID }) id: string,
    @Args("application") application: CreateTaskApplicationInput
  ): Promise<Task> {
    return this.taskService.claim(id, user, application);
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

  @Mutation(() => [Task])
  @UseGuards(AuthGuard)
  // @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  // @UseAbility(Actions.update, Task, [
  //   TaskService,
  //   (service: TaskService, { params }) => service.findById(params.input.taskId),
  // ])
  public async createTaskPayments(
    @Args("input") input: CreateTaskPaymentsInput
  ): Promise<Task[]> {
    if (!input.taskRewardIds.length) return [];
    return this.taskService.createPayments(input);
  }

  @Query(() => Task)
  public async getTask(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task | undefined> {
    const task = await this.taskService.findById(id);
    if (!task) throw new NotFoundException();
    return task;
  }

  @Query(() => [Task])
  public async getTasks(@Args("input") input: GetTasksInput): Promise<Task[]> {
    if (input.ids?.length === 0) return [];
    if (input.statuses?.length === 0) return [];
    return this.taskService.findWithRelations(input);
  }
}

@Injectable()
@Resolver(() => Organization)
export class OrganizationTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() organization: Organization): Promise<Task[]> {
    return this.taskService.findWithRelations({
      organizationIds: [organization.id],
    });
  }
}

@Injectable()
@Resolver(() => Project)
export class ProjectTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() project: Project): Promise<Task[]> {
    return this.taskService.findWithRelations({ projectIds: [project.id] });
  }

  @ResolveField(() => Int)
  public async taskCount(
    @Parent() project: Project,
    @Args("status", { type: () => TaskStatus, nullable: true })
    status: TaskStatus | undefined,
    @Args("rewardNotNull", { type: () => Boolean, nullable: true })
    rewardNotNull: boolean | undefined
  ): Promise<number> {
    return this.taskService.count({
      projectId: project.id,
      status,
      rewardNotNull,
    });
  }
}
