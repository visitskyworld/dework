import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { Organization } from "@dewo/api/models/Organization";
import { OrganizationService } from "./organization.service";
import { User } from "@dewo/api/models/User";
import { CreateOrganizationInput } from "./dto/CreateOrganizationInput";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";

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
      users: [user],
    });
  }
}
