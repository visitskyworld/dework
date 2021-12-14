import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateInviteInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => OrganizationRole, { nullable: true })
  public role?: OrganizationRole;
}
