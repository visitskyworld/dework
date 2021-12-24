import { Organization } from "@dewo/api/models/Organization";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";
import { User } from "@dewo/api/models/User";
import { DeepAtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class OrganizationService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepo: Repository<OrganizationMember>
  ) {}

  public async create(
    partial: DeepPartial<Organization>,

    creator: User
  ): Promise<Organization> {
    const created = await this.organizationRepo.save(partial);
    await this.addUser(created.id, creator.id, OrganizationRole.OWNER);
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

  public findMember(
    partial: Partial<
      Pick<OrganizationMember, "organizationId" | "userId" | "role">
    >
  ): Promise<OrganizationMember | undefined> {
    return this.organizationMemberRepo.findOne(partial);
  }

  public async addUser(
    organizationId: string,
    userId: string,
    role: OrganizationRole
  ): Promise<Organization> {
    await this.organizationMemberRepo.save({
      role,
      userId,
      organizationId,
    });
    return this.findById(organizationId) as Promise<Organization>;
  }

  public async upsertMember(
    organizationId: string,
    userId: string,
    role: OrganizationRole
  ): Promise<OrganizationMember> {
    const member = await this.findMember({ organizationId, userId });
    if (!!member) {
      await this.organizationMemberRepo.update({ id: member.id }, { role });
      return this.organizationMemberRepo.findOne({
        id: member.id,
      }) as Promise<OrganizationMember>;
    } else {
      const created = await this.organizationMemberRepo.save({
        role,
        userId,
        organizationId,
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

  public async getMembers(
    organizationId: string
  ): Promise<OrganizationMember[]> {
    return this.organizationMemberRepo
      .createQueryBuilder("member")
      .leftJoinAndSelect("member.user", "user")
      .where("member.organizationId = :organizationId", {
        organizationId,
      })
      .getMany();
  }

  public async findByUser(userId: string): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .innerJoinAndSelect("organization.members", "members")
      .where("members.userId = :userId", { userId })
      .andWhere("organization.deletedAt IS NULL")
      .getMany();
  }

  public findFeatured(limit: number): Promise<Organization[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .where("organization.featured = :featured", { featured: true })
      .limit(limit)
      .getMany();
  }
}
