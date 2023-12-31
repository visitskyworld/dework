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
import { EventBus } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { DeleteOrganizationIntegrationInput } from "./dto/DeleteOrganizationIntegrationInput";
import {
  ProjectIntegrationCreatedEvent,
  ProjectIntegrationUpdatedEvent,
} from "./integration.events";

@Injectable()
export class IntegrationService {
  constructor(
    private readonly eventBus: EventBus,
    @InjectRepository(ProjectIntegration)
    private readonly projectIntegrationRepo: Repository<ProjectIntegration>,
    @InjectRepository(OrganizationIntegration)
    private readonly organizationIntegrationRepo: Repository<OrganizationIntegration>
  ) {}

  public async createProjectIntegration(
    partial: Partial<ProjectIntegration>
  ): Promise<ProjectIntegration> {
    const created = await this.projectIntegrationRepo.save(partial);
    const refetched = (await this.projectIntegrationRepo.findOne(
      created.id
    )) as ProjectIntegration;
    this.eventBus.publish(new ProjectIntegrationCreatedEvent(refetched));
    return refetched;
  }

  public async updateProjectIntegration(
    partial: AtLeast<ProjectIntegration, "id">
  ): Promise<ProjectIntegration> {
    const updated = await this.projectIntegrationRepo.save(partial);
    const refetched = (await this.projectIntegrationRepo.findOne(
      updated.id
    )) as ProjectIntegration;
    this.eventBus.publish(new ProjectIntegrationUpdatedEvent(refetched));
    return refetched;
  }

  public async upsertOrganizationIntegration(
    partial: Partial<OrganizationIntegration>
  ): Promise<OrganizationIntegration> {
    const orgIntegration = await this.organizationIntegrationRepo.upsert(
      partial,
      { conflictPaths: ["organizationId", "type"] }
    );
    return this.organizationIntegrationRepo.findOne(
      orgIntegration.identifiers[0]?.id
    ) as Promise<OrganizationIntegration>;
  }

  public async deleteOrganizationIntegration(
    input: DeleteOrganizationIntegrationInput
  ) {
    const { organizationId, type } = input;

    await this.organizationIntegrationRepo.delete({
      organizationId,
      type,
    });
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
      deletedAt: IsNull(),
    }) as Promise<ProjectIntegration<T>>;
  }

  public async findProjectIntegrations<T extends ProjectIntegrationType>(
    projectId: string,
    type: T
  ): Promise<ProjectIntegration<T>[]> {
    return this.projectIntegrationRepo.find({
      type,
      projectId,
      deletedAt: IsNull(),
    }) as Promise<ProjectIntegration<T>[]>;
  }

  public async findOrganizationIntegrationById(
    id: string
  ): Promise<OrganizationIntegration | undefined> {
    return this.organizationIntegrationRepo.findOne(id);
  }

  public async findProjectIntegrationById(
    id: string
  ): Promise<ProjectIntegration | undefined> {
    return this.projectIntegrationRepo.findOne(id);
  }
}
