import {
  OrganizationIntegrationConfigMap,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateOrganizationIntegrationInput {
  @Field(() => OrganizationIntegrationType)
  public type!: OrganizationIntegrationType;

  @Field(() => GraphQLJSONObject, { nullable: true })
  public config?: OrganizationIntegrationConfigMap[OrganizationIntegrationType];

  @Field(() => GraphQLUUID)
  public organizationId!: string;
}
