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
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { TaskService } from "./task.service";
import { CreateTaskInput } from "./dto/CreateTaskInput";
import { CreateTaskApplicationInput } from "./dto/CreateTaskApplicationInput";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { UpdateTaskInput } from "./dto/UpdateTaskInput";
import { TaskTag } from "@dewo/api/models/TaskTag";
import GraphQLUUID from "graphql-type-uuid";
import {
  AccessGuard,
  Actions,
  CaslUser,
  UseAbility,
  UserProxy,
} from "nest-casl";
import { ProjectRolesGuard } from "../project/project.roles.guard";
import { TaskRolesGuard } from "./task.roles.guard";
import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import slugify from "slugify";
import { GetTasksInput } from "./dto/GetTasksInput";
import { PermalinkService } from "../permalink/permalink.service";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskReactionInput } from "./dto/TaskReactionInput";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { DeleteTaskApplicationInput } from "./dto/DeleteTaskApplicationInput";
import { CustomPermissionActions } from "../auth/permissions";
import { ProjectService } from "../project/project.service";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { CreateTaskSubmissionInput } from "./dto/CreateTaskSubmissionInput";
import { UpdateTaskSubmissionInput } from "./dto/UpdateTaskSubmissionInput";
import { AbilityFactory } from "nest-casl/dist/factories/ability.factory";
import { subject } from "@casl/ability";
import { TaskReward } from "@dewo/api/models/TaskReward";

