import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindConditions, In, Repository } from "typeorm";
import { Role, RoleSource } from "@dewo/api/models/rbac/Role";
import { Rule } from "@dewo/api/models/rbac/Rule";
import {
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { Project } from "@dewo/api/models/Project";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationToken } from "@dewo/api/models/OrganizationToken";
import { AtLeast } from "@dewo/api/types/general";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { Workspace } from "@dewo/api/models/Workspace";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskReward } from "@dewo/api/models/TaskReward";
import { User } from "@dewo/api/models/User";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../app/config";
import { UserRole } from "@dewo/api/models/rbac/UserRole";
import { TaskGatingType } from "@dewo/api/models/enums/TaskGatingType";
import { TaskView } from "@dewo/api/models/TaskView";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { EventBus } from "@nestjs/cqrs";
import { RuleCreatedEvent, RuleDeletedEvent } from "./rbac.events";
import { FundingSession } from "@dewo/api/models/funding/FundingSession";
import { FundingVote } from "@dewo/api/models/funding/FundingVote";

export type Action =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "submit"
  | "apply";
export type Subject = InferSubjects<
  | typeof Organization
  | typeof Project
  | typeof Workspace
  | typeof Task
  | typeof TaskReward
  | typeof TaskTag
  | typeof TaskView
  | typeof TaskSection
  | typeof TaskReaction
  | typeof TaskApplication
  | typeof TaskSubmission
  | typeof Role
  | typeof Rule
  | typeof UserRole
  | typeof FundingSession
  | typeof FundingVote
  | typeof OrganizationToken
>;

export class AppAbility extends Ability<[Action, Subject]> {}

