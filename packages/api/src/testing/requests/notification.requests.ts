import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class NotificationRequests {
  public static getCount(): GraphQLTestClientRequestBody {
    return {
      query: `
        query NotificationCount {
          me {
            id
            notificationUnreadCount
            notificationReadMarker {
              readAt
            }
          }
        }
      `,
    };
  }

  public static markRead(
    readAt: Date
  ): GraphQLTestClientRequestBody<{ readAt: Date }> {
    return {
      query: `
        mutation MarkNotificationsRead($readAt: DateTime!) {
          me: markNotificationsRead(readAt: $readAt) {
            id
            notificationUnreadCount
            notificationReadMarker {
              readAt
            }
          }
        }
      `,
      variables: { readAt },
    };
  }
}
