import { CreateOrganizationInput } from "@dewo/api/modules/organization/dto/CreateOrganizationInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class OrganizationRequests {
  public static create(
    input: CreateOrganizationInput
  ): GraphQLTestClientRequestBody<{ input: CreateOrganizationInput }> {
    return {
      query: `
        mutation CreateOrganization($input: CreateOrganizationInput!) {
          organization: createOrganization(input: $input) {
            id
            name
            imageUrl
            users {
              id
            }
          }
        }
      `,
      variables: { input },
    };
  }
}
