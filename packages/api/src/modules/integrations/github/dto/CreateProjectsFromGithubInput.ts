import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectsFromGithubInput {
  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => [String])
  public repoIds!: string[];

  @Field(() => [String], { nullable: true })
  public labelIds?: string[];
}
