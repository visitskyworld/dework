import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "@dewo/api/models/rbac/Role";
import { Rule, RulePermission } from "@dewo/api/models/rbac/Rule";
import { Ability, AbilityBuilder } from "@casl/ability";
import { Task } from "@dewo/api/models/Task";
import { Project } from "@dewo/api/models/Project";
import { Organization } from "@dewo/api/models/Organization";

type RbacAction = "create" | "read" | "update" | "delete";
type RbacSubject =
  | "Organization"
  | Partial<Organization>
  | "Project"
  | Partial<Project>
  | "Task"
  | Partial<Task>;

@Injectable()
export class RbacService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Rule)
    private readonly ruleRepo: Repository<Rule>
  ) {}

  private async createAbility(
    rules: Rule[],
    organizationId: string
  ): Promise<Ability<[RbacAction, RbacSubject]>> {
    const builder = new AbilityBuilder<Ability<[RbacAction, any]>>(Ability);

    for (const rule of rules) {
      const fn = rule.inverted ? builder.cannot : builder.can;
      const task: Partial<Task> | "Task" = rule.taskId
        ? { id: rule.taskId }
        : rule.projectId
        ? { projectId: rule.projectId }
        : "Task";
      const project: Partial<Project> = rule.projectId
        ? { id: rule.projectId }
        : { organizationId };
      const organization: Partial<Organization> = { id: organizationId };

      switch (rule.permission) {
        case RulePermission.MANAGE_ORGANIZATION:
          fn(["update", "delete"], organization);
          fn("create", project);
          break;
        case RulePermission.MANAGE_PROJECTS:
          fn(["read", "update", "delete"], project);
          fn("create", task);
          break;
        case RulePermission.MANAGE_TASKS:
          fn(["read", "update", "delete"], task);
          break;
        case RulePermission.VIEW_PROJECTS:
          fn("read", project);
          fn("read", task);
          break;
      }
    }

    return new Ability<[RbacAction, RbacSubject]>(builder.rules);
  }

  private async getRules(
    organizationId: string,
    // entity:
    //   | { taskId: string }
    //   | { projectId: string }
    //   | { organizationId: string },
    userId: string
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
}
