import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ProjectService } from "./project.service";
import { CreateProjectInput } from "./dto/CreateProjectInput";
import { Project } from "@dewo/api/models/Project";
import { CreateTaskTagInput } from "./dto/CreateTaskTagInput";
import { TaskTag } from "@dewo/api/models/TaskTag";
import GraphQLUUID from "graphql-type-uuid";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { CreateProjectIntegrationInput } from "./dto/CreateProjectIntegrationInput";
import { User } from "@dewo/api/models/User";
import { UpdateProjectInput } from "./dto/UpdateProjectInput";
import { OrganizationRolesGuard } from "../organization/organization.roles.guard";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { ProjectRolesGuard } from "./project.roles.guard";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { PermalinkService } from "../permalink/permalink.service";
import { IntegrationService } from "../integrations/integration.service";
import { UpdateProjectIntegrationInput } from "./dto/UpdateProjectIntegrationInput";

@Resolver(() => Project)
@Injectable()
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly permalinkService: PermalinkService,
    private readonly integrationService: IntegrationService
  ) {}

  @ResolveField(() => String)
  public permalink(@Parent() project: Project): Promise<string> {
    return this.permalinkService.get(project);
  }

  @ResolveField(() => [PaymentMethod])
  public async paymentMethods(
    @Parent() project: Project
  ): Promise<PaymentMethod[]> {
    // TODO(fant): query project PMs and filter by deletedAt directly
    const pms = await project.paymentMethods;
    return pms.filter((p) => !p.deletedAt);
  }

  @ResolveField(() => [ProjectIntegration])
  public async integrations(
    @Parent() project: Project
  ): Promise<ProjectIntegration[]> {
    // TODO(fant): query project PMs and filter by deletedAt directly
    const integrations = await project.integrations;
    return integrations.filter((i) => !i.deletedAt);
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Project)
  public async createProject(
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return this.projectService.create(input);
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.update, Project, [
    ProjectService,
    (service: ProjectService, { params }) => service.findById(params.input.id),
  ])
  public async updateProject(
    @Args("input") input: UpdateProjectInput
  ): Promise<Project> {
    return this.projectService.update(input);
  }

  @Mutation(() => ProjectIntegration)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, ProjectIntegration as any)
  public async createProjectIntegration(
    @Args("input") input: CreateProjectIntegrationInput,
    @Context("user") user: User
  ): Promise<ProjectIntegration> {
    return this.integrationService.createProjectIntegration({
      ...input,
      creatorId: user.id,
    });
  }

  @Mutation(() => ProjectIntegration)
  // TODO(fant): auth
  @UseGuards(AuthGuard)
  public async updateProjectIntegration(
    @Args("input") input: UpdateProjectIntegrationInput
  ): Promise<ProjectIntegration> {
    return this.integrationService.updateProjectIntegration(input);
  }

  @Mutation(() => TaskTag)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.update, Project, [
    ProjectService,
    (service: ProjectService, { params }) =>
      service.findById(params.input.projectId),
  ])
  public async createTaskTag(
    @Args("input") input: CreateTaskTagInput
  ): Promise<TaskTag> {
    return this.projectService.createTag(input);
  }

  @Query(() => Project)
  public async getProject(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Project> {
    const project = await this.projectService.findById(id);
    if (!project) throw new NotFoundException();
    return project;
  }
}
