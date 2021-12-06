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
import { Task } from "@dewo/api/models/Task";
import { TaskService } from "../task/task.service";

@Resolver(() => User)
@Injectable()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() user: User): Promise<Task[]> {
    return this.taskService.findWithRelations({ assigneeId: user.id });
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  public me(@Context("user") user: User): User {
    return user;
  }

  @Mutation(() => AuthResponse)
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
  @UseGuards(AuthGuard)
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
