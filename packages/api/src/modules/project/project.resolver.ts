import { Args, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import { ProjectService } from "./project.service";
import { CreateProjectInput } from "./dto/CreateProjectInput";
import { Project } from "@dewo/api/models/Project";
import { OrganizationMemberGuard } from "../auth/guards/organizationMember.guard";

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
}
