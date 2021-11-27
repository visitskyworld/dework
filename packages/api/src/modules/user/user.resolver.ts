import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { GraphQLAuthGuard } from "../auth/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { UserService } from "./user.service";
import { ThreepidService } from "../threepid/threepid.service";
import { AuthResponse } from "./dto/AuthResponse";

@Injectable()
export class UserResolver {
  constructor(
    private readonly threepidService: ThreepidService,
    private readonly userService: UserService
  ) {}

  @Query(() => User)
  @UseGuards(GraphQLAuthGuard)
  public me(@Context("user") user: User): User {
    return user;
  }

  @Mutation(() => AuthResponse)
  public async authWithThreepid(
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<AuthResponse> {
    const user = await this.userService.authWithThreepid(threepidId);
    return { user, authToken: this.userService.createAuthToken(user) };
  }

  @Mutation(() => User)
  @UseGuards(GraphQLAuthGuard)
  public async connectUserToThreepid(
    @Context("user") user: User,
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<User> {
    const threepid = await this.threepidService.findById(threepidId);
    if (!threepid) throw new NotFoundException();
    await this.userService.connectThreepidToUser(threepid, user);
    return user;
  }
}
