import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class GetUserPermissionsInput {
  @Field(() => GraphQLUUID, { nullable: true })
  public organizationId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public projectId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public taskId?: string;
}
