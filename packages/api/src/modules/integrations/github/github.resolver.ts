import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { GithubRepo } from "./dto/GithubRepo";
import { Project } from "@dewo/api/models/Project";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { User } from "@dewo/api/models/User";
import { GithubIntegrationService } from "./github.integration.service";
import { ProjectService } from "../../project/project.service";
import { Organization } from "@dewo/api/models/Organization";
import { CreateProjectsFromGithubInput } from "./dto/CreateProjectsFromGithubInput";
import { OrganizationService } from "../../organization/organization.service";
import { RoleGuard } from "../../rbac/rbac.guard";
import { GithubLabel } from "./dto/GithubLabel";

@Injectable()
export class GithubResolver {
  constructor(
    private readonly githubIntegrationService: GithubIntegrationService,
    private readonly projectService: ProjectService,
    private readonly organizationService: OrganizationService
  ) {}

  // TODO(fant): do we want to make sure the requesting user is an org admin?
  @Query(() => [GithubRepo])
  public async getGithubRepos(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<GithubRepo[]> {
    return this.githubIntegrationService.getOrganizationRepos(organizationId);
  }

  @Query(() => [GithubLabel])
  public async getGithubLabels(
    @Args("repo") repo: string,
    @Args("organization") organization: string,
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<GithubLabel[]> {
    return this.githubIntegrationService.getRepoLabels(
      repo,
      organization,
      organizationId
    );
  }

  @Mutation(() => Project)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Project,
      inject: [ProjectService],
      getSubject: (params: { projectId: string }, service: ProjectService) =>
        service.findById(params.projectId),
      getOrganizationId: (subject: Project) => subject.organizationId,
    })
  )
  public async createTasksFromGithubIssues(
    @Context("user") user: User,
    @Args("projectId", { type: () => GraphQLUUID }) projectId: string,
    @Args("organization", { nullable: true }) organization?: string,
    @Args("repo", { nullable: true }) repo?: string
  ): Promise<Project> {
    await this.githubIntegrationService.createTasksFromGithubIssues(
      projectId,
      user.id,
      !!organization && !!repo ? { organization, repo } : undefined
    );
    return this.projectService.findById(projectId) as Promise<Project>;
  }

  @Mutation(() => Organization)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Project,
      inject: [ProjectService],
      getOrganizationId: async (
        _subject: Project,
        params: { input: CreateProjectsFromGithubInput }
      ) => params.input.organizationId,
    })
  )
  public async createProjectsFromGithub(
    @Context("user") user: User,
    @Args("input") input: CreateProjectsFromGithubInput
  ): Promise<Organization> {
    await this.githubIntegrationService.createProjectsFromRepos(
      input.organizationId,
      user.id,
      input.repoIds
    );
    return this.organizationService.findById(
      input.organizationId
    ) as Promise<Organization>;
  }
}
