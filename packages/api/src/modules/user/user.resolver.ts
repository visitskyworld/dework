import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import {
  GraphQLAuthGuard,
  RequireGraphQLAuthGuard,
} from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { UserService } from "./user.service";
import { AuthResponse } from "./dto/AuthResponse";
import { UpdateUserInput } from "./dto/UpdateUserInput";

@Injectable()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(RequireGraphQLAuthGuard)
  public me(@Context("user") user: User): User {
    return user;
  }

  @Mutation(() => AuthResponse)
  @UseGuards(GraphQLAuthGuard)
  public async authWithThreepid(
    @Context("user") user: User | undefined,
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<AuthResponse> {
    const updatedUser = await this.userService.authWithThreepid(
      threepidId,
      user
    );
    return {
      user: updatedUser,
      authToken: this.userService.createAuthToken(updatedUser),
    };
  }

  @Mutation(() => User)
  @UseGuards(RequireGraphQLAuthGuard)
  public async updateUser(
    @Context("user") user: User,
    @Args("input") input: UpdateUserInput
  ): Promise<User> {
    return this.userService.update({ id: user.id, ...input });
  }

  @Query(() => User)
  public async getUser(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }
}
