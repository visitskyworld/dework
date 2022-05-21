import gql from "graphql-tag";
import { notification } from "../fragments/notification";

export const notifications = gql`
  query MyNotificationsQuery {
    me {
      id
      notificationUnreadCount
      notificationReadMarker {
        readAt
      }
      notifications {
        ...Notification
      }
    }
  }

  ${notification}
`;

export const notificationUnreadCount = gql`
  query MyNotificationUnreadCountQuery {
    me {
      id
      notificationUnreadCount
    }
  }
`;
