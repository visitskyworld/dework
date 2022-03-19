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
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { PermalinkService } from "../permalink/permalink.service";
import { IntegrationService } from "../integrations/integration.service";
import { UpdateProjectIntegrationInput } from "./dto/UpdateProjectIntegrationInput";
import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { ProjectTokenGateInput } from "./dto/ProjectTokenGateInput";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { CreateProjectSectionInput } from "./dto/CreateProjectSectionInput";
import { UpdateProjectSectionInput } from "./dto/UpdateProjectSectionInput";
import { UpdateTaskTagInput } from "./dto/UpdateTaskTagInput";
import { TaskSection } from "@dewo/api/models/TaskSection";
import { RoleGuard } from "../rbac/rbac.guard";
import _ from "lodash";
import { RbacService } from "../rbac/rbac.service";
import { RulePermission } from "@dewo/api/models/rbac/Rule";

@Resolver(() => Project)
@Injectable()
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly permalinkService: PermalinkService,
    private readonly integrationService: IntegrationService,
    private readonly rbacService: RbacService
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

  @ResolveField(() => [TaskSection])
  public async taskSections(
    @Parent() project: Project
  ): Promise<TaskSection[]> {
    // TODO(fant): query and filter by deletedAt directly
    const sections = await project.taskSections;
    return sections.filter((s) => !s.deletedAt);
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
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Project,
      async getOrganizationId(_subject, params: { input: CreateProjectInput }) {
        return params.input.organizationId;
      },
    })
  )
  public async createProject(
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return this.projectService.create(input);
  }

  @Mutation(() => Project)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Project,
      inject: [ProjectService],
      getFields: (params: { input: UpdateProjectInput }) =>
        Object.keys(_.omit(params.input, ["id"])),
      getSubject: (
        params: { input: UpdateProjectInput },
        service: ProjectService
      ) => service.findById(params.input.id),
      getOrganizationId: (subject: Project) => subject.organizationId,
    })
  )
  public async updateProject(
    @Args("input") input: UpdateProjectInput
  ): Promise<Project> {
    return this.projectService.update(input);
  }

  @Mutation(() => ProjectSection)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: ProjectSection,
      inject: [ProjectService],
      getOrganizationId: (
        _subject,
        params: { input: CreateProjectSectionInput }
      ) => params.input.organizationId,
    })
  )
  public async createProjectSection(
    @Args("input") input: CreateProjectSectionInput
  ): Promise<ProjectSection> {
    return this.projectService.createSection(input);
  }

  @Mutation(() => ProjectSection)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: ProjectSection,
      inject: [ProjectService],
      getOrganizationId: (
        _subject,
        params: { input: UpdateProjectSectionInput }
      ) => params.input.organizationId,
    })
  )
  public async updateProjectSection(
    @Args("input") input: UpdateProjectSectionInput
  ): Promise<ProjectSection> {
    return this.projectService.updateSection(input);
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard)
  public async joinProjectWithToken(
    @Context("user") user: User,
    @Args("projectId", { type: () => GraphQLUUID }) projectId: string
  ): Promise<Project> {
    const project = await this.projectService.findById(projectId);
    if (!project) throw new NotFoundException();

    const tokenGates = await project.tokenGates;
    if (!tokenGates.length) return project;
    const adminGates = tokenGates.filter((g) => g.role === ProjectRole.ADMIN);
    const contributorGates = tokenGates.filter(
      (g) => g.role === ProjectRole.CONTRIBUTOR
    );

    const fallbackRole = await this.rbacService.getFallbackRole(
      project.organizationId
    );
    if (!!fallbackRole) {
      await this.rbacService.addRole(user.id, fallbackRole.id);
    }

    const personalRole = await this.rbacService.getOrCreatePersonalRole(
      user.id,
      project.organizationId
    );
    if (!!adminGates.length) {
      const passes = await this.projectService
        .assertUserPassesTokenGates(project, user, ProjectRole.CONTRIBUTOR)
        .then(() => true)
        .catch(() => false);
      if (passes) {
        await this.rbacService.createRules(
          [RulePermission.MANAGE_PROJECTS, RulePermission.VIEW_PROJECTS].map(
            (permission) => ({
              roleId: personalRole.id,
              permission,
              projectId: project.id,
            })
          )
        );
        return project;
      }
    }

    if (!!contributorGates.length) {
      const passes = await this.projectService
        .assertUserPassesTokenGates(project, user, ProjectRole.CONTRIBUTOR)
        .then(() => true)
        .catch(() => false);
      if (passes) {
        await this.rbacService.createRules(
          [RulePermission.VIEW_PROJECTS].map((permission) => ({
            roleId: personalRole.id,
            permission,
            projectId: project.id,
          }))
        );
        return project;
      }
    }

    throw new ForbiddenException();
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
    return this.integrationService.createProjectIntegration({
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
    return this.integrationService.updateProjectIntegration(input);
  }

  @Mutation(() => TaskTag)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: TaskTag,
      inject: [ProjectService],
      getOrganizationId: async (
        _subject,
        params: { input: CreateTaskTagInput },
        service
      ) => {
        const project = await service.findById(params.input.projectId);
        return project?.organizationId;
      },
    })
  )
  public async createTaskTag(
    @Args("input") input: CreateTaskTagInput
  ): Promise<TaskTag> {
    return this.projectService.createTag(input);
  }

  @Mutation(() => TaskTag)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: TaskTag,
      inject: [ProjectService],
      getOrganizationId: async (
        _subject,
        params: { input: UpdateTaskTagInput },
        service
      ) => {
        const project = await service.findById(params.input.projectId);
        return project?.organizationId;
      },
    })
  )
  public async updateTaskTag(
    @Args("input") input: UpdateTaskTagInput
  ): Promise<TaskTag> {
    return this.projectService.updateTag(input);
  }

  @Mutation(() => ProjectTokenGate)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Project,
      inject: [ProjectService],
      getSubject: async (
        params: { input: ProjectTokenGateInput },
        service: ProjectService
      ) => service.findById(params.input.projectId),
      getOrganizationId: (subject: Project) => subject.organizationId,
    })
  )
  public async createProjectTokenGate(
    @Args("input") input: ProjectTokenGateInput
  ): Promise<ProjectTokenGate> {
    return this.projectService.createTokenGate(input);
  }

  @Mutation(() => Project)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Project,
      inject: [ProjectService],
      getSubject: async (
        params: { input: ProjectTokenGateInput },
        service: ProjectService
      ) => service.findById(params.input.projectId),
      getOrganizationId: (subject: Project) => subject.organizationId,
    })
  )
  public async deleteProjectTokenGate(
    @Args("input") input: ProjectTokenGateInput
  ): Promise<Project> {
    await this.projectService.deleteTokenGate(input);
    return this.projectService.findById(input.projectId) as Promise<Project>;
  }

  @Query(() => Project)
  @UseGuards(
    RoleGuard({
      action: "read",
      subject: Project,
      inject: [ProjectService],
      getSubject: (params: { id: string }, service: ProjectService) =>
        service.findById(params.id),
      getOrganizationId: (subject) => subject.organizationId,
    })
  )
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
