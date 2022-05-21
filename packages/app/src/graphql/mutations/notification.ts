import gql from "graphql-tag";
import { notification } from "../fragments/notification";

export const archiveNotification = gql`
  mutation ArchiveNotificationMutation($id: UUID!) {
    archiveNotification(id: $id) {
      ...Notification
      user {
        id
        notificationUnreadCount
      }
    }
  }

  ${notification}
`;

export const markNotificationsRead = gql`
  mutation MarkNotificationsReadMutation($readAt: DateTime!) {
    markNotificationsRead(readAt: $readAt) {
      id
      notificationUnreadCount
      # Fetching this will update the UI right away
      # notificationReadMarker {
      #   readAt
      # }
    }
  }
`;
