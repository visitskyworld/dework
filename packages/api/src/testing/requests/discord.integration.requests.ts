import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class DiscordIntegrationRequests {
  public static getChannels(
    organizationId: string,
    discordParentChannelId?: string
  ): GraphQLTestClientRequestBody<{
    organizationId: string;
    discordParentChannelId?: string;
  }> {
    return {
      query: `
        query GetDiscordIntegrationChannels(
          $organizationId: UUID!
          $discordParentChannelId: String
        ) {
          channels: getDiscordIntegrationChannels(organizationId: $organizationId, discordParentChannelId: $discordParentChannelId) {
            id
            name
            integrationId
          }
        }
      `,
      variables: { organizationId, discordParentChannelId },
    };
  }
}
