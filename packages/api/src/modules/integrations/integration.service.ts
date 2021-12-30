import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    @InjectRepository(OrganizationIntegration)
    private readonly organizationIntegrationRepo: Repository<OrganizationIntegration>
  ) {}

  public async createProjectIntegration(
    partial: Partial<ProjectIntegration>
  ): Promise<ProjectIntegration> {
    const created = await this.projectIntegrationRepo.save(partial);
    return this.projectIntegrationRepo.findOne(
      created.id
    ) as Promise<ProjectIntegration>;
  }

  public async createOrganizationIntegration(
    partial: Partial<OrganizationIntegration>
  ): Promise<OrganizationIntegration> {
    const created = await this.organizationIntegrationRepo.save(partial);
    return this.organizationIntegrationRepo.findOne(
      created.id
    ) as Promise<OrganizationIntegration>;
  }
}
