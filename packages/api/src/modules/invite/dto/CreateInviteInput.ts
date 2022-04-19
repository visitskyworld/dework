import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateInviteInput {
  @Field(() => GraphQLUUID, { nullable: true })
  public organizationId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public projectId?: string;

  @Field(() => RulePermission)
  public permission!: RulePermission;
}
