import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateRuleInput {
  @Field(() => RulePermission)
  public permission!: RulePermission;

  @Field({ nullable: true })
  public inverted?: boolean;

  @Field(() => GraphQLUUID)
  public roleId!: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public taskId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public projectId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public fundingSessionId?: string;
}
