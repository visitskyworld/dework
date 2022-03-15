import { Args, Context, Query, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RbacService } from "./rbac.service";
import { CreateRoleInput } from "./dto/CreateRoleInput";
import { Role } from "@dewo/api/models/rbac/Role";
import { RoleGuard } from "./rbac.guard";
import { Rule } from "@dewo/api/models/rbac/Rule";
import { CreateRuleInput } from "./dto/CreateRuleInput";
import GraphQLUUID from "graphql-type-uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@dewo/api/models/User";
import { Repository } from "typeorm";
import { GraphQLJSONObject } from "graphql-type-json";
import _ from "lodash";

@Injectable()
export class RbacResolver {
  constructor(
    private readonly service: RbacService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  @Mutation(() => Role)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Role,
      async getOrganizationId(_subject, params: { input: CreateRoleInput }) {
        return params.input.organizationId;
      },
    })
  )
  public async createRole(
    @Args("input") input: CreateRoleInput
  ): Promise<Role> {
    return this.service.createRole(input);
  }

  @Mutation(() => Rule)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Rule,
      inject: [RbacService],
      async getOrganizationId(
        _subject,
        params: { input: CreateRuleInput },
        service
      ) {
        const role = await service.findRoleById(params.input.roleId);
        return role?.organizationId;
      },
    })
  )
  public async createRule(
    @Args("input") input: CreateRuleInput
  ): Promise<Rule> {
    const rule = await this.service.createRule(input);
    return rule;
  }

  @Mutation(() => Role)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: Rule,
      inject: [RbacService],
      getSubject: (params: { id: string }, service) =>
        service.findRuleById(params.id),
      async getOrganizationId(subject) {
        const role = await subject.role;
        return role?.organizationId;
      },
    })
  )
  public async deleteRule(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Role> {
    const rule = await this.service.findRuleById(id);
    const role = await rule!.role;
    await this.service.deleteRule(id);
    return role;
  }

  @Mutation(() => User)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "delete",
      subject: "UserRole",
      inject: [RbacService],
      async getOrganizationId(
        _subject,
        params: { userId: string; roleId: string },
        service: RbacService
      ) {
        const role = await service.findRoleById(params.roleId);
        return role?.organizationId;
      },
    })
  )
  public async addRole(
    @Args("userId", { type: () => GraphQLUUID }) userId: string,
    @Args("roleId", { type: () => GraphQLUUID }) roleId: string
  ): Promise<User> {
    await this.service.addRole(userId, roleId);
    return this.userRepo.findOneOrFail(userId);
  }

  @Query(() => [GraphQLJSONObject])
  public async getPermissions(
    @Context("user") user: User,
    @Args("unauthed", { nullable: true }) unauthed: boolean,
    @Args("organizationId", { type: () => GraphQLUUID })
    organizationId: string
  ): Promise<unknown[]> {
    const ability = await this.service.abilityForUser(
      unauthed ? undefined : user?.id,
      organizationId
    );
    return ability.rules.map((rule) => {
      if (_.isObject(rule.subject)) {
        return { ...rule, subject: (rule.subject as any).name };
      }
      return rule;
    });
  }
}
