import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class DiscordRolesRequests {
  public static updateOrganizationDiscordRoles(
    organizationId: string
  ): GraphQLTestClientRequestBody<{
    organizationId: string;
  }> {
    return {
      query: `
        mutation UpdateOrganizationRolesDiscordMutation($organizationId: UUID!) {
          organization: updateOrganizationDiscordRoles(
            organizationId: $organizationId
          ) {
            id
            roles {
              id
              name
            }
          }
        }
      `,
      variables: { organizationId },
    };
  }
}
