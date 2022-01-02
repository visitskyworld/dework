import { Args, Context, Query, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { InviteService } from "./invite.service";
import { Invite } from "@dewo/api/models/Invite";
import { CreateOrganizationInviteInput } from "./dto/CreateOrganizationInviteInput";
import { OrganizationRolesGuard } from "../organization/organization.roles.guard";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { ProjectRolesGuard } from "../project/project.roles.guard";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { CreateProjectInviteInput } from "./dto/CreateProjectInviteInput";

@Injectable()
export class InviteResolver {
  constructor(private readonly inviteService: InviteService) {}

  @Mutation(() => Invite)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, OrganizationMember, [
    InviteService,
    async (_service: InviteService, { params }) => ({
      userId: "",
      role: params.input.role,
      organizationId: params.input.organizationId,
    }),
  ])
  public async createOrganizationInvite(
    @Context("user") user: User,
    @Args("input") input: CreateOrganizationInviteInput
  ): Promise<Invite> {
    return this.inviteService.create(
      { organizationId: input.organizationId, organizationRole: input.role },
      user
    );
  }

  @Mutation(() => Invite)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, ProjectMember, [
    InviteService,
    async (_service: InviteService, { params }) => ({
      userId: "",
      role: params.input.role,
      projectId: params.input.projectId,
    }),
  ])
  public async createProjectInvite(
    @Context("user") user: User,
    @Args("input") input: CreateProjectInviteInput
  ): Promise<Invite> {
    return this.inviteService.create(
      { projectId: input.projectId, projectRole: input.role },
      user
    );
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
