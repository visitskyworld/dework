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
import { EntityDetail } from "@dewo/api/models/EntityDetail";
import { SetOrganizationDetailInput } from "./dto/SetOrganizationDetailInput";
import { UpdateOrganizationMemberInput } from "./dto/UpdateOrganizationMemberInput";
import { RemoveOrganizationMemberInput } from "./dto/RemoveOrganizationMemberInput";
import { Project } from "@dewo/api/models/Project";
import { PermalinkService } from "../permalink/permalink.service";
import { AbilityFactory } from "nest-casl/dist/factories/ability.factory";
import { subject } from "@casl/ability";

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
  public permalink(@Parent() organization: Organization): Promise<string> {
    return this.permalinkService.get(organization);
  }

  @ResolveField(() => [OrganizationMember])
  public async members(
    @Parent() organization: Organization
  ): Promise<OrganizationMember[]> {
    if (!!organization.members) return organization.members;
    return this.organizationService.getMembers(organization.id);
  }

  @ResolveField(() => [Project])
  public async projects(
    @Context("user") user: User | undefined,
    @Parent() organization: Organization
  ): Promise<Project[]> {
    return this.organizationService.getProjects(organization.id, user?.id);
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
    return this.organizationService.update(input);
  }

  @Mutation(() => EntityDetail)
  @UseGuards(AuthGuard)
  public async setOrganizationDetail(
    @Args("input") input: SetOrganizationDetailInput
  ): Promise<EntityDetail | void> {
    return this.organizationService.upsertDetail(
      { type: input.type, value: input.value },
      input.organizationId
    ) as Promise<EntityDetail | void>;
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
