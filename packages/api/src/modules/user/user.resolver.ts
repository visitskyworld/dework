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
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { UserService } from "./user.service";
import { AuthResponse } from "./dto/AuthResponse";
import { UpdateUserInput } from "./dto/UpdateUserInput";
import { SetUserDetailInput } from "./dto/SetUserDetailInput";
import { PermalinkService } from "../permalink/permalink.service";
import { GQLContext } from "../app/graphql.config";
import { TaskView } from "@dewo/api/models/TaskView";

@Resolver(() => User)
@Injectable()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() user: User
  ): Promise<string> {
    return this.permalinkService.get(user, origin);
  }

  @ResolveField(() => [TaskView])
  public async taskViews(@Parent() user: User): Promise<TaskView[]> {
    const views = await user.taskViews;
    return views.filter((s) => !s.deletedAt);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  public async setUserDetail(
    @Args("input") input: SetUserDetailInput,
    @Context("user") user: User
  ): Promise<User> {
    await this.userService.setDetail(input, user.id);
    return this.userService.findById(user.id) as Promise<User>;
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  public me(@Context("user") user: User): User {
    return user;
  }

  @Mutation(() => AuthResponse)
  public async authWithThreepid(
    @Context() context: GQLContext,
    @Context("user") user: User | undefined,
    @Args("threepidId", { type: () => GraphQLUUID }) threepidId: string
  ): Promise<AuthResponse> {
    const updatedUser = await this.userService.authWithThreepid(
      threepidId,
      user
    );

    context.user = updatedUser;
    return {
      user: updatedUser,
      authToken: this.userService.createAuthToken(updatedUser),
    };
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  public async updateUser(
    @Context("user") user: User,
    @Args("input") input: UpdateUserInput
  ): Promise<User> {
    const username =
      input.username &&
      (await this.userService.generateUsername(input.username, user.id));
    return this.userService.update({
      id: user.id,
      ...input,
      ...(input.username ? { username } : {}),
    });
  }

  @Query(() => User)
  public async getUser(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Query(() => User)
  public async getUserByUsername(
    @Args("username") username: string
  ): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException();
    return user;
  }
}
