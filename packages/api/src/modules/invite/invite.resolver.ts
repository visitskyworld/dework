import {
  Args,
  Context,
  Query,
  Mutation,
  ResolveField,
  Parent,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { AuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { InviteService } from "./invite.service";
import { Invite } from "@dewo/api/models/Invite";
import { OrganizationInviteInput } from "./dto/OrganizationInviteInput";
import { OrganizationRolesGuard } from "../organization/organization.roles.guard";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { ProjectRolesGuard } from "../project/project.roles.guard";
import { ProjectMember } from "@dewo/api/models/ProjectMember";
import { ProjectInviteInput } from "./dto/ProjectInviteInput";
import { ProjectService } from "../project/project.service";
import { Project } from "@dewo/api/models/Project";
import { PermalinkService } from "../permalink/permalink.service";

@Resolver(() => Invite)
@Injectable()
export class InviteResolver {
  constructor(
    private readonly inviteService: InviteService,
    private readonly permalinkService: PermalinkService,
    private readonly projectService: ProjectService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() invite: Invite
  ): Promise<string> {
    return this.permalinkService.get(invite, origin);
  }

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
    @Args("input") input: OrganizationInviteInput
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
    @Args("input") input: ProjectInviteInput
  ): Promise<Invite> {
    return this.inviteService.create(
      {
        projectId: input.projectId,
        projectRole: input.role,
      },
      user
    );
  }

  @Mutation(() => Project)
  @UseGuards(AuthGuard, ProjectRolesGuard, AccessGuard)
  @UseAbility(Actions.create, ProjectMember, [
    InviteService,
    async (_service: InviteService, { params }) => ({
      userId: "",
      role: params.input.role,
      projectId: params.input.projectId,
    }),
  ])
  public async deleteProjectInvite(
    @Args("input") input: ProjectInviteInput
  ): Promise<Project> {
    await this.inviteService.delete({
      projectId: input.projectId,
      projectRole: input.role,
    });
    return this.projectService.findById(input.projectId) as Promise<Project>;
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
