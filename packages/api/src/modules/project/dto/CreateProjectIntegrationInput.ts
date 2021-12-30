import {
  ProjectIntegrationConfigMap,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectIntegrationInput {
  @Field(() => ProjectIntegrationType)
  public type!: ProjectIntegrationType;

  @Field(() => GraphQLJSONObject)
  public config!: ProjectIntegrationConfigMap[ProjectIntegrationType];

  @Field(() => GraphQLUUID)
  public projectId!: string;
}
