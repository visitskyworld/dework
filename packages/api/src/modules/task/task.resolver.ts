import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Context,
  Info,
  Int,
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
import { ProjectService } from "../project/project.service";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { CreateTaskSubmissionInput } from "./dto/CreateTaskSubmissionInput";
import { UpdateTaskSubmissionInput } from "./dto/UpdateTaskSubmissionInput";
import { RoleGuard } from "../rbac/rbac.guard";
import _ from "lodash";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { RbacService } from "../rbac/rbac.service";
import { OrganizationService } from "../organization/organization.service";
import { AuditLogEvent } from "@dewo/api/models/AuditLogEvent";
import { AuditLogService } from "../auditLog/auditLog.service";
import { GraphQLResolveInfo } from "graphql";
import GraphQLFields from "graphql-fields";
import { Skill } from "@dewo/api/models/Skill";
import { Workspace } from "@dewo/api/models/Workspace";

@Injectable()
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly permalinkService: PermalinkService,
    private readonly rbacService: RbacService,
    private readonly auditLogService: AuditLogService
  ) {}

  @ResolveField(() => [TaskTag])
  public async tags(@Parent() task: Task): Promise<TaskTag[]> {
    // needed?
    if (!!task.tags) return task.tags;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.tags;
    // return _.sortBy(task.tags, (t) => t.createdAt);
  }

  @ResolveField(() => [User])
  public async assignees(@Parent() task: Task): Promise<User[]> {
    if (!!task.assignees) return task.assignees;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.assignees;
  }

  @ResolveField(() => [Skill])
  public async skills(@Parent() task: Task): Promise<Skill[]> {
    if (!!task.skills) return task.skills;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.skills;
  }

  @ResolveField(() => [AuditLogEvent])
  public async auditLog(@Parent() task: Task): Promise<AuditLogEvent[]> {
    return this.auditLogService.get(task);
  }

  @ResolveField(() => [User])
  public async owners(@Parent() task: Task): Promise<User[]> {
    if (!!task.owners) return task.owners;
    const refetched = await this.taskService.findById(task.id);
    return refetched!.owners;
  }

  @ResolveField(() => [TaskSubmission])
  public async submissions(@Parent() task: Task): Promise<TaskSubmission[]> {
    const submissions = await task.submissions;
    return submissions.filter((s) => !s.deletedAt);
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
      inject: [TaskService, ProjectService],
      async getSubject(
        params: { input: CreateTaskInput },
        service: TaskService
      ) {
        const parentTask = !!params.input.parentTaskId
          ? await service.findById(params.input.parentTaskId)
          : undefined;
        return Object.assign(new Task(), params.input, { parentTask });
      },
      async getOrganizationId(
        _subject,
        params: { input: CreateTaskInput },
        _service: TaskService,
        projectService: ProjectService
      ) {
        const project = await projectService.findById(params.input.projectId);
        return project?.organizationId;
      },
    })
  )
  public async createTask(
    @Context("user") user: User,
    @Args("input") input: CreateTaskInput
  ): Promise<Task> {
    const task = await this.taskService.create({
      tags: !!input.tagIds ? (input.tagIds.map((id) => ({ id })) as any) : [],
      skills: !!input.skillIds
        ? (input.skillIds.map((id) => ({ id })) as any)
        : [],
      assignees: !!input.assigneeIds
        ? (input.assigneeIds.map((id) => ({ id })) as any)
        : [],
      owners: !!input.ownerIds
        ? (input.ownerIds.map((id) => ({ id })) as any)
        : [],
      creatorId: user.id,
      rewards: !!input.reward ? [input.reward] : [],
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
      getFields: (params: { input: UpdateTaskInput }) => {
        const fields = Object.keys(_.omit(params.input, ["id"]));
        if (!!params.input.status) {
          fields.push(`status[${params.input.status}]`);
        }
        return fields;
      },
      async getSubject(
        params: { input: UpdateTaskInput },
        service: TaskService
      ) {
        const task = await service.findById(params.input.id);
        await task?.parentTask;
        return task;
      },
      async getOrganizationId(subject: Task) {
        const project = await subject.project;
        return project.organizationId;
      },
    })
  )
  public async updateTask(
    @Context("user") user: User,
    @Args("input") input: UpdateTaskInput
  ): Promise<Task> {
    const task = await this.taskService.update(
      {
        ...input,
        tags: !!input.tagIds
          ? (input.tagIds.map((id) => ({ id })) as any)
          : undefined,
        skills: !!input.skillIds
          ? (input.skillIds.map((id) => ({ id })) as any)
          : undefined,
        assignees: !!input.assigneeIds
          ? (input.assigneeIds.map((id) => ({ id })) as any)
          : undefined,
        owners: !!input.ownerIds
          ? (input.ownerIds.map((id) => ({ id })) as any)
          : undefined,
        rewards: !!input.reward ? [input.reward] : undefined,
      },
      user.id
    );

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
    @Context("user") user: User,
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task> {
    return this.taskService.update({ id, deletedAt: new Date() }, user.id);
  }

  @Mutation(() => [Task])
  @UseGuards(AuthGuard)
  public async createTaskPayments(
    @Context("user") user: User,
    @Args("input") input: CreateTaskPaymentsInput
  ): Promise<Task[]> {
    if (!input.payments.length) return [];
    return this.taskService.createPayments(input, user.id);
  }

  @Mutation(() => [Task])
  @UseGuards(AuthGuard)
  public async clearTaskPayments(
    @Args("paymentId", { type: () => GraphQLUUID }) paymentId: string
  ): Promise<Task[]> {
    return this.taskService.clearPayments(paymentId);
  }

  @Mutation(() => Task)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskReaction,
      inject: [TaskService],
      getSubject: async (
        params: { input: TaskReactionInput; user: User },
        service: TaskService
      ) => {
        const task = await service.findById(params.input.taskId);
        return Object.assign(new TaskReaction(), {
          userId: params.user.id,
          task,
        });
      },
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
      getSubject: async (
        params: { input: TaskReactionInput; user: User },
        service: TaskService
      ) => {
        const task = await service.findById(params.input.taskId);
        return Object.assign(new TaskReaction(), {
          userId: params.user.id,
          task,
        });
      },
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

  @Query(() => Task)
  @UseGuards(
    RoleGuard({
      action: "read",
      subject: Project,
      inject: [TaskService],
      getSubject: (params: { id: string }, service: TaskService) =>
        service.findById(params.id).then((t) => t?.project),
      getOrganizationId: (subject) => subject.organizationId,
    })
  )
  public async getTask(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Task | undefined> {
    const task = await this.taskService.findById(id);
    if (!task) throw new NotFoundException();
    return task;
  }

  @Query(() => [Task])
  public async getTasks(
    @Args("input") input: GetTasksInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<Task[]> {
    if (input.ids?.length === 0) return [];
    if (input.statuses?.length === 0) return [];
    const fields = GraphQLFields(info as any);
    return this.taskService.findWithRelations({
      ...input,
      joinProjectOrganization: !!fields.project?.organization,
    });
  }
}

@Injectable()
@Resolver(() => Organization)
export class OrganizationTasksResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly organizationService: OrganizationService
  ) {}

  @ResolveField(() => [Task])
  public async tasks(
    @Context("user") user: User | undefined,
    @Parent() organization: Organization,
    @Args("filter", { nullable: true }) filter: TaskFilterInput
  ): Promise<Task[]> {
    const projects = await this.organizationService.getProjects(
      organization.id,
      user?.id
    );
    return this.taskService.findWithRelations({
      ...filter,
      projectIds: projects.map((p) => p.id),
    });
  }
}

