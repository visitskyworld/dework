import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import {
  ProjectIntegration,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { AtLeast } from "@dewo/api/types/general";
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

  public async updateProjectIntegration(
    partial: AtLeast<ProjectIntegration, "id">
  ): Promise<ProjectIntegration> {
    const updated = await this.projectIntegrationRepo.save(partial);
    return this.projectIntegrationRepo.findOne(
      updated.id
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

  public async findOrganizationIntegration<
    T extends OrganizationIntegrationType
  >(
    organizationId: string,
    type: T
  ): Promise<OrganizationIntegration<T> | undefined> {
    return this.organizationIntegrationRepo.findOne({
      type,
      organizationId,
    }) as Promise<OrganizationIntegration<T>>;
  }

  public async findProjectIntegration<T extends ProjectIntegrationType>(
    projectId: string,
    type: T
  ): Promise<ProjectIntegration<T> | undefined> {
    return this.projectIntegrationRepo.findOne({
      type,
      projectId,
    }) as Promise<ProjectIntegration<T>>;
  }
}
