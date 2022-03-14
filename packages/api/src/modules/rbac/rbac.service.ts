import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Role } from "@dewo/api/models/rbac/Role";
import { Rule, RulePermission } from "@dewo/api/models/rbac/Rule";
import {
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { Task } from "@dewo/api/models/Task";
import { Project } from "@dewo/api/models/Project";
import { Organization } from "@dewo/api/models/Organization";
import { AtLeast } from "@dewo/api/types/general";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { TaskSubmission } from "@dewo/api/models/TaskSubmission";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { TaskTag } from "@dewo/api/models/TaskTag";

export type Action = "create" | "read" | "update" | "delete";
export type Subject = InferSubjects<
  | typeof Organization
  | typeof Project
  | typeof ProjectSection
  | typeof Task
  | typeof TaskTag
  | typeof TaskApplication
  | typeof TaskSubmission
  | typeof Role
  | typeof Rule
  | "UserRole"
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

  public async createRule(partial: Partial<Rule>): Promise<Rule> {
    const x = await this.ruleRepo.save(partial);
    return this.ruleRepo.findOne(x.id) as Promise<Rule>;
  }

  public async addRole(userId: string, roleId: string): Promise<void> {
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

      const project: Partial<Project> | undefined = !!rule.projectId
        ? { id: rule.projectId }
        : { organizationId };

      const organization: Partial<Organization> | undefined = {
        id: organizationId,
      };

      const roleConditions: Partial<Role> | undefined = { organizationId };

      switch (rule.permission) {
        case RulePermission.MANAGE_ORGANIZATION:
          fn(["update", "delete"], Organization, organization);
          fn(["create", "read", "update", "delete"], ProjectSection);
          fn("update", Project, ["sectionId", "sortKey"], project);
          fn(["create", "read", "update", "delete"], Role, roleConditions);
          fn(["create", "read", "update", "delete"], Rule);
          fn(["create", "delete"], "UserRole");
          break;
        case RulePermission.MANAGE_PROJECTS:
          fn(["create", "read", "update", "delete"], Project, project);
          fn(["create", "read", "update", "delete"], TaskTag, taskTag);
          break;
        case RulePermission.MANAGE_TASKS:
          fn(["create", "read", "update", "delete"], Task, task);
          // fn(["create", "read", "delete"], TaskApplication);
          // fn(["read", "delete"], TaskSubmission);
          break;
        case RulePermission.VIEW_PROJECTS:
          fn("read", Project, project);
          fn("read", Task, task);
          // Note(fant): this makes ppl with this permission able to create tasks in general...
          fn(["create"], Task, "applications", task);
          fn(["create", "read", "update", "delete"], TaskApplication, {
            userId,
          });
          fn(["create", "read", "update", "delete"], TaskSubmission, {
            userId,
          });
          break;
      }
    }

    builder.can("update", Task, ["status", "sectionId", "sortKey"], {
      assignees: { $elemMatch: { id: userId } },
    });
    builder.can(["read", "update", "delete"], Task, {
      ownerId: userId,
    });
    builder.can("create", Task, "submissions", {
      assignees: { $elemMatch: { id: userId } },
    });

    return builder.build({
      detectSubjectType: (item: Subject): ExtractSubjectType<Subject> =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }

  private async getRules(
    userId: string | undefined,
    organizationId: string
    // entity:
    //   | { taskId: string }
    //   | { projectId: string }
    //   | { organizationId: string },
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

    // if ('taskId' in entity) {
    //   // rule.taskId matches, task's projectId matches rule.projectId, taskId and projectId are null
    //   // qb = qb.andWhere('rule.taskId = :taskId', { taskId: entity.taskId });
    // } else if ('projectId' in entity) {

    // } else {

    // }

    // .where(
    //   new Brackets((qb) => qb.where("member.userId = :userId", { userId }).orWhere('organization.defaultRole = role.id'))
    // );
    // return qb.getMany();
  }

  public async findRoleById(id: string): Promise<Role | undefined> {
    return this.roleRepo.findOne(id);
  }
}
