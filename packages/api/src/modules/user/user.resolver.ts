import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import _ from "lodash";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { UserService } from "./user.service";
import { AuthResponse } from "./dto/AuthResponse";
import { UpdateUserInput } from "./dto/UpdateUserInput";
import { Task } from "@dewo/api/models/Task";
import { TaskService } from "../task/task.service";
import { AbilityFactory } from "nest-casl/dist/factories/ability.factory";
import { GraphQLJSONObject } from "graphql-type-json";
import { AuthorizableUser } from "nest-casl";
import { GetUserPermissionsInput } from "./dto/GetUserPermissionsInput";
import { OrganizationRolesGuard } from "../organization/organization.roles.guard";
import { ProjectRolesGuard } from "../project/project.roles.guard";
import { TaskRolesGuard } from "../task/task.roles.guard";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationService } from "../organization/organization.service";
import { SetUserDetailInput } from "./dto/SetUserDetail";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";

@Resolver(() => User)
@Injectable()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly organizationService: OrganizationService,
    private readonly abilityFactory: AbilityFactory
  ) {}

  @ResolveField(() => [Task])
  public async tasks(@Parent() user: User): Promise<Task[]> {
    return this.taskService.findWithRelations({ assigneeId: user.id });
  }

  @ResolveField(() => [Organization])
  public async organizations(@Parent() user: User): Promise<Organization[]> {
    return this.organizationService.findByUser(user.id);
  }

  @ResolveField(() => [PaymentMethod])
  public async paymentMethods(@Parent() user: User): Promise<PaymentMethod[]> {
    // TODO(fant): query project PMs and filter by deletedAt directly
    const pms = await user.paymentMethods;
    return pms.filter((p) => !p.deletedAt);
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

  @ResolveField(() => [GraphQLJSONObject])
  @UseGuards(OrganizationRolesGuard, ProjectRolesGuard, TaskRolesGuard)
  public async permissions(
    @Parent() user: User,
    @Context("caslUser") caslUser: AuthorizableUser,
    @Args("input", { type: () => GetUserPermissionsInput, nullable: true })
    _input: GetUserPermissionsInput | undefined
  ): Promise<unknown[]> {
    if (user.id !== caslUser.id) {
      throw new Error("Cannot get permissions for other users");
    }

    const abilities = this.abilityFactory.createForUser(caslUser);
    return abilities.rules.map((rule) => {
      if (_.isObject(rule.subject)) {
        return { ...rule, subject: (rule.subject as any).name };
      }
      return rule;
    });
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
