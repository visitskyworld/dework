import { Organization } from "@dewo/api/models/Organization";
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
    private readonly organizationRepo: Repository<Organization>
  ) {}

  public async create(
    partial: DeepPartial<Organization>
  ): Promise<Organization> {
    const created = await this.organizationRepo.save(partial);
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
    user: User
  ): Promise<Organization> {
    await this.organizationRepo
      .createQueryBuilder()
      .relation(Organization, "users")
      .of(organization)
      .add(user);
    return this.findById(organization.id) as Promise<Organization>;
  }

  public async getUsers(organizationId: string): Promise<User[]> {
    return this.organizationRepo
      .createQueryBuilder("organization")
      .relation(Organization, "users")
      .of(organizationId)
      .loadMany();
  }
}
