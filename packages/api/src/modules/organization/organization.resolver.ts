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
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateOrganizationInput } from "./dto/UpdateOrganizationInput";
import { OrganizationMemberGuard } from "../auth/guards/organizationMember.guard";

@Resolver(() => Organization)
@Injectable()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @ResolveField(() => [User])
  public async users(@Parent() organization: Organization): Promise<User[]> {
    if (!!organization.users) return organization.users;
    return this.organizationService.getUsers(organization.id);
  }

  @Mutation(() => Organization)
  @UseGuards(RequireGraphQLAuthGuard)
  public async createOrganization(
    @Context("user") user: User,
    @Args("input") input: CreateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.create({
      ...input,
      users: [user],
    });
  }

  @Mutation(() => Organization)
  @UseGuards(RequireGraphQLAuthGuard, OrganizationMemberGuard)
  public async updateOrganization(
    @Args("input") input: UpdateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.update(input);
  }

  @Query(() => Organization)
  public async getOrganization(
    @Args("id", { type: () => GraphQLUUID }) id: string
  ): Promise<Organization | undefined> {
    const organization = await this.organizationService.findById(id);
    if (!organization) throw new NotFoundException();
    return organization;
  }
}
