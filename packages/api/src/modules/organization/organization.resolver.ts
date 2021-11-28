import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationService } from "./organization.service";
import { User } from "@dewo/api/models/User";
import { CreateOrganizationInput } from "./dto/CreateOrganizationInput";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import { OrganizationMemberGuard } from "../auth/guards/organizationMember.guard";
import GraphQLUUID from "graphql-type-uuid";

@Injectable()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => Organization)
  @UseGuards(RequireGraphQLAuthGuard)
  public async createOrganization(
    @Context("user") user: User,
    @Args("input") input: CreateOrganizationInput
  ): Promise<Organization> {
    return this.organizationService.create({
      ...input,
      users: Promise.resolve([user]),
    });
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