@Injectable()
@Resolver(() => Workspace)
export class WorkspaceTasksResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly organizationService: OrganizationService
  ) {}

  @ResolveField(() => [Task])
  public async tasks(
    @Context("user") user: User | undefined,
    @Parent() workspace: Workspace,
    @Args("filter", { nullable: true }) filter: TaskFilterInput
  ): Promise<Task[]> {
    const projects = await this.organizationService.getProjects(
      workspace.organizationId,
      user?.id
    );
    return this.taskService.findWithRelations({
      ...filter,
      projectIds: projects
        .filter((p) => p.workspaceId === workspace.id)
        .map((p) => p.id),
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

  // TODO(fant): remove after Task.reward => Task.rewards migration (220530)
  @ResolveField(() => Int)
  public async taskCount(
    @Parent() _project: Project,
    @Args("status", { type: () => TaskStatus, nullable: true })
    _status: TaskStatus | undefined,
    @Args("rewardNotNull", { type: () => Boolean, nullable: true })
    _rewardNotNull: boolean | undefined
  ): Promise<number> {
    return 0;
  }
}

@Injectable()
@Resolver(() => User)
export class UserTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [Task])
  public async tasks(
    @Context("user") requestingUser: User | undefined,
    @Parent() user: User,
    @Args("filter", { nullable: true }) filter: TaskFilterInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<Task[]> {
    const fields = GraphQLFields(info as any);
    return this.taskService.findWithRelations({
      ...filter,
      userId: user.id,
      requestingUserId: requestingUser?.id,
      joinProjectOrganization: !!fields.project?.organization,
    });
  }
}
