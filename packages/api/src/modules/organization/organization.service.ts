import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { OrganizationTag } from "@dewo/api/models/OrganizationTag";
import { Project } from "@dewo/api/models/Project";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { User } from "@dewo/api/models/User";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, IsNull, Repository } from "typeorm";
import { SetOrganizationDetailInput } from "./dto/SetOrganizationDetailInput";
import { RbacService } from "../rbac/rbac.service";
import { RulePermission } from "@dewo/api/models/rbac/Rule";

@Injectable()
export class OrganizationService {
  // private readonly logger = new Logger("UserService");

  constructor(
    private readonly rbacService: RbacService,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepo: Repository<OrganizationMember>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectTokenGate)
    private readonly projectTokenGateRepo: Repository<ProjectTokenGate>,
    @InjectRepository(OrganizationTag)
    private readonly organizationTagRepo: Repository<OrganizationTag>,
    @InjectRepository(EntityDetail)
    private readonly entityDetailRepo: Repository<EntityDetail>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  public async create(
    partial: DeepPartial<Organization>,
    creator: User
  ): Promise<Organization> {
    const created = await this.organizationRepo.save(partial);
    await Promise.all([
      this.rbacService
        .getOrCreatePersonalRole(creator.id, created.id)
        .then(async (role) => {
          for (const permission of [
            RulePermission.MANAGE_ORGANIZATION,
            RulePermission.MANAGE_PROJECTS,
          ]) {
            await this.rbacService.createRule({ roleId: role.id, permission });
          }
          await this.rbacService.addRoles(creator.id, [role.id]);
        }),
      this.rbacService
        .createRole({
          color: "grey",
          name: "@everyone",
          fallback: true,
          organizationId: created.id,
        })
        .then(async (role) => {
          await this.rbacService.createRule({
            roleId: role.id,
            permission: RulePermission.VIEW_PROJECTS,
          });
          await this.rbacService.addRoles(creator.id, [role.id]);
        }),
    ]);

    return this.findById(created.id) as Promise<Organization>;
  }

  public async update(
    partial: DeepAtLeast<Organization, "id">
  ): Promise<Organization> {
    const updated = await this.organizationRepo.save(partial);
    return this.findById(updated.id) as Promise<Organization>;
  }

  public findById(id: string): Promise<Organization | undefined> {
    return this.organizationRepo.findOne(id);
  }

  public async upsertDetail(
    partial: Omit<SetOrganizationDetailInput, "organizationId">,
    organizationId: string
  ): Promise<EntityDetail | void> {
    if (!partial.value) {
      await this.entityDetailRepo.delete({
        organizationId,
        type: partial.type,
      });
      return;
    }

    const existing = await this.entityDetailRepo.findOne({
      organizationId,
      type: partial.type,
    });

    return this.entityDetailRepo.save({
      ...existing,
      organizationId,
      type: partial.type,
      value: partial.value,
    });
  }

  public async createTag(
    partial: AtLeast<OrganizationTag, "organizationId">
  ): Promise<OrganizationTag> {
    const created = await this.organizationTagRepo.save(partial);
    return this.organizationTagRepo.findOne(
      created.id
    ) as Promise<OrganizationTag>;
  }

  public findMember(
    partial: Partial<
      Pick<OrganizationMember, "organizationId" | "userId" | "role">
    >
  ): Promise<OrganizationMember | undefined> {
    return this.organizationMemberRepo.findOne(partial);
  }

  public async removeMember(
    organizationId: string,
    userId: string
  ): Promise<void> {
    await this.organizationMemberRepo.delete({ userId, organizationId });
  }

  public getUsers(organizationId: string): Promise<User[]> {
    return this.userRepo
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.roles", "role")
      .where("role.organizationId = :organizationId", { organizationId })
      .getMany();
  }

  public getAllTags(organizationId: string): Promise<OrganizationTag[]> {
    return this.organizationTagRepo
      .createQueryBuilder("tag")
      .leftJoinAndSelect("tag.organization", "organization")
      .where("tag.organizationId = :organizationId", {
        organizationId,
      })
      .getMany();
  }

  public async getProjects(
    organizationId: string,
    userId: string | undefined
  ): Promise<Project[]> {
    const projects = await this.projectRepo.find({
      organizationId,
      deletedAt: IsNull(),
    });

    const ability = await this.rbacService.abilityForUser(
      userId,
      organizationId
    );
    return projects.filter((project) => ability.can("read", project));
  }

  public async findByUser(userId: string): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoinAndSelect("organization.roles", "role")
      .innerJoinAndSelect("role.users", "user")
      .where("user.id = :userId", { userId })
      .andWhere("role.fallback IS TRUE")
      .andWhere("organization.deletedAt IS NULL")
      .getMany();
  }

  public findFeatured(limit: number): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .where("organization.featured IS TRUE")
      .limit(limit)
      .getMany();
  }

  public findPopular(): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoin("organization.roles", "role", "role.fallback IS TRUE")
      .innerJoin("role.users", "user")
      .where("organization.deletedAt IS NULL")
      .andWhere("LOWER(organization.name) NOT LIKE '%test%'")
      .andWhere("LOWER(organization.name) NOT LIKE '%demo%'")
      .andWhere("LOWER(organization.name) NOT LIKE '%dework%'")
      .groupBy("organization.id")
      .having("COUNT(DISTINCT user.id) >= 20")
      .orderBy("COUNT(DISTINCT user.id)", "DESC")
      .getMany();
  }

  public findProjectTokenGates(
    organizationId: string
  ): Promise<ProjectTokenGate[]> {
    return this.projectTokenGateRepo
      .createQueryBuilder("projectTokenGate")
      .innerJoinAndSelect("projectTokenGate.project", "project")
      .innerJoinAndSelect("project.organization", "organization")
      .where("project.organizationId = :organizationId", { organizationId })
      .getMany();
  }
}