@Injectable()
export class RbacService {
  // private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Rule)
    private readonly ruleRepo: Repository<Rule>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    private readonly config: ConfigService<ConfigType>,
    private readonly eventBus: EventBus
  ) {}

  public async abilityForUser(
    userId: string | undefined,
    organizationId?: string
  ): Promise<AppAbility> {
    const rules = await this.getRules(userId, organizationId);
    return this.createAbility(rules, organizationId, userId);
  }

  public async findRoles(query: FindConditions<Role>): Promise<Role[]> {
    return this.roleRepo.find(query);
  }

  public async createRole(
    data: AtLeast<Role, "name" | "color" | "organizationId">
  ): Promise<Role> {
    const x = await this.roleRepo.save(Object.assign(new Role(), data));
    return this.roleRepo.findOne(x.id) as Promise<Role>;
  }

  public async updateUserRole(
    partial: AtLeast<UserRole, "userId" | "roleId">
  ): Promise<void> {
    await this.userRoleRepo.upsert(partial, {
      conflictPaths: ["userId", "roleId"],
    });
  }

  public async getFallbackRole(
    organizationId: string
  ): Promise<Role | undefined> {
    return this.roleRepo.findOne({ fallback: true, organizationId });
  }

  public async getOrCreatePersonalRole(
    userId: string,
    organizationId: string
  ): Promise<Role> {
    const role = await this.roleRepo.findOne({ userId, organizationId });
    if (!!role) {
      await this.addRoles(userId, [role.id]);
      return role;
    }

    const newRole = await this.createRole({
      name: "",
      color: "",
      userId,
      organizationId,
    });
    await this.addRoles(userId, [newRole.id]);
    return newRole;
  }

  public async createRule(
    partial: AtLeast<Rule, "permission" | "roleId">
  ): Promise<Rule> {
    const [rule] = await this.createRules([partial]);
    return rule;
  }

  public async createRules(
    partial: AtLeast<Rule, "permission" | "roleId">[]
  ): Promise<Rule[]> {
    if (!partial.length) return [];
    const currentRules = await this.ruleRepo.find({
      roleId: In(partial.map((x) => x.roleId)),
    });

    const matches = (
      partial: AtLeast<Rule, "permission" | "roleId">,
      rule: Rule
    ) =>
      partial.roleId === rule.roleId &&
      partial.permission === rule.permission &&
      !!partial.inverted === rule.inverted &&
      partial.fundingSessionId === (rule.fundingSessionId ?? undefined) &&
      partial.projectId === (rule.projectId ?? undefined) &&
      partial.taskId === (rule.taskId ?? undefined);

    const rules = await this.ruleRepo.save(
      partial.map((p) => currentRules.find((r) => matches(p, r)) ?? p)
    );

    const refetched = await this.ruleRepo.findByIds(rules.map((r) => r.id));
    this.eventBus.publishAll(refetched.map((r) => new RuleCreatedEvent(r)));
    return refetched;
  }

  public async deleteRule(rule: Rule): Promise<void> {
    await this.ruleRepo.delete(rule.id);
    this.eventBus.publish(new RuleDeletedEvent(rule));
  }

  public async addToOrganization(
    userIds: string[],
    organizationId: string
  ): Promise<void> {
    const fallbackRole = await this.roleRepo.findOne({
      fallback: true,
      organizationId,
    });
    if (!fallbackRole) {
      throw new Error("Cannot add to organization without fallback role");
    }

    await Promise.all(
      userIds.map((id) => this.addRoles(id, [fallbackRole.id]))
    );
  }

  public async addRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.userRoleRepo.upsert(
      roleIds.map((roleId) => ({ userId, roleId })),
      { conflictPaths: ["userId", "roleId"] }
    );
  }

  public async removeRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .relation("roles")
      .of(userId)
      .remove(roleIds);
  }

  private async createAbility(
    rules: Rule[],
    organizationId: string | undefined,
    userId: string | undefined
  ): Promise<AppAbility> {
    const builder = new AbilityBuilder<AppAbility>(AppAbility);
    const CRUD: Action[] = ["create", "read", "update", "delete"];
    const taskFieldsAssigneesCanUpdate = [
      "status",
      "status[TODO]",
      "status[IN_PROGRESS]",
      "status[IN_REVIEW]",
      "sectionId",
      "sortKey",
    ];

    for (const rule of rules) {
      const fn = rule.inverted ? builder.cannot : builder.can;

      const task: Partial<Task> | undefined = !!rule.taskId
        ? { id: rule.taskId }
        : !!rule.projectId
        ? { projectId: rule.projectId }
        : undefined;
      const taskTag: Partial<TaskTag> | undefined = !!rule.projectId
        ? { projectId: rule.projectId }
        : undefined;
      const taskView: Partial<TaskView> | undefined = !!rule.projectId
        ? { projectId: rule.projectId }
        : undefined;
      const taskSection: Partial<TaskSection> | undefined = !!rule.projectId
        ? { projectId: rule.projectId }
        : undefined;
      const project: Partial<Project> | undefined = !!rule.projectId
        ? { id: rule.projectId }
        : { organizationId };
      const organization: Partial<Organization> | undefined = {
        id: organizationId,
      };

      switch (rule.permission) {
        case RulePermission.MANAGE_ORGANIZATION:
          fn(["update", "delete"], Organization, organization);
          fn(CRUD, Workspace);
          fn(CRUD, TaskView, { organizationId });
          fn(CRUD, TaskView, { workspaceId: { $exists: true } });
          fn("update", Project, ["workspaceId", "sortKey"], project);
          const roleConditions: Partial<Role> | undefined = { organizationId };
          fn(CRUD, Role, roleConditions);
          fn(CRUD, Rule);
          fn(["create", "delete"], UserRole);
          break;
        case RulePermission.MANAGE_PROJECTS:
          fn(CRUD, Project, project);
          fn(CRUD, TaskTag, taskTag);
          fn(CRUD, TaskView, taskView);
          fn(CRUD, TaskReward);
          fn(CRUD, OrganizationToken);
          fn(CRUD, TaskSection, taskSection);
          fn("submit", Task, task);
          fn(CRUD, TaskSubmission);
          fn(["delete", "read"], TaskApplication);
          fn(CRUD, Rule, {
            ...(!!rule.projectId
              ? { "__task__.projectId": rule.projectId }
              : { __task__: { $exists: true } }),
            permission: RulePermission.MANAGE_TASKS,
          });
          fn(CRUD, Rule, { projectId: rule.projectId ?? { $exists: true } });
          fn(CRUD, Task, task);
          break;
        case RulePermission.MANAGE_TASKS:
          if (!!rule.taskId) {
            fn("update", Task, ["assigneeIds", "gating"], task);
          } else {
            fn("create", Task, task);
            fn(CRUD, Rule, {
              ...(!!rule.projectId
                ? { "__task__.projectId": rule.projectId }
                : { __task__: { $exists: true } }),
              permission: RulePermission.MANAGE_TASKS,
            });
          }

          break;
        case RulePermission.MANAGE_FUNDING:
          fn(CRUD, FundingSession, {
            ...(!!rule.fundingSessionId ? { id: rule.fundingSessionId } : {}),
            organizationId,
          });
          // if (!!userId) {
          //   fn(CRUD, FundingVote, {
          //     sessionId: rule.fundingSessionId,
          //     userId,
          //   });
          // }
          break;
        case RulePermission.VIEW_PROJECTS:
          fn("read", Project, project);
          fn("read", Task, task);
          fn("apply", Task, task);
          fn(CRUD, TaskApplication, {
            userId,
            // @ts-ignore
            ...(rule.projectId ? { projectId: rule.projectId } : undefined),
          });

          fn(
            "create",
            Task,
            [
              "name",
              "description",
              "status",
              `status[${TaskStatus.COMMUNITY_SUGGESTIONS}]`,
            ],
            {
              ...task,
              status: TaskStatus.COMMUNITY_SUGGESTIONS,
              ownerIds: { $size: 0 },
            }
          );
          fn(CRUD, TaskReaction, {
            userId,
            ...(!!rule.projectId
              ? { "task.projectId": rule.projectId }
              : undefined),
          });

          fn("submit", Task, {
            ...task,
            gating: TaskGatingType.OPEN_SUBMISSION,
          });
          break;
      }
    }

    if (!!userId) {
      builder.can(CRUD, UserRole, {
        // @ts-expect-error
        "__role__.fallback": true,
        userId,
      });
      builder.can("update", Task, taskFieldsAssigneesCanUpdate, {
        assignees: { $elemMatch: { id: userId } },
      });
      builder.can(["read", "update", "delete"], Task, {
        owners: { $elemMatch: { id: userId } },
      });
      builder.can(CRUD, TaskView, {
        userId,
      });

      // this is currently only used UI-wise to determine if all task submissions should be shown
      builder.can("update", Task, "submissions", {
        owners: { $elemMatch: { id: userId } },
      });
      builder.can("submit", Task, { owners: { $elemMatch: { id: userId } } });
      builder.can("submit", Task, {
        assignees: { $elemMatch: { id: userId } },
      });
      builder.can(CRUD, Task, {
        // @ts-expect-error
        "__parentTask__.assignees": { $elemMatch: { id: userId } },
      });
      // note that Task.submit also needs to be true
      builder.can(CRUD, TaskSubmission, { userId });
    }

    // TODO(fant): make sure these users can do everything
    const superadminIds = this.config.get<string>("SUPERADMIN_USER_IDS") ?? "";
    const isSuperadmin = !!userId && superadminIds.includes(userId);
    if (isSuperadmin) {
      builder.can(CRUD, Organization);
      builder.can(CRUD, Project);
      builder.can(CRUD, Task);
      builder.can(CRUD, TaskReward);
      builder.can(CRUD, Role);
      builder.can(CRUD, Rule);
    }

    return builder.build({
      detectSubjectType: (item: Subject): ExtractSubjectType<Subject> =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }

  private async getRules(
    userId: string | undefined,
    organizationId: string | undefined
  ): Promise<Rule[]> {
    return this.ruleRepo
      .createQueryBuilder("rule")
      .innerJoinAndSelect("rule.role", "role")
      .leftJoin("role.users", "user")
      .where(
        new Brackets((qb) =>
          qb
            .where("user.id = :userId", { userId })
            .orWhere("role.fallback IS TRUE")
        )
      )
      .andWhere("role.organizationId = :organizationId", { organizationId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where("role.userId IS NULL")
            .orWhere("role.userId = :userId", { userId })
        )
      )
      .orderBy(
        `
        CASE
          WHEN rule.taskId IS NOT NULL THEN 2
          WHEN rule.projectId IS NOT NULL THEN 1
          ELSE 0
        END
        `
      )
      .addOrderBy("role.fallback", "DESC") // non-fallback roles last
      .getMany();
  }

  public async findRoleById(id: string): Promise<Role | undefined> {
    return this.roleRepo.findOne(id);
  }

  public async findRuleById(id: string): Promise<Rule | undefined> {
    return this.ruleRepo.findOne(id);
  }

  public async findRolesForTask(
    taskId: string,
    source?: RoleSource
  ): Promise<Role[]> {
    const roles = await this.findRolesForTasks([taskId], source);
    return roles[taskId] ?? [];
  }

  public async findRolesForTasks(
    taskIds: string[],
    source?: RoleSource
  ): Promise<Record<string, Role[]>> {
    let qb = this.roleRepo
      .createQueryBuilder("role")
      .innerJoinAndSelect("role.rules", "rule")
      .where("rule.taskId IN (:...taskIds)", { taskIds })
      .andWhere("rule.permission = :permission", {
        permission: RulePermission.MANAGE_TASKS,
      });
    if (!!source) {
      qb = qb.andWhere("role.source = :source", { source });
    }

    const roles = await qb.getMany();
    const mapping: Record<string, Role[]> = {};
    for (const role of roles) {
      for (const rule of await role.rules) {
        if (!!rule.taskId) {
          if (!mapping[rule.taskId]) mapping[rule.taskId] = [];
          mapping[rule.taskId].push(role);
        }
      }
    }
    return mapping;
  }

  public async isProjectsPrivate(
    projectIds: string[]
  ): Promise<Record<string, boolean>> {
    const rules = await this.ruleRepo
      .createQueryBuilder("rule")
      .innerJoin("rule.role", "role")
      .where("role.fallback IS TRUE")
      .andWhere("rule.projectId IN (:...projectIds)", { projectIds })
      .andWhere("rule.permission = :permission", {
        permission: RulePermission.VIEW_PROJECTS,
      })
      .andWhere("rule.inverted IS TRUE")
      .getMany();

    return projectIds.reduce(
      (acc, projectId) => ({
        ...acc,
        [projectId]: rules.some((rule) => rule.projectId === projectId),
      }),
      {}
    );
  }
}
