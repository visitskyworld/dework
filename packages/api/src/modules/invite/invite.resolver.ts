import { Args, Context, Query, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { InviteService } from "./invite.service";
import { Invite } from "@dewo/api/models/Invite";
import { CreateInviteInput } from "./dto/CreateInviteInput";
import { OrganizationRolesGuard } from "../organization/organization.roles.guard";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";

@Injectable()
export class InviteResolver {
  constructor(private readonly inviteService: InviteService) {}

  @Mutation(() => Invite)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  // TODO(fant): disable people from creating invites for OWNER role
  @UseAbility(Actions.create, OrganizationMember)
  public async createInvite(
    @Context("user") user: User,
    @Args("input") input: CreateInviteInput
  ): Promise<Invite> {
    return this.inviteService.create(input, user);
  }

  @Mutation(() => Invite)
  @UseGuards(AuthGuard)
  public async acceptInvite(
    @Context("user") user: User,
    @Args("id", { type: () => GraphQLUUID }) inviteId: string
  ): Promise<Invite> {
    return this.inviteService.accept(inviteId, user);
  }

  @Query(() => Invite, { nullable: true })
  public async getInvite(
    @Args("id", { type: () => GraphQLUUID }) inviteId: string
  ): Promise<Invite | undefined> {
    return this.inviteService.findById(inviteId);
  }
}
