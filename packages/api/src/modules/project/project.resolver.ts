import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
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
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";
import { UpdateProjectMemberInput } from "./dto/UpdateProjectMemberInput";
import { RemoveProjectMemberInput } from "./dto/RemoveProjectMemberInput";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { ProjectTokenGateInput } from "./dto/ProjectTokenGateInput";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { CreateProjectSectionInput } from "./dto/CreateProjectSectionInput";
import { UpdateProjectSectionInput } from "./dto/UpdateProjectSectionInput";
import { UpdateTaskTagInput } from "./dto/UpdateTaskTagInput";

@Resolver(() => Project)
@Injectable()
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly permalinkService: PermalinkService,
    private readonly integrationService: IntegrationService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() project: Project
  ): Promise<string> {
    return this.permalinkService.get(project, origin);
  }

  @ResolveField(() => [PaymentMethod])
  public async paymentMethods(
    @Parent() project: Project
  ): Promise<PaymentMethod[]> {
    // TODO(fant): query and filter by deletedAt directly
    const pms = await project.paymentMethods;
    return pms.filter((p) => !p.deletedAt);
  }

  @ResolveField(() => [TaskTag])
  public async taskTags(@Parent() project: Project): Promise<TaskTag[]> {
    // TODO(fant): query and filter by deletedAt directly
    const tags = await project.taskTags;
    return tags.filter((t) => !t.deletedAt);
  }

  @ResolveField(() => [ProjectIntegration])
  public async integrations(
    @Parent() project: Project
  ): Promise<ProjectIntegration[]> {
    // TODO(fant): query and filter by deletedAt directly
    const integrations = await project.integrations;
    return integrations.filter((i) => !i.deletedAt);
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Project)
  public async createProject(
    @Context("user") user: User,
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return this.projectService.create(input, user.id);
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

  @Mutation(() => ProjectMember)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.manage, ProjectMember, [
    ProjectService,
    async (_service: ProjectService, { params }) => ({
      role: params.input.role,
      userId: params.input.userId,
      projectId: params.input.projectId,
    }),
  ])
  public async updateProjectMember(
    @Args("input") input: UpdateProjectMemberInput
  ): Promise<ProjectMember> {
    return this.projectService.upsertMember(input);
  }

  @Mutation(() => ProjectSection)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, ProjectSection)
  public async createProjectSection(
    @Args("input") input: CreateProjectSectionInput
  ): Promise<ProjectSection> {
    return this.projectService.createSection(input);
  }

  @Mutation(() => ProjectSection)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.update, ProjectSection)
  public async updateProjectSection(
    @Args("input") input: UpdateProjectSectionInput
  ): Promise<ProjectSection> {
    return this.projectService.updateSection(input);
  }

  @Mutation(() => ProjectMember)
  @UseGuards(AuthGuard)
  public async joinProjectWithToken(
    @Context("user") user: User,
    @Args("projectId", { type: () => GraphQLUUID }) projectId: string
  ): Promise<ProjectMember> {
    const project = await this.projectService.findById(projectId);
    if (!project) throw new NotFoundException();
    const tokenGates = await project.tokenGates;
    if (!tokenGates.length) throw new ForbiddenException();
    return this.projectService.upsertMember({
      projectId,
      userId: user.id,
      role: ProjectRole.CONTRIBUTOR,
    });
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.delete, ProjectMember, [
    ProjectService,
    (service: ProjectService, { params }) =>
      service.findMember({
        userId: params.input.userId,
        projectId: params.input.projectId,
      }),
  ])
  public async removeProjectMember(
    @Args("input") input: RemoveProjectMemberInput
  ): Promise<Project> {
    await this.projectService.removeMember(input.projectId, input.userId);
    return this.projectService.findById(input.projectId) as Promise<Project>;
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
  @UseAbility(Actions.create, TaskTag)
  public async createTaskTag(
    @Args("input") input: CreateTaskTagInput
  ): Promise<TaskTag> {
    return this.projectService.createTag(input);
  }

  @Mutation(() => TaskTag)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.update, TaskTag)
  public async updateTaskTag(
    @Args("input") input: UpdateTaskTagInput
  ): Promise<TaskTag> {
    return this.projectService.updateTag(input);
  }

  @Mutation(() => ProjectTokenGate)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, ProjectTokenGate)
  public async createProjectTokenGate(
    @Args("input") input: ProjectTokenGateInput
  ): Promise<ProjectTokenGate> {
    return this.projectService.createTokenGate(input);
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.delete, ProjectTokenGate)
  public async deleteProjectTokenGate(
    @Args("input") input: ProjectTokenGateInput
  ): Promise<Project> {
    await this.projectService.deleteTokenGate(input);
    return this.projectService.findById(input.projectId) as Promise<Project>;
  }

  @Query(() => Project)
  @UseGuards(ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.read, Project, [
    ProjectService,
    (service: ProjectService, { params }) => service.findById(params.id),
  ])
  public async getProject(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Project> {
    const project = await this.projectService.findById(id);
    if (!project) throw new NotFoundException();
    return project;
  }

  @Query(() => [Project])
  public async getFeaturedProjects(): Promise<Project[]> {
    return this.projectService.findFeatured();
  }
}
