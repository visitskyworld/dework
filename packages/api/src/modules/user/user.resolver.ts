import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { GraphQLAuthGuard } from "../auth/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { UserService } from "./user.service";

@Injectable()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GraphQLAuthGuard)
  public me(@Context("user") user: User): User {
    return user;
  }

  @Mutation(() => User)
  public createUser(
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<User> {
    return this.userService.createFromThreepid(threepidId);
  }
}
