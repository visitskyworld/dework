import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, In, Repository } from "typeorm";
import { Role } from "@dewo/api/models/rbac/Role";
import { Rule, RulePermission } from "@dewo/api/models/rbac/Rule";
import {
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { Project } from "@dewo/api/models/Project";
import { Organization } from "@dewo/api/models/Organization";
import { AtLeast } from "@dewo/api/types/general";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { TaskReward } from "@dewo/api/models/TaskReward";

export class UserRole {
  role!: Role;
  userId!: string;
  constructor(data: UserRole) {
    Object.assign(this, data);
  }
}

export type Action = "create" | "read" | "update" | "delete" | "submit";
export type Subject = InferSubjects<
  | typeof Organization
  | typeof Project
  | typeof ProjectSection
  | typeof Task
  | typeof TaskReward
  | typeof TaskTag
  | typeof TaskSection
  | typeof TaskReaction
  | typeof TaskApplication
  | typeof TaskSubmission
  | typeof Role
  | typeof Rule
  | typeof UserRole
>;

export class AppAbility extends Ability<[Action, Subject]> {}

@Injectable()
export class RbacService {
  // private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Rule)
    private readonly ruleRepo: Repository<Rule>
  ) {}

  public async abilityForUser(
    userId: string | undefined,
    organizationId: string
  ): Promise<AppAbility> {
    const rules = await this.getRules(userId, organizationId);
    return this.createAbility(rules, organizationId, userId);
  }

  public async createRole(
    data: AtLeast<Role, "name" | "color" | "organizationId">
  ): Promise<Role> {
    const x = await this.roleRepo.save(Object.assign(new Role(), data));
    return this.roleRepo.findOne(x.id) as Promise<Role>;
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
      await this.addRole(userId, role.id);
      return role;
    }

    const newRole = await this.createRole({
      name: "",
      color: "",
      userId,
      organizationId,
    });
    await this.addRole(userId, newRole.id);
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
      partial.projectId === (rule.projectId ?? undefined) &&
      partial.taskId === (rule.taskId ?? undefined);

    const rules = await this.ruleRepo.save(
      partial.map((p) => currentRules.find((r) => matches(p, r)) ?? p)
    );

    return this.ruleRepo.findByIds(rules.map((r) => r.id));
  }

  public async deleteRule(ruleId: string): Promise<void> {
    await this.ruleRepo.delete(ruleId);
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

    await Promise.all(userIds.map((id) => this.addRole(id, fallbackRole.id)));
  }

  public async addRole(userId: string, roleId: string): Promise<void> {
    // hack: remove the role mapping first to prevent getting errors with duplicate entries
    await this.removeRole(userId, roleId);
    await this.roleRepo
      .createQueryBuilder()
      .relation("users")
      .of(roleId)
      .add(userId);
  }

  public async removeRole(userId: string, roleId: string): Promise<void> {
    await this.roleRepo
      .createQueryBuilder()
      .relation("users")
      .of(roleId)
      .remove(userId);
  }

  private async createAbility(
    rules: Rule[],
    organizationId: string,
    userId: string | undefined
  ): Promise<AppAbility> {
    const builder = new AbilityBuilder<AppAbility>(AppAbility);

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
      const taskSection: Partial<TaskSection> | undefined = !!rule.projectId
        ? { projectId: rule.projectId }
        : undefined;
      const project: Partial<Project> | undefined = !!rule.projectId
        ? { id: rule.projectId }
        : { organizationId };
      const organization: Partial<Organization> | undefined = {
        id: organizationId,
      };

      const roleConditions: Partial<Role> | undefined = { organizationId };

      const CRUD: Action[] = ["create", "read", "update", "delete"];
      switch (rule.permission) {
        case RulePermission.MANAGE_ORGANIZATION:
          fn(["update", "delete"], Organization, organization);
          fn(CRUD, ProjectSection);
          fn("update", Project, ["sectionId", "sortKey"], project);
          fn(CRUD, Role, roleConditions);
          fn(CRUD, Rule);
          fn(["create", "delete"], UserRole);
          break;
        case RulePermission.MANAGE_PROJECTS:
          fn(CRUD, Project, project);
          fn(CRUD, TaskTag, taskTag);
          fn(CRUD, TaskReward, taskSection);
          fn(CRUD, TaskSection, taskSection);
          fn("submit", Task);
          fn(CRUD, TaskSubmission);
          fn("delete", TaskApplication);

          fn(CRUD, Task, task);
        // eslint-disable-next-line no-fallthrough
        case RulePermission.SUGGEST_AND_VOTE:
          fn("create", Task, { ...task, status: TaskStatus.BACKLOG });
          fn(CRUD, TaskReaction, { userId });
          break;
        case RulePermission.VIEW_PROJECTS:
          fn("read", Project, project);
          fn("read", Task, task);
          fn(CRUD, TaskApplication, { userId });
          fn(CRUD, TaskSubmission, { userId });

          fn("submit", Task, {
            ...task,
            "options.allowOpenSubmission": true,
          });
          break;
      }
    }

    builder.can(["create", "delete"], UserRole, {
      // @ts-expect-error
      "role.fallback": true,
      userId,
    });
    builder.can("update", Task, ["status", "sectionId", "sortKey"], {
      assignees: { $elemMatch: { id: userId } },
    });
    builder.can(["read", "update", "delete"], Task, {
      ownerId: userId,
    });

    // this is currently only used UI-wise to determine if all task submissions should be shown
    builder.can("update", Task, "submissions", { ownerId: userId });
    builder.can("submit", Task, { ownerId: userId });
    builder.can("submit", Task, { assignees: { $elemMatch: { id: userId } } });

    // TODO(fant): make sure these users can do everything
    // const superadminIds = this.config.get<string>("SUPERADMIN_USER_IDS") ?? "";

    return builder.build({
      detectSubjectType: (item: Subject): ExtractSubjectType<Subject> =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }

  private async getRules(
    userId: string | undefined,
    organizationId: string
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
}
