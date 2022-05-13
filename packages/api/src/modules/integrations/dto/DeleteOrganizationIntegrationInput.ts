import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class DeleteOrganizationIntegrationInput {
  @Field(() => OrganizationIntegrationType)
  public type!: OrganizationIntegrationType;

  @Field(() => GraphQLUUID)
  public organizationId!: string;
}
