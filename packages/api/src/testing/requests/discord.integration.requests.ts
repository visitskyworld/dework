import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class DiscordIntegrationRequests {
  public static getChannels(
    organizationId: string
  ): GraphQLTestClientRequestBody<{ organizationId: string }> {
    return {
      query: `
        query GetDiscordIntegrationChannels($organizationId: UUID!) {
          channels: getDiscordIntegrationChannels(organizationId: $organizationId) {
            id
            name
            integrationId
          }
        }
      `,
      variables: { organizationId },
    };
  }
}
