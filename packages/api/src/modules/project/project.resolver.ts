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
import { Task } from "@dewo/api/models/Task";
import { TaskService } from "../task/task.service";
import { ProjectIntegration } from "@dewo/api/models/ProjectIntegration";
import { CreateProjectIntegrationInput } from "./dto/CreateProjectIntegrationInput";
import { User } from "@dewo/api/models/User";
import { UpdateProjectInput } from "./dto/UpdateProjectInput";

@Resolver(() => Project)
@Injectable()
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() project: Project): Promise<Task[]> {
    return this.taskService.findWithRelations(project.id);
  }

  @Mutation(() => Project)
  @UseGuards(RequireGraphQLAuthGuard, OrganizationMemberGuard)
  public async createProject(
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return this.projectService.create(input);
  }

  @Mutation(() => Project)
  @UseGuards(RequireGraphQLAuthGuard, ProjectMemberGuard)
  public async updateProject(
    @Args("input") input: UpdateProjectInput
  ): Promise<Project> {
    return this.projectService.update(input);
  }

  @Mutation(() => ProjectIntegration)
  @UseGuards(RequireGraphQLAuthGuard, ProjectMemberGuard)
  public async createProjectIntegration(
    @Args("input") input: CreateProjectIntegrationInput,
    @Context("user") user: User
  ): Promise<ProjectIntegration> {
    return this.projectService.createIntegration({
      ...input,
      creatorId: user.id,
    });
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
  ): Promise<Project> {
    const project = await this.projectService.findById(id);
    if (!project) throw new NotFoundException();
    return project;
  }
}
