import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { GithubRepo } from "./dto/GithubRepo";
import { Project } from "@dewo/api/models/Project";
import { ProjectRolesGuard } from "../../project/project.roles.guard";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { GithubIntegrationService } from "./github.integration.service";
import { ProjectService } from "../../project/project.service";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationRolesGuard } from "../../organization/organization.roles.guard";
import { CreateProjectsFromGithubInput } from "./dto/CreateProjectsFromGithubInput";
import { OrganizationService } from "../../organization/organization.service";

@Injectable()
export class GithubResolver {
  constructor(
    private readonly githubIntegrationService: GithubIntegrationService,
    private readonly projectService: ProjectService,
    private readonly organizationService: OrganizationService
  ) {}

  // TODO(fant): do we want to make sure the requesting user is an org admin?
  @Query(() => [GithubRepo], { nullable: true })
  public async getGithubRepos(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<GithubRepo[]> {
    return this.githubIntegrationService.getOrganizationRepos(organizationId);
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Task)
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
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Project)
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
