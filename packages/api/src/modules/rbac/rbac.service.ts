import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
import { User } from "@dewo/api/models/User";

export type Action = "create" | "read" | "update" | "delete";
export type Subject = InferSubjects<
  typeof Organization | typeof Project | typeof Task | typeof Role | typeof Rule
>;

export class AppAbility extends Ability<[Action, Subject]> {}

@Injectable()
export class RbacService {
  private readonly logger = new Logger(this.constructor.name);

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
    return this.createAbility(rules, organizationId);
  }

  public async createRole(partial: Partial<Role>): Promise<Role> {
    const x = await this.roleRepo.save(partial);
    return this.roleRepo.findOne(x.id) as Promise<Role>;
  }

  public async createRule(partial: Partial<Rule>): Promise<Rule> {
    const x = await this.ruleRepo.save(partial);
    return this.ruleRepo.findOne(x.id) as Promise<Rule>;
  }

  public async addRole(user: User, role: Role): Promise<void> {
    await this.roleRepo
      .createQueryBuilder()
      .relation("users")
      .of(role)
      .add(user);
  }

  public async removeRole(user: User, role: Role): Promise<void> {
    await this.roleRepo
      .createQueryBuilder()
      .relation("users")
      .of(role)
      .remove(user);
  }

  private async createAbility(
    rules: Rule[],
    organizationId: string
  ): Promise<AppAbility> {
    const builder = new AbilityBuilder<AppAbility>(AppAbility);

    for (const rule of rules) {
      const fn = rule.inverted ? builder.cannot : builder.can;

      const taskConditions: Partial<Task> | undefined = !!rule.taskId
        ? { id: rule.taskId }
        : !!rule.projectId
        ? { projectId: rule.projectId }
        : undefined;

      const projectCondition: Partial<Project> | undefined = !!rule.projectId
        ? { id: rule.projectId }
        : { organizationId };

      const organizationConditions: Partial<Organization> | undefined = {
        id: organizationId,
      };

      const roleConditions: Partial<Role> | undefined = { organizationId };

      switch (rule.permission) {
        case RulePermission.MANAGE_ORGANIZATION:
          fn(["update", "delete"], Organization, organizationConditions);
          fn("create", Project, projectCondition);
          fn(["create", "read", "update", "delete"], Role, roleConditions);
          fn(["create", "read", "update", "delete"], Rule);
          break;
        case RulePermission.MANAGE_PROJECTS:
          fn(["read", "update", "delete"], Project, projectCondition);
          fn("create", Task, taskConditions);
          break;
        case RulePermission.MANAGE_TASKS:
          fn(["read", "update", "delete"], Task, taskConditions);
          break;
        case RulePermission.VIEW_PROJECTS:
          fn("read", Project, projectCondition);
          fn("read", Task, taskConditions);
          break;
      }
    }

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
      .where("user.id = :userId OR role.default IS TRUE", { userId })
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
