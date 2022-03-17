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
import { ProjectInviteInput } from "./dto/ProjectInviteInput";
import { ProjectService } from "../project/project.service";
import { PermalinkService } from "../permalink/permalink.service";
import { RoleGuard } from "../rbac/rbac.guard";
import { Role } from "@dewo/api/models/rbac/Role";

@Resolver(() => Invite)
@Injectable()
export class InviteResolver {
  constructor(
    private readonly inviteService: InviteService,
    private readonly permalinkService: PermalinkService
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() invite: Invite
  ): Promise<string> {
    return this.permalinkService.get(invite, origin);
  }

  @Mutation(() => Invite)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Role,
      inject: [ProjectService],
      getOrganizationId: (
        _subject,
        params: { input: OrganizationInviteInput }
      ) => params.input.organizationId,
    })
  )
  public async createOrganizationInvite(
    @Context("user") user: User,
    @Args("input") input: OrganizationInviteInput
  ): Promise<Invite> {
    return this.inviteService.create(
      { organizationId: input.organizationId },
      user
    );
  }

  @Mutation(() => Invite)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "create",
      subject: Role,
      inject: [ProjectService],
      async getOrganizationId(
        _subject,
        params: { input: ProjectInviteInput },
        service
      ) {
        const project = await service.findById(params.input.projectId);
        return project?.organizationId;
      },
    })
  )
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
