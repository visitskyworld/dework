import { Organization } from "@dewo/api/models/Organization";
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

  public create(partial: DeepPartial<Organization>): Promise<Organization> {
    return this.organizationRepo.save(partial);
  }

  public findById(id: string): Promise<Organization | undefined> {
    return this.organizationRepo.findOne(id);
  }
}
