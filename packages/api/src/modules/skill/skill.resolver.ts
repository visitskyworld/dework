import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { SkillService } from "./skill.service";
import { Skill } from "@dewo/api/models/Skill";
import GraphQLUUID from "graphql-type-uuid";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";

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
