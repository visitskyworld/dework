import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class RemoveOrganizationMemberInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;
}
