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

  public static createTaskDiscordLink(
    taskId: string
  ): GraphQLTestClientRequestBody<{ taskId: string }> {
    return {
      query: `
        mutation CreateTaskDiscordLink($taskId: UUID!) {
          link: createTaskDiscordLink(taskId: $taskId)
        }
      `,
      variables: { taskId },
    };
  }

  public static addUserToDiscordGuild(
    organizationId: string
  ): GraphQLTestClientRequestBody<{ organizationId: string }> {
    return {
      query: `
        mutation AddUserToDiscordGuild($organizationId: UUID!) {
          added: addUserToDiscordGuild(organizationId: $organizationId)
        }
      `,
      variables: { organizationId },
    };
  }
}
