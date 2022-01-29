import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectsFromNotionInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => GraphQLUUID)
  public threepidId!: string;
}
