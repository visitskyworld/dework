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
import { Organization } from "@dewo/api/models/Organization";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import { CreateTaskPaymentsInput } from "./dto/CreateTaskPaymentsInput";
import slugify from "slugify";
import { GetTasksInput, TaskFilterInput } from "./dto/GetTasksInput";
import { PermalinkService } from "../permalink/permalink.service";
import { TaskReactionInput } from "./dto/TaskReactionInput";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { DeleteTaskApplicationInput } from "./dto/DeleteTaskApplicationInput";
import { ProjectService } from "../project/project.service";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { CreateTaskSubmissionInput } from "./dto/CreateTaskSubmissionInput";
import { UpdateTaskSubmissionInput } from "./dto/UpdateTaskSubmissionInput";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { CreateTaskSectionInput } from "./dto/CreateTaskSectionInput";
import { UpdateTaskSectionInput } from "./dto/UpdateTaskSectionInput";
import { RoleGuard } from "../rbac/rbac.guard";
import _ from "lodash";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { RbacService } from "../rbac/rbac.service";

@Injectable()
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly permalinkService: PermalinkService,
    private readonly rbacService: RbacService
  ) {}

  @ResolveField(() => [TaskTag])
  public async tags(@Parent() task: Task): Promise<TaskTag[]> {
    // needed?
    if (!!task.tags) return task.tags;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.tags;
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
  public permalink(
    @Context("origin") origin: string,
    @Parent() task: Task
  ): Promise<string> {
    return this.permalinkService.get(task, origin);
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Task,
      inject: [ProjectService],
      async getOrganizationId(
        _subject,
        params: { input: CreateTaskInput },
        service
      ) {
        const project = await service.findById(params.input.projectId);
        return project?.organizationId;
      },
    })
  )
  public async createTask(
    @Context("user") user: User,
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    // const caslUser = await userProxy.get();
    // const abilities = this.abilityFactory.createForUser(caslUser!);
    // if (input.parentTaskId) {
    //   const parentTask = await this.taskService.findById(input.parentTaskId);
    //   if (!parentTask) throw new NotFoundException();
    //   if (
    //     !abilities.can("update", subject(Task as any, parentTask), "subtasks")
    //   ) {
    //     throw new ForbiddenException();
    //   }
    // } else {
    //   if (!abilities.can("create", subject(Task as any, input), "tasks")) {
    //     throw new ForbiddenException();
    //   }
    // }

    const task = await this.taskService.create({
      tags: !!input.tagIds ? (input.tagIds.map((id) => ({ id })) as any) : [],
      assignees: !!input.assigneeIds
        ? (input.assigneeIds.map((id) => ({ id })) as any)
        : [],
      creatorId: user.id,
      ...input,
    });

    if (!!input.assigneeIds?.length) {
      const project = await task.project;
      await this.rbacService.addToOrganization(
        input.assigneeIds,
        project.organizationId
      );
    }

    return task;
  }

  @Mutation(() => TaskApplication)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskApplication,
      inject: [TaskService],
      getSubject: (params: { input: CreateTaskApplicationInput }) =>
        Object.assign(new TaskApplication(), params.input),
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
    return this.taskService.createApplication(input);
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: TaskApplication,
      inject: [TaskService],
      getSubject: (params: { input: CreateTaskApplicationInput }) =>
        Object.assign(new TaskApplication(), params.input),
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
    @Args("input") input: DeleteTaskApplicationInput
  ): Promise<Task> {
    return this.taskService.deleteApplication(input.taskId, input.userId);
  }

  @Mutation(() => TaskSubmission)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "submit",
      subject: Task,
      inject: [TaskService],
      getSubject: (params: { input: CreateTaskSubmissionInput }, service) =>
        service.findById(params.input.taskId),
      async getOrganizationId(subject) {
        const project = await subject.project;
        return project?.organizationId;
      },
    }),
    RoleGuard({
      action: "create",
      subject: TaskSubmission,
      inject: [TaskService],
      getSubject: (params: { input: CreateTaskSubmissionInput; user: User }) =>
        Object.assign(new TaskSubmission(), { userId: params.user.id }),
      async getOrganizationId(_subject, params, service) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
  public async createTaskSubmission(
    @Context("user") user: User,
    @Args("input") input: CreateTaskSubmissionInput
  ): Promise<TaskSubmission> {
    const task = await this.taskService.findById(input.taskId);
    if (!task) throw new NotFoundException();
    return this.taskService.createSubmission({ ...input, userId: user.id });
  }

  @Mutation(() => TaskSubmission)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "submit",
      subject: Task,
      inject: [TaskService],
      getSubject: (params: { input: UpdateTaskSubmissionInput }, service) =>
        service.findById(params.input.taskId),
      async getOrganizationId(subject) {
        const project = await subject.project;
        return project?.organizationId;
      },
    }),
    RoleGuard({
      action: "update",
      subject: TaskSubmission,
      inject: [TaskService],
      getSubject: (params: { input: UpdateTaskSubmissionInput; user: User }) =>
        Object.assign(new TaskSubmission(), { userId: params.user.id }),
      async getOrganizationId(_subject, params, service) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
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
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Task,
      inject: [TaskService],
      getFields: (params: { input: UpdateTaskInput }) =>
        Object.keys(_.omit(params.input, ["id"])),
      getSubject: (params: { input: UpdateTaskInput }, service: TaskService) =>
        service.findById(params.input.id),
      async getOrganizationId(subject: Task) {
        const project = await subject.project;
        return project.organizationId;
      },
    })
  )
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
      const project = await task.project;
      await this.rbacService.addToOrganization(
        input.assigneeIds,
        project.organizationId
      );
    }

    return task;
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: Task,
      inject: [TaskService],
      getSubject: (params: { id: string }, service: TaskService) =>
        service.findById(params.id),
      async getOrganizationId(subject: Task) {
        const project = await subject.project;
        return project.organizationId;
      },
    })
  )
  public async deleteTask(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task> {
    return this.taskService.update({ id, deletedAt: new Date() });
  }

  @Mutation(() => [Task])
  @UseGuards(AuthGuard)
  public async createTaskPayments(
    @Args("input") input: CreateTaskPaymentsInput
  ): Promise<Task[]> {
    if (!input.taskRewardIds.length) return [];
    return this.taskService.createPayments(input);
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskReaction,
      inject: [TaskService],
      getSubject: (params: { input: TaskReactionInput; user: User }) =>
        Object.assign(new TaskReaction(), { userId: params.user.id }),
      async getOrganizationId(_subject, params, service) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
  public async createTaskReaction(
    @Context("user") user: User,
    @Args("input") input: TaskReactionInput
  ): Promise<Task> {
    await this.taskService.createReaction(input, user.id);
    return this.taskService.findById(input.taskId) as Promise<Task>;
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: TaskReaction,
      inject: [TaskService],
      getSubject: (params: { input: TaskReactionInput; user: User }) =>
        Object.assign(new TaskReaction(), { userId: params.user.id }),
      async getOrganizationId(_subject, params, service) {
        const task = await service.findById(params.input.taskId);
        const project = await task?.project;
        return project?.organizationId;
      },
    })
  )
  public async deleteTaskReaction(
    @Context("user") user: User,
    @Args("input") input: TaskReactionInput
  ): Promise<Task> {
    await this.taskService.deleteReaction(input, user.id);
    return this.taskService.findById(input.taskId) as Promise<Task>;
  }

  @Mutation(() => TaskSection)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskSection,
      inject: [ProjectService],
      getSubject: (params: { input: CreateTaskSectionInput }) =>
        Object.assign(new TaskSection(), { projectId: params.input.projectId }),
      getOrganizationId: async (
        _subject,
        params: { input: CreateTaskSectionInput },
        service
      ) => {
        const project = await service.findById(params.input.projectId);
        return project?.organizationId;
      },
    })
  )
  public async createTaskSection(
    @Args("input") input: CreateTaskSectionInput
  ): Promise<TaskSection> {
    return this.taskService.createSection(input);
  }

  @Mutation(() => TaskSection)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: TaskSection,
      inject: [TaskService, ProjectService],
      getSubject: (
        params: { input: UpdateTaskSectionInput },
        service: TaskService
      ) => service.findSectionById(params.input.id),
      getOrganizationId: async (subject) => {
        const project = await subject.project;
        return project?.organizationId;
      },
    })
  )
  public async updateTaskSection(
    @Args("input") input: UpdateTaskSectionInput
  ): Promise<TaskSection> {
    return this.taskService.updateSection(input);
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
  public async tasks(
    @Parent() organization: Organization,
    @Args("filter", { nullable: true }) filter: TaskFilterInput
  ): Promise<Task[]> {
    return this.taskService.findWithRelations({
      ...filter,
      organizationIds: [organization.id],
    });
  }
}

@Injectable()
@Resolver(() => Project)
export class ProjectTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(
    @Parent() project: Project,
    @Args("filter", { nullable: true }) filter: TaskFilterInput
  ): Promise<Task[]> {
    return this.taskService.findWithRelations({
      ...filter,
      projectIds: [project.id],
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
    if (project.taskCount !== undefined) return project.taskCount;
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
  public async tasks(@Parent() user: User): Promise<Task[]> {
    return this.taskService.findWithRelations({ assigneeId: user.id });
  }
}
