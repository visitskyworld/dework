import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import _ from "lodash";
import GraphQLFields from "graphql-fields";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationService } from "./organization.service";
import { User } from "@dewo/api/models/User";
import { CreateOrganizationInput } from "./dto/CreateOrganizationInput";
import { AuthGuard } from "../auth/guards/auth.guard";
import { GraphQLInt } from "graphql";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateOrganizationInput } from "./dto/UpdateOrganizationInput";
import { OrganizationTag } from "@dewo/api/models/OrganizationTag";
import { CreateOrganizationTagInput } from "./dto/CreateOrganizationTagInput";
import { SetOrganizationDetailInput } from "./dto/SetOrganizationDetailInput";
import { Project } from "@dewo/api/models/Project";
import { PermalinkService } from "../permalink/permalink.service";
import { ProjectTokenGate } from "@dewo/api/models/ProjectTokenGate";
import { ProjectSection } from "@dewo/api/models/ProjectSection";
import { RoleGuard } from "../rbac/rbac.guard";
import { Repository } from "typeorm";
import { Role } from "@dewo/api/models/rbac/Role";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLResolveInfo } from "graphql";

@Resolver(() => Organization)
@Injectable()
export class OrganizationResolver {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly permalinkService: PermalinkService,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>
  ) {}

  @ResolveField(() => String)
  public permalink(
    @Context("origin") origin: string,
    @Parent() organization: Organization
  ): Promise<string> {
    return this.permalinkService.get(organization, origin);
  }

  @ResolveField(() => [ProjectSection])
  public async projectSections(
    @Parent() organization: Organization
  ): Promise<ProjectSection[]> {
    const sections = await organization.projectSections;
    return sections.filter((s) => !s.deletedAt);
  }

  @ResolveField(() => [User])
  public async users(
    @Parent() organization: Organization,
    @Info() info: GraphQLResolveInfo
  ): Promise<User[]> {
    const fields = Object.keys(GraphQLFields(info as any));
    return this.organizationService.getUsers(organization.id, {
      joinUserRoles: fields.includes("roles"),
    });
  }

  @ResolveField(() => [Role])
  public async roles(@Parent() organization: Organization): Promise<Role[]> {
    return this.roleRepo
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.rules", "rule")
      .where("role.organizationId = :organizationId", {
        organizationId: organization.id,
      })
      .getMany();
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
  @UseGuards(AuthGuard)
  public async createOrganization(
    @Context("user") user: User,
    @Args("input") input: CreateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.create(input, user);
  }

  @Mutation(() => Organization)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Organization,
      inject: [OrganizationService],
      getSubject: (
        params: { input: UpdateOrganizationInput },
        service: OrganizationService
      ) => service.findById(params.input.id),
      getOrganizationId: (subject) => subject.id,
    })
  )
  public async updateOrganization(
    @Args("input") input: UpdateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.update({
      ...input,
      tags: !!input.tagIds
        ? (input.tagIds.map((id) => ({ id })) as any)
        : undefined,
    });
  }

  @Mutation(() => Organization)
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Organization,
      inject: [OrganizationService],
      getSubject: (
        params: { input: SetOrganizationDetailInput },
        service: OrganizationService
      ) => service.findById(params.input.organizationId),
      getOrganizationId: (subject) => subject.id,
    })
  )
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
  @UseGuards(
    AuthGuard,
    RoleGuard({
      action: "update",
      subject: Organization,
      inject: [OrganizationService],
      getSubject: (
        params: { input: CreateOrganizationTagInput },
        service: OrganizationService
      ) => service.findById(params.input.organizationId),
      getOrganizationId: (subject) => subject.id,
    })
  )
  public async createOrganizationTag(
    @Args("input") input: CreateOrganizationTagInput
  ): Promise<OrganizationTag> {
    return this.organizationService.createTag(input);
  }

  @Query(() => Organization)
  public async getOrganization(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Organization | undefined> {
    const organization = await this.organizationService.findById(id);
    if (!organization) throw new NotFoundException();
    return organization;
  }

  @Query(() => Organization)
  public async getOrganizationBySlug(
    @Args("slug") slug: string
  ): Promise<Organization> {
    const organization = await this.organizationService.findBySlug(slug);
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

  @Query(() => [Organization])
  public async getPopularOrganizations(): Promise<Organization[]> {
    return this.organizationService.findPopular();
  }
}

@Resolver(() => User)
@Injectable()
export class UserOrganizationsResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @ResolveField(() => [Organization])
  public async organizations(
    @Context("user") requestingUser: User | undefined,
    @Parent() user: User
  ): Promise<Organization[]> {
    return this.organizationService.findByUser(user.id, {
      excludeHidden: requestingUser?.id !== user.id,
    });
  }
}
