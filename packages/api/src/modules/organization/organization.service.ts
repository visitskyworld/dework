import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationTag } from "@dewo/api/models/OrganizationTag";
import { Project } from "@dewo/api/models/Project";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { User } from "@dewo/api/models/User";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { slugBlacklist } from "@dewo/api/utils/slugBlacklist";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { IsNull, Raw, Repository } from "typeorm";
import { SetOrganizationDetailInput } from "./dto/SetOrganizationDetailInput";
import { RbacService } from "../rbac/rbac.service";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { UserRole } from "@dewo/api/models/rbac/UserRole";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { TaskViewService } from "../task/taskView/taskView.service";

@Injectable()
export class OrganizationService {
  // private readonly logger = new Logger("UserService");

  constructor(
    private readonly rbacService: RbacService,
    private readonly taskViewService: TaskViewService,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
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
    partial: AtLeast<Organization, "name">,
    creator: User
  ): Promise<Organization> {
    const created = await this.organizationRepo.save({
      ...partial,
      slug: await this.generateSlug(partial.name),
    });
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

    await this.taskViewService.createDefaultOrganizationTaskViews(created);

    return this.findById(created.id) as Promise<Organization>;
  }

  public async update(partial: DeepAtLeast<Organization, "id">): Promise<void> {
    await this.organizationRepo.save(partial);
  }

  public findById(id: string): Promise<Organization | undefined> {
    return this.organizationRepo.findOne(id);
  }

  public findBySlug(slug: string): Promise<Organization | undefined> {
    return this.organizationRepo.findOne({ slug });
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

  public getUsers(
    organizationId: string,
    {
      joinUserRoles = false,
      joinUserThreepids = false,
    }: { joinUserRoles?: boolean; joinUserThreepids?: boolean } = {}
  ): Promise<User[]> {
    let qb = this.userRepo
      .createQueryBuilder("user")
      .innerJoin("user.roles", "orgRoles")
      .where("orgRoles.organizationId = :organizationId", { organizationId })
      .andWhere("orgRoles.fallback IS TRUE");

    if (joinUserRoles) {
      qb = qb.innerJoinAndSelect("user.roles", "role");
    }

    if (joinUserThreepids) {
      qb = qb.innerJoinAndSelect("user.threepids", "threepid");
    }

    return qb.getMany();
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

  public async findByUser(
    userId: string,
    { excludeHidden = true }: { excludeHidden?: boolean } = {}
  ): Promise<Organization[]> {
    let qb = this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoinAndSelect("organization.roles", "role")
      .innerJoinAndSelect("role.users", "user")
      .innerJoin(
        UserRole,
        "userRole",
        "userRole.roleId = role.id AND userRole.userId = :userId",
        { userId }
      )
      .where("user.id = :userId", { userId })
      .andWhere("role.fallback IS TRUE")
      .andWhere("organization.deletedAt IS NULL");

    if (excludeHidden) {
      qb = qb.andWhere("userRole.hidden IS FALSE");
    }
    return qb.getMany();
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
      .having("COUNT(DISTINCT user.id) >= 7")
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

  public async generateSlug(name: string): Promise<string> {
    const slug = slugify(name.slice(0, 20), { lower: true, strict: true });
    const orgsMatchingSlugs = await this.organizationRepo.find({
      where: {
        slug: Raw((alias) => `${alias} ~ '^${slug}(-\\d+)?$'`),
      },
      withDeleted: true,
    });

    if (!orgsMatchingSlugs.length && !slugBlacklist.has(slug)) return slug;
    const matchingSlugs = orgsMatchingSlugs.map((u) => u.slug);
    const set = new Set(matchingSlugs);
    for (let i = 1; i < matchingSlugs.length + 2; i++) {
      const candidate = `${slug}-${i}`;
      if (!set.has(candidate)) return candidate;
    }
    throw new Error("Could not generate slug");
  }

  public async addTokens(
    organizationId: string,
    tokenIds: string[]
  ): Promise<void> {
    const tokens: PaymentToken[] = await this.organizationRepo
      .createQueryBuilder()
      .relation("tokens")
      .of(organizationId)
      .loadMany();

    const existingTokenIds = tokens.map((token) => token.id);

    const newTokenIds = tokenIds.filter(
      (tokenId) => !existingTokenIds.includes(tokenId)
    );

    if (newTokenIds.length) {
      await this.organizationRepo
        .createQueryBuilder()
        .relation("tokens")
        .of(organizationId)
        .add(newTokenIds);
    }
  }

  public async removeTokens(
    organizationId: string,
    tokenIds: string[]
  ): Promise<void> {
    await this.organizationRepo
      .createQueryBuilder()
      .relation("tokens")
      .of(organizationId)
      .remove(tokenIds);
  }
}
