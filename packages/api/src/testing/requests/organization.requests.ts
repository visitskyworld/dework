import { CreateOrganizationInput } from "@dewo/api/modules/organization/dto/CreateOrganizationInput";
import { UpdateOrganizationInput } from "@dewo/api/modules/organization/dto/UpdateOrganizationInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class OrganizationRequests {
  private static organizationFragment = `
    fragment Organization on Organization {
      id
      name
      imageUrl
      users {
        id
      }
      tasks {
        id
        projectId
      }
    }
  `;

  public static create(
    input: CreateOrganizationInput
  ): GraphQLTestClientRequestBody<{ input: CreateOrganizationInput }> {
    return {
      query: `
        mutation CreateOrganization($input: CreateOrganizationInput!) {
          organization: createOrganization(input: $input) {
            ...Organization
          }
        }

        ${this.organizationFragment}
      `,
      variables: { input },
    };
  }

  public static update(
    input: UpdateOrganizationInput
  ): GraphQLTestClientRequestBody<{ input: UpdateOrganizationInput }> {
    return {
      query: `
        mutation UpdateOrganization($input: UpdateOrganizationInput!) {
          organization: updateOrganization(input: $input) {
            ...Organization
          }
        }

        ${this.organizationFragment}
      `,
      variables: { input },
    };
  }

  public static get(
    organizationId: string
  ): GraphQLTestClientRequestBody<{ organizationId: string }> {
    return {
      query: `
        query GetOrganization($organizationId: UUID!) {
          organization: getOrganization(id: $organizationId) {
            ...Organization
          }
        }

        ${this.organizationFragment}
      `,
      variables: { organizationId },
    };
  }
}
