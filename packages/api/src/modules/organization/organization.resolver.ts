import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { Organization } from "@dewo/api/models/Organization";
import { RequireGraphQLAuthGuard } from "../auth/auth.guard";
import { OrganizationService } from "./organization.service";
import { User } from "@dewo/api/models/User";
import { CreateOrganizationInput } from "./dto/CreateOrganizationInput";

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
}
