import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { SkillService } from "./skill.service";
import { Skill } from "@dewo/api/models/Skill";
import GraphQLUUID from "graphql-type-uuid";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Workspace } from "@dewo/api/models/Workspace";
import { SkillStatistic } from "./dto/SkillStatistic";

@Injectable()
export class SkillResolver {
  constructor(private readonly service: SkillService) {}

  @Query(() => [Skill])
  public async getSkills(): Promise<Skill[]> {
    return this.service.findTopLevelSkills();
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  public async setUserSkills(
    @Context("user") user: User,
    @Args("skillIds", { type: () => [GraphQLUUID] }) skillIds: string[]
  ): Promise<User> {
    return this.service.setUserSkills(user.id, skillIds);
  }
}

@Resolver(() => Workspace)
@Injectable()
export class WorkspaceSkillResolver {
  constructor(private readonly service: SkillService) {}

  @ResolveField(() => [SkillStatistic])
  public async skills(
    @Parent() workspace: Workspace
  ): Promise<SkillStatistic[]> {
    return this.service.getSkillStatistics(workspace.id);
  }
}
