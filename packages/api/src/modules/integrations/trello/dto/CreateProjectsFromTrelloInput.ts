import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectsFromTrelloInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => GraphQLUUID)
  public threepidId!: string;

  @Field(() => [String])
  public boardIds!: string[];
}
