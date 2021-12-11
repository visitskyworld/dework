import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateOrganizationMemberInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;

  @Field(() => OrganizationRole)
  public role!: OrganizationRole;
}
