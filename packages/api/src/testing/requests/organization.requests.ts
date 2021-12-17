import { CreateOrganizationInput } from "@dewo/api/modules/organization/dto/CreateOrganizationInput";
import { RemoveOrganizationMemberInput } from "@dewo/api/modules/organization/dto/RemoveOrganizationMemberInput";
import { UpdateOrganizationInput } from "@dewo/api/modules/organization/dto/UpdateOrganizationInput";
import { UpdateOrganizationMemberInput } from "@dewo/api/modules/organization/dto/UpdateOrganizationMemberInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class OrganizationRequests {
  private static organizationMemberFragment = `
    fragment OrganizationMember on OrganizationMember {
      id
      role
      userId
    }
  `;

  private static organizationFragment = `
    fragment Organization on Organization {
      id
      name
      imageUrl
      members {
        ...OrganizationMember
      }
      projects {
        id
      }
      tasks {
        id
        projectId
      }
    }

    ${OrganizationRequests.organizationMemberFragment}
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

  public static updateMember(
    input: UpdateOrganizationMemberInput
  ): GraphQLTestClientRequestBody<{ input: UpdateOrganizationMemberInput }> {
    return {
      query: `
        mutation UpdateOrganizationMember($input: UpdateOrganizationMemberInput!) {
          member: updateOrganizationMember(input: $input) {
            ...OrganizationMember
          }
        }

        ${this.organizationMemberFragment}
      `,
      variables: { input },
    };
  }

  public static removeMember(
    input: RemoveOrganizationMemberInput
  ): GraphQLTestClientRequestBody<{ input: RemoveOrganizationMemberInput }> {
    return {
      query: `
        mutation RemoveOrganizationMember($input: RemoveOrganizationMemberInput!) {
          organization: removeOrganizationMember(input: $input) {
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
