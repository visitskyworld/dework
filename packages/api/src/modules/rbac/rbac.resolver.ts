import { Args, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RbacService } from "./rbac.service";
import { CreateRoleInput } from "./dto/CreateRoleInput";
import { Role } from "@dewo/api/models/rbac/Role";
import { createRoleGuard } from "./rbac.guard";
import { Rule } from "@dewo/api/models/rbac/Rule";
import { CreateRuleInput } from "./dto/CreateRuleInput";

@Injectable()
export class RbacResolver {
  constructor(private readonly service: RbacService) {}

  @Mutation(() => Role)
  @UseGuards(
    AuthGuard,
    createRoleGuard({
      action: "create",
      subject: Role,
      getOrganizationId: async (params: { input: CreateRoleInput }) =>
        params.input.organizationId,
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
    createRoleGuard({
      action: "create",
      subject: Rule,
      inject: [RbacService],
      async getOrganizationId(
        service: RbacService,
        params: { input: CreateRuleInput }
      ) {
        const role = await service.findRoleById(params.input.roleId);
        return role?.organizationId;
      },
    })
  )
  public async createRule(
    @Args("input") input: CreateRuleInput
  ): Promise<Rule> {
    return this.service.createRule(input);
  }
}
