import {
  Args,
  Context,
  Query,
  Mutation,
  Resolver,
  ResolveField,
  Parent,
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
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";
import { ProjectInviteInput } from "./dto/ProjectInviteInput";
import { ProjectService } from "../project/project.service";
import { Project } from "@dewo/api/models/Project";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { Organization } from "@dewo/api/models/Organization";

@Injectable()
export class InviteResolver {
  constructor(
    private readonly inviteService: InviteService,
    private readonly projectService: ProjectService
  ) {}

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
        tokenId: input.tokenId,
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
      tokenId: input.tokenId,
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

@Injectable()
@Resolver(() => Project)
export class ProjectTokenGatedInvitesResolver {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>
  ) {}

  @ResolveField(() => Invite, { nullable: true })
  public async tokenGatedInvite(
    @Parent() project: Project
  ): Promise<Invite | undefined> {
    return this.inviteRepo.findOne({
      projectId: project.id,
      tokenId: Not(IsNull()),
      projectRole: ProjectRole.CONTRIBUTOR,
    });
  }
}

@Injectable()
@Resolver(() => Organization)
export class OrganizationTokenGatedInvitesResolver {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>
  ) {}

  @ResolveField(() => [Invite])
  public async tokenGatedInvites(
    @Parent() organization: Organization
  ): Promise<Invite[]> {
    return this.inviteRepo
      .createQueryBuilder("invite")
      .innerJoinAndSelect("invite.project", "project")
      .where("project.organizationId = :organizationId", {
        organizationId: organization.id,
      })
      .andWhere("invite.tokenId IS NOT NULL")
      .getMany();
  }
}
