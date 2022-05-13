import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Project } from "@dewo/api/models/Project";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { CreateProjectIntegrationInput } from "./dto/CreateProjectIntegrationInput";
import { User } from "@dewo/api/models/User";
import { IntegrationService } from "../integrations/integration.service";
import { UpdateProjectIntegrationInput } from "./dto/UpdateProjectIntegrationInput";
import { RoleGuard } from "../rbac/rbac.guard";
import { ProjectService } from "../project/project.service";
import { Organization } from "@dewo/api/models/Organization";
import { CreateOrganizationIntegrationInput } from "./dto/CreateOrganizationIntegrationInput";
import { OrganizationIntegration } from "@dewo/api/models/OrganizationIntegration";
import { DeleteOrganizationIntegrationInput } from "./dto/DeleteOrganizationIntegrationInput";
import { OrganizationService } from "../organization/organization.service";

@Injectable()
@Resolver(() => Organization)
export class IntegrationResolver {
  constructor(
    private readonly service: IntegrationService,
    private readonly organizationService: OrganizationService
  ) {}

  @Mutation(() => OrganizationIntegration)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Organization,
      getOrganizationId: (
        _,
        params: { input: CreateOrganizationIntegrationInput }
      ) => params.input.organizationId,
    })
  )
  public async createOrganizationIntegration(
    @Args("input") input: CreateOrganizationIntegrationInput,
    @Context("user") user: User
  ): Promise<OrganizationIntegration> {
    return this.service.upsertOrganizationIntegration({
      ...input,
      creatorId: user.id,
    });
  }

  @Mutation(() => Organization)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: Organization,
      getOrganizationId: (
        _,
        params: { input: DeleteOrganizationIntegrationInput }
      ) => params.input.organizationId,
    })
  )
  public async deleteOrganizationIntegration(
    @Args("input") input: DeleteOrganizationIntegrationInput
  ): Promise<Organization> {
    await this.service.deleteOrganizationIntegration(input);

    const organization = await this.organizationService.findById(
      input.organizationId
    );

    if (!organization) throw new NotFoundException();

    return organization;
  }

  @Mutation(() => ProjectIntegration)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Project,
      inject: [ProjectService],
      getSubject: (
        params: { input: CreateProjectIntegrationInput },
        service: ProjectService
      ) => service.findById(params.input.projectId),
      getOrganizationId: (subject: Project) => subject.organizationId,
    })
  )
  public async createProjectIntegration(
    @Args("input") input: CreateProjectIntegrationInput,
    @Context("user") user: User
  ): Promise<ProjectIntegration> {
    return this.service.createProjectIntegration({
      ...input,
      creatorId: user.id,
    });
  }

  @Mutation(() => ProjectIntegration)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Project,
      inject: [IntegrationService],
      getSubject: async (
        params: { input: UpdateProjectIntegrationInput },
        service: IntegrationService
      ) => {
        const integration = await service.findProjectIntegrationById(
          params.input.id
        );
        return integration?.project;
      },
      getOrganizationId: (subject: Project) => subject.organizationId,
    })
  )
  public async updateProjectIntegration(
    @Args("input") input: UpdateProjectIntegrationInput
  ): Promise<ProjectIntegration> {
    return this.service.updateProjectIntegration(input);
  }
}
