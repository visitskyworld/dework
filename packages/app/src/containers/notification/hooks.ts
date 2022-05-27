import { useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  archiveNotification,
  markNotificationsRead,
} from "@dewo/app/graphql/mutations/notification";
import {
  notifications,
  notificationUnreadCount,
} from "@dewo/app/graphql/queries/notification";
import {
  Notification,
  MyNotificationsQuery,
  ArchiveNotificationMutation,
  ArchiveNotificationMutationVariables,
  MyNotificationUnreadCountQuery,
  MarkNotificationsReadMutation,
  MarkNotificationsReadMutationVariables,
} from "@dewo/app/graphql/types";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";

export function useNotifications(): {
  loading: boolean;
  notifications: Notification[] | undefined;
  readAt: moment.Moment | undefined;
} {
  const skip = !useAuthContext().user;
  const { data, loading, refetch } = useQuery<MyNotificationsQuery>(
    notifications,
    { skip }
  );
  useEffect(() => {
    refetch({ skip });
  }, [refetch, skip]);

  const readAtString = data?.me.notificationReadMarker?.readAt;
  const readAt = useMemo(
    () => (!!readAtString ? moment(readAtString) : undefined),
    [readAtString]
  );
  return {
    loading,
    notifications: data?.me.notifications,
    readAt,
  };
}

export function useNotificationUnreadCount(): number | undefined {
  const skip = !useAuthContext().user;
  const { data } = useQuery<MyNotificationUnreadCountQuery>(
    notificationUnreadCount,
    { skip }
  );
  return data?.me.notificationUnreadCount;
}

export function useArchiveNotification(id: string) {
  const [mutation] = useMutation<
    ArchiveNotificationMutation,
    ArchiveNotificationMutationVariables
  >(archiveNotification);
  return useCallback(async () => {
    const res = await mutation({ variables: { id } });
    if (!res.data) throw new Error(JSON.stringify(res.errors));
  }, [mutation, id]);
}

export function useMarkNotificationsRead() {
  const [mutation] = useMutation<
    MarkNotificationsReadMutation,
    MarkNotificationsReadMutationVariables
  >(markNotificationsRead);
  return useCallback(async () => {
    const res = await mutation({
      variables: { readAt: new Date().toISOString() },
    });
    if (!res.data) throw new Error(JSON.stringify(res.errors));
  }, [mutation]);
}
