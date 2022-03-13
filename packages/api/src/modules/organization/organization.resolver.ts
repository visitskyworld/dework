import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import _ from "lodash";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationService } from "./organization.service";
import { User } from "@dewo/api/models/User";
import { CreateOrganizationInput } from "./dto/CreateOrganizationInput";
import { AuthGuard } from "../auth/guards/auth.guard";
import { GraphQLInt } from "graphql";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateOrganizationInput } from "./dto/UpdateOrganizationInput";
import {
  AccessGuard,
  AccessService,
  Actions,
  AuthorizableUser,
  CaslUser,
  UseAbility,
  UserProxy,
} from "nest-casl";
import { OrganizationRolesGuard } from "./organization.roles.guard";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { OrganizationTag } from "@dewo/api/models/OrganizationTag";
import { CreateOrganizationTagInput } from "./dto/CreateOrganizationTagInput";
import { SetOrganizationDetailInput } from "./dto/SetOrganizationDetailInput";
import { UpdateOrganizationMemberInput } from "./dto/UpdateOrganizationMemberInput";
import { RemoveOrganizationMemberInput } from "./dto/RemoveOrganizationMemberInput";
import { Project } from "@dewo/api/models/Project";
import { PermalinkService } from "../permalink/permalink.service";
import { AbilityFactory } from "nest-casl/dist/factories/ability.factory";
import { subject } from "@casl/ability";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { ProjectSection } from "@dewo/api/models/ProjectSection";

@Resolver(() => Organization)
@Injectable()
export class OrganizationResolver {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly permalinkService: PermalinkService,
    private readonly accessService: AccessService,
    private readonly abilityFactory: AbilityFactory
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() organization: Organization
  ): Promise<string> {
    return this.permalinkService.get(organization, origin);
  }

  // needed?
  @ResolveField(() => [OrganizationMember])
  public async members(
    @Parent() organization: Organization
  ): Promise<OrganizationMember[]> {
    if (!!organization.members) return organization.members;
    return this.organizationService.getMembers(organization.id);
  }

  @ResolveField(() => [ProjectSection])
  public async projectSections(
    @Parent() organization: Organization
  ): Promise<ProjectSection[]> {
    const sections = await organization.projectSections;
    return sections.filter((s) => !s.deletedAt);
  }

  @ResolveField(() => OrganizationMember, { nullable: true })
  public async member(
    @Parent() organization: Organization,
    @Context("user") user: User | undefined
  ): Promise<OrganizationMember | undefined> {
    if (!user) return undefined;
    return this.organizationService.findMember({
      organizationId: organization.id,
      userId: user.id,
    });
  }

  @ResolveField(() => [Project])
  public async projects(
    @Context("user") user: User | undefined,
    @Parent() organization: Organization
  ): Promise<Project[]> {
    return this.organizationService.getProjects(organization.id, user?.id);
  }

  @ResolveField(() => [ProjectTokenGate])
  public async projectTokenGates(
    @Parent() organization: Organization
  ): Promise<ProjectTokenGate[]> {
    return this.organizationService.findProjectTokenGates(organization.id);
  }

  @ResolveField(() => [OrganizationTag])
  public async tags(
    @Parent() organization: Organization
  ): Promise<OrganizationTag[]> {
    if (!!organization.tags) {
      return _.sortBy(organization.tags, (t) => t.createdAt);
    }
    const refetched = await this.organizationService.findById(organization.id);
    return _.sortBy(refetched!.tags, (t) => t.createdAt);
  }

  // needed?
  @ResolveField(() => [OrganizationTag])
  public async allTags(
    @Parent() organization: Organization
  ): Promise<OrganizationTag[]> {
    if (!!organization.tags) return organization.tags;
    return this.organizationService.getAllTags(organization.id);
  }

  @Mutation(() => Organization)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.create, Organization)
  public async createOrganization(
    @Context("user") user: User,
    @Args("input") input: CreateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.create(input, user);
  }

  @Mutation(() => Organization)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.update, Organization, [
    OrganizationService,
    (service: OrganizationService, { params }) =>
      service.findById(params.input.id),
  ])
  public async updateOrganization(
    @Args("input") input: UpdateOrganizationInput,
    @CaslUser() userProxy: UserProxy
  ): Promise<Organization> {
    if (!!input.deletedAt) {
      const user = await userProxy.get();
      this.accessService.assertAbility(user!, Actions.delete, Organization);
    }
    return this.organizationService.update({
      ...input,
      tags: !!input.tagIds
        ? (input.tagIds.map((id) => ({ id })) as any)
        : undefined,
    });
  }

  @Mutation(() => Organization)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.update, Organization, [
    OrganizationService,
    (service: OrganizationService, { params }) =>
      service.findById(params.input.id),
  ])
  public async setOrganizationDetail(
    @Args("input") input: SetOrganizationDetailInput
  ): Promise<Organization> {
    await this.organizationService.upsertDetail(
      { type: input.type, value: input.value },
      input.organizationId
    );
    return this.organizationService.findById(
      input.organizationId
    ) as Promise<Organization>;
  }

  @Mutation(() => OrganizationTag)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.update, Organization)
  public async createOrganizationTag(
    @Args("input") input: CreateOrganizationTagInput
  ): Promise<OrganizationTag> {
    return this.organizationService.createTag(input);
  }

  @Mutation(() => OrganizationMember)
  @UseGuards(AuthGuard, OrganizationRolesGuard)
  public async updateOrganizationMember(
    @Args("input") input: UpdateOrganizationMemberInput,
    @Context("caslUser") caslUser: AuthorizableUser
  ): Promise<OrganizationMember> {
    if (!!input.role) {
      const abilities = this.abilityFactory.createForUser(caslUser);
      const can = abilities.can(
        Actions.update,
        subject(OrganizationMember as any, {
          role: input.role,
          userId: input.userId,
          organizationId: input.organizationId,
        })
      );
      if (!can) throw new ForbiddenException();
    }

    return this.organizationService.upsertMember(input);
  }

  @Mutation(() => Organization)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.delete, OrganizationMember, [
    OrganizationService,
    (service: OrganizationService, { params }) =>
      service.findMember({
        userId: params.input.userId,
        organizationId: params.input.organizationId,
      }),
  ])
  public async removeOrganizationMember(
    @Args("input") input: RemoveOrganizationMemberInput
  ): Promise<Organization> {
    await this.organizationService.removeMember(
      input.organizationId,
      input.userId
    );
    return this.organizationService.findById(
      input.organizationId
    ) as Promise<Organization>;
  }

  @Query(() => Organization)
  public async getOrganization(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Organization | undefined> {
    const organization = await this.organizationService.findById(id);
    if (!organization) throw new NotFoundException();
    return organization;
  }

  @Query(() => [Organization])
  public async getFeaturedOrganizations(
    @Args("limit", { type: () => GraphQLInt }) limit: number
  ): Promise<Organization[]> {
    const organizations = await this.organizationService.findFeatured(limit);
    return organizations;
  }
}

@Resolver(() => User)
@Injectable()
export class UserOrganizationsResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @ResolveField(() => [Organization])
  public async organizations(@Parent() user: User): Promise<Organization[]> {
    return this.organizationService.findByUser(user.id);
  }
}
