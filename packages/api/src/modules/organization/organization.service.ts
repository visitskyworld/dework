import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { Organization } from "@dewo/api/models/Organization";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";
import { OrganizationTag } from "@dewo/api/models/OrganizationTag";
import { Project, ProjectVisibility } from "@dewo/api/models/Project";
import { ProjectRole } from "@dewo/api/models/ProjectMember";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { User } from "@dewo/api/models/User";
import { AtLeast, DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, Repository } from "typeorm";
import { Roles } from "../app/app.roles";
import { SetOrganizationDetailInput } from "./dto/SetOrganizationDetailInput";
import { UpdateOrganizationMemberInput } from "./dto/UpdateOrganizationMemberInput";

@Injectable()
export class OrganizationService {
  // private readonly logger = new Logger("UserService");

  constructor(
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
    private readonly entityDetailRepo: Repository<EntityDetail>
  ) {}

  public async create(
    partial: DeepPartial<Organization>,

    creator: User
  ): Promise<Organization> {
    const created = await this.organizationRepo.save(partial);
    await this.upsertMember({
      organizationId: created.id,
      userId: creator.id,
      role: OrganizationRole.OWNER,
    });
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

  public async upsertMember(
    data: UpdateOrganizationMemberInput
  ): Promise<OrganizationMember> {
    const member = await this.findMember({
      organizationId: data.organizationId,
      userId: data.userId,
    });
    if (!!member) {
      await this.organizationMemberRepo.update({ id: member.id }, data);
      return this.organizationMemberRepo.findOne({
        id: member.id,
      }) as Promise<OrganizationMember>;
    } else {
      const created = await this.organizationMemberRepo.save({
        sortKey: Date.now().toString(),
        role: OrganizationRole.FOLLOWER,
        ...data,
      });
      return this.organizationMemberRepo.findOne({
        id: created.id,
      }) as Promise<OrganizationMember>;
    }
  }

  public async removeMember(
    organizationId: string,
    userId: string
  ): Promise<void> {
    await this.organizationMemberRepo.delete({ userId, organizationId });
  }

  public getMembers(organizationId: string): Promise<OrganizationMember[]> {
    return this.organizationMemberRepo
      .createQueryBuilder("member")
      .leftJoinAndSelect("member.user", "user")
      .where("member.organizationId = :organizationId", {
        organizationId,
      })
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

  public getProjects(
    organizationId: string,
    userId: string | undefined,
    caslRoles: Roles[]
  ): Promise<Project[]> {
    return this.projectRepo
      .createQueryBuilder("project")
      .leftJoin("project.members", "pm", "pm.userId = :userId", { userId })
      .innerJoin("project.organization", "organization")
      .leftJoin("organization.members", "om", "om.userId = :userId", { userId })
      .where("project.deletedAt IS NULL")
      .andWhere("project.organizationId = :organizationId", { organizationId })
      .andWhere(
        new Brackets((qb) => {
          qb.where("project.visibility = :public", {
            public: ProjectVisibility.PUBLIC,
          })
            .orWhere("om.role IN (:...orgRoles)", {
              orgRoles: [OrganizationRole.OWNER, OrganizationRole.ADMIN],
            })
            .orWhere("pm.role IN (:...projectRoles)", {
              projectRoles: [ProjectRole.ADMIN, ProjectRole.CONTRIBUTOR],
            });

          if (!!caslRoles.length) {
            qb.orWhere(":superadmin IN (:...caslRoles)", {
              superadmin: Roles.superadmin,
              caslRoles,
            });
          }
        })
      )
      .getMany();
  }

  public async findByUser(userId: string): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoinAndSelect("organization.members", "member")
      .where("member.userId = :userId", { userId })
      .andWhere("organization.deletedAt IS NULL")
      .orderBy("member.sortKey", "DESC")
      .getMany();
  }

  public findFeatured(limit: number): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .where("organization.featured = :featured", { featured: true })
      .leftJoinAndSelect("organization.projects", "project")
      .leftJoinAndSelect("project.members", "member")
      .leftJoinAndSelect("member.user", "user")
      .limit(limit)
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
