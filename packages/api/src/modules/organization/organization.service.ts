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
    await this.addUser(created, creator, OrganizationRole.OWNER);
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

  public async addUser(
    organization: Organization,
    user: User,
    role: OrganizationRole
  ): Promise<Organization> {
    await this.organizationMemberRepo.save({
      organizationId: organization.id,
      userId: user.id,
      role,
    });
    return this.findById(organization.id) as Promise<Organization>;
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
}
