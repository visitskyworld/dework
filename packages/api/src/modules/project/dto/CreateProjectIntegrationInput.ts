import {
  ProjectIntegrationSource,
  ProjectIntegrationConfigMap,
} from "@dewo/api/models/ProjectIntegration";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectIntegrationInput {
  @Field(() => ProjectIntegrationSource)
  public source!: ProjectIntegrationSource;

  @Field(() => GraphQLJSONObject)
  public config!: ProjectIntegrationConfigMap[ProjectIntegrationSource];

  @Field(() => GraphQLUUID)
  public projectId!: string;
}
