import { Args, Mutation, Query } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import { ProjectService } from "./project.service";
import { CreateProjectInput } from "./dto/CreateProjectInput";
import { Project } from "@dewo/api/models/Project";
import { OrganizationMemberGuard } from "../auth/guards/organizationMember.guard";
import { ProjectMemberGuard } from "../auth/guards/projectMember.guard";
import { CreateTaskTagInput } from "./dto/CreateTaskTagInput";
import { TaskTag } from "@dewo/api/models/TaskTag";
import { TaskStatus } from "@dewo/api/models/TaskStatus";
import { CreateTaskStatusInput } from "./dto/CreateTaskStatusInput";
import GraphQLUUID from "graphql-type-uuid";

@Injectable()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  @UseGuards(RequireGraphQLAuthGuard, OrganizationMemberGuard)
  public async createProject(
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return this.projectService.create(input);
  }

  @Mutation(() => TaskTag)
  @UseGuards(RequireGraphQLAuthGuard, ProjectMemberGuard)
  public async createTaskTag(
    @Args("input") input: CreateTaskTagInput
  ): Promise<TaskTag> {
    return this.projectService.createTag(input);
  }

  @Mutation(() => TaskStatus)
  @UseGuards(RequireGraphQLAuthGuard, ProjectMemberGuard)
  public async createTaskStatus(
    @Args("input") input: CreateTaskStatusInput
  ): Promise<TaskStatus> {
    return this.projectService.createStatus({
      sortKey: String(Date.now()),
      ...input,
    });
  }

  @Query(() => Project)
  public async getProject(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Project | undefined> {
    const project = await this.projectService.findById(id);
    if (!project) throw new NotFoundException();
    return project;
  }
}