@Injectable()
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly permalinkService: PermalinkService,
    private readonly abilityFactory: AbilityFactory
  ) {}

  @ResolveField(() => [TaskTag])
  public async tags(@Parent() task: Task): Promise<TaskTag[]> {
    // needed?
    if (!!task.tags) return _.sortBy(task.tags, (t) => t.createdAt);
    const refetched = await this.taskService.findById(task.id);
    return _.sortBy(refetched!.tags, (t) => t.createdAt);
    // return _.sortBy(task.tags, (t) => t.createdAt);
  }

  // needed?
  @ResolveField(() => [User])
  public async assignees(@Parent() task: Task): Promise<User[]> {
    if (!!task.assignees) return task.assignees;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.assignees;
  }

  // needed?
  @ResolveField(() => [User])
  public async submissions(@Parent() task: Task): Promise<TaskSubmission[]> {
    const submissions = await task.submissions;
    return submissions.filter((s) => !s.deletedAt);
  }

  // needed?
  @ResolveField(() => TaskReward, { nullable: true })
  public async reward(@Parent() task: Task): Promise<TaskReward | undefined> {
    if (!task.rewardId) return undefined;
    if (!!task.reward) return task.reward;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.reward;
  }

  @ResolveField(() => [Task], { nullable: true })
  public async subtasks(@Parent() task: Task): Promise<Task[]> {
    const subtasks = await task.subtasks;
    return subtasks.filter((t) => !t.deletedAt);
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
  @UseGuards(AuthGuard, ProjectRolesGuard)
  public async createTask(
    @Context("user") user: User,
    @CaslUser() userProxy: UserProxy,
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    const caslUser = await userProxy.get();
    const abilities = this.abilityFactory.createForUser(caslUser!);
    if (input.parentTaskId) {
      const parentTask = await this.taskService.findById(input.parentTaskId);
      if (!parentTask) throw new NotFoundException();
      if (
        !abilities.can("update", subject(Task as any, parentTask), "subtasks")
      ) {
        throw new ForbiddenException();
      }
    } else {
      if (!abilities.can("create", subject(Task as any, input), "tasks")) {
        throw new ForbiddenException();
      }
    }

    const task = await this.taskService.create({
      tags: !!input.tagIds ? (input.tagIds.map((id) => ({ id })) as any) : [],
      assignees: !!input.assigneeIds
        ? (input.assigneeIds.map((id) => ({ id })) as any)
        : [],
      creatorId: user.id,
      ...input,
    });

    if (!!input.assigneeIds?.length) {
      await this.projectService.addMemberIfNotExists(
        input.projectId,
        input.assigneeIds
      );
    }

    return task;
  }

  @Mutation(() => TaskApplication)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(CustomPermissionActions.claimTask, Task, [
    TaskService,
    (service: TaskService, { params }) => service.findById(params.input.taskId),
  ])
  public async createTaskApplication(
    @Args("input") input: CreateTaskApplicationInput
  ): Promise<TaskApplication> {
    return this.taskService.createApplication(input);
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  @UseAbility(Actions.delete, TaskApplication, [
    TaskService,
    async (_service: TaskService, { params }) => ({
      taskId: params.input.taskId,
      userId: params.input.userId,
    }),
  ])
  public async deleteTaskApplication(
    @Args("input") input: DeleteTaskApplicationInput
  ): Promise<Task> {
    return this.taskService.deleteApplication(input.taskId, input.userId);
  }

  @Mutation(() => TaskSubmission)
  @UseGuards(AuthGuard)
  public async createTaskSubmission(
    @Context("user") user: User,
    @CaslUser() userProxy: UserProxy,
    @Args("input") input: CreateTaskSubmissionInput
  ): Promise<TaskSubmission> {
    const task = await this.taskService.findById(input.taskId);
    if (!task) throw new NotFoundException();

    const caslUser = await userProxy.get();
    const abilities = this.abilityFactory.createForUser(caslUser!);
    if (!abilities.can("update", subject(Task as any, task), "submissions")) {
      throw new ForbiddenException();
    }

    return this.taskService.createSubmission({ ...input, userId: user.id });
  }

  @Mutation(() => TaskSubmission)
  @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  @UseAbility(Actions.update, TaskSubmission, [
    TaskService,
    async (_service: TaskService, { params }) => ({
      taskId: params.input.taskId,
      userId: params.input.userId,
    }),
  ])
  public async updateTaskSubmission(
    @Context("user") user: User,
    @Args("input") input: UpdateTaskSubmissionInput
  ): Promise<TaskSubmission> {
    if (!!input.approverId && input.approverId !== user.id) {
      throw new ForbiddenException();
    }
    return this.taskService.updateSubmission(input);
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

    if (!!input.assigneeIds?.length) {
      await this.projectService.addMemberIfNotExists(
        task.projectId,
        input.assigneeIds
      );
    }

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

  @Mutation(() => Task)
  @UseGuards(AuthGuard, TaskRolesGuard, AccessGuard)
  @UseAbility(Actions.manage, TaskReaction)
  public async createTaskReaction(
    @Context("user") user: User,
    @Args("input") input: TaskReactionInput
  ): Promise<Task> {
    await this.taskService.createReaction(input, user.id);
    return this.taskService.findById(input.taskId) as Promise<Task>;
  }

  @Mutation(() => Task)
  @UseGuards(AuthGuard)
  public async deleteTaskReaction(
    @Context("user") user: User,
    @Args("input") input: TaskReactionInput
  ): Promise<Task> {
    await this.taskService.deleteReaction(input, user.id);
    return this.taskService.findById(input.taskId) as Promise<Task>;
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
    return this.taskService.findWithRelations({
      ...input,
      // Note(fant): workaround to make GetTasksToPayQuery return tasks in private projects
      includePrivateProjects: !!input.ids?.length,
    });
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
    return this.taskService.findWithRelations({
      projectIds: [project.id],
      includePrivateProjects: true,
    });
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

@Injectable()
@Resolver(() => User)
export class UserTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(
    @Context("user") authenticatedUser: User | undefined,
    @Parent() user: User
  ): Promise<Task[]> {
    return this.taskService.findWithRelations({
      assigneeId: user.id,
      includePrivateProjects: authenticatedUser?.id === user.id,
    });
  }
}
