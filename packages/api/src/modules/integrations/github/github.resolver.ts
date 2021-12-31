import { Args, Query } from "@nestjs/graphql";
import { Injectable } from "@nestjs/common";
import GraphQLUUID from "graphql-type-uuid";
import { GithubService } from "./github.service";
import { GithubRepo } from "./dto/GithubRepo";

@Injectable()
export class GithubResolver {
  constructor(private readonly githubService: GithubService) {}

  // TODO(fant): do we want to make sure the requesting user is an org admin?
  @Query(() => [GithubRepo], { nullable: true })
  public async getGithubRepos(
    @Args("organizationId", { type: () => GraphQLUUID }) organizationId: string
  ): Promise<GithubRepo[]> {
    return this.githubService.getOrganizationRepos(organizationId);
  }
}
