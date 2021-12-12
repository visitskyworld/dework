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
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationService } from "./organization.service";
import { User } from "@dewo/api/models/User";
import { CreateOrganizationInput } from "./dto/CreateOrganizationInput";
import { AuthGuard } from "../auth/guards/auth.guard";
import { GraphQLInt } from "graphql";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateOrganizationInput } from "./dto/UpdateOrganizationInput";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { OrganizationRolesGuard } from "./organization.roles.guard";
import { OrganizationMember } from "@dewo/api/models/OrganizationMember";
import { UpdateOrganizationMemberInput } from "./dto/UpdateOrganizationMemberInput";
import { RemoveOrganizationMemberInput } from "./dto/RemoveOrganizationMemberInput";

@Resolver(() => Organization)
@Injectable()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @ResolveField(() => [OrganizationMember])
  public async members(
    @Parent() organization: Organization
  ): Promise<OrganizationMember[]> {
    if (!!organization.members) return organization.members;
    return this.organizationService.getMembers(organization.id);
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
    @Args("input") input: UpdateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.update(input);
  }

  @Mutation(() => OrganizationMember)
  @UseGuards(AuthGuard, OrganizationRolesGuard, AccessGuard)
  @UseAbility(Actions.update, OrganizationMember, [
    OrganizationService,
    (service: OrganizationService, { params }) =>
      service.findMember({
        userId: params.input.userId,
        organizationId: params.input.organizationId,
      }),
  ])
  public async updateOrganizationMember(
    @Args("input") input: UpdateOrganizationMemberInput
  ): Promise<OrganizationMember> {
    return this.organizationService.updateMember(
      input.organizationId,
      input.userId,
      input.role
    );
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
