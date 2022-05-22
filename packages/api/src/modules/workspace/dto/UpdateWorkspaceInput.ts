import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateWorkspaceInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public sortKey?: string;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
