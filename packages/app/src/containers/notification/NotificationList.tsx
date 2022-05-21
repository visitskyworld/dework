import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { Divider, Image, Empty, Spin, Typography } from "antd";
import _ from "lodash";
import moment from "moment";
import React, { FC, Fragment, useEffect, useMemo } from "react";
import { useMarkNotificationsRead, useNotifications } from "./hooks";
import { NotificationListItem } from "./NotificationListItem";
import InboxZeroGraphic from "@dewo/app/assets/inbox-zero.svg";

const formatDate = (date: string) => {
  const dateString = moment(date).calendar({
    // https://stackoverflow.com/a/41260094/12338002
    lastDay: "[Yesterday]",
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    lastWeek: "[last] dddd",
    nextWeek: "dddd",
    sameElse: "L",
  });

  return dateString[0].toUpperCase() + dateString.slice(1);
};

export const NotificationList: FC = () => {
  const { loading, notifications, readAt } = useNotifications();
  const unarchivedNotifications = useMemo(
    () => notifications?.filter((n) => !n.archivedAt),
    [notifications]
  );
  const inboxZero = useMemo(
    () => unarchivedNotifications?.length === 0,
    [unarchivedNotifications]
  );
  const notificationsByDate = useMemo(
    () =>
      _.groupBy(unarchivedNotifications, (n) =>
        moment(n.createdAt).startOf("day").toISOString()
      ),
    [unarchivedNotifications]
  );

  const lastNotificationCreatedAt = notifications?.[0]?.createdAt;
  const markNotificationsRead = useMarkNotificationsRead();
  useEffect(() => {
    if (loading || !lastNotificationCreatedAt) return;
    if (!readAt || readAt.isBefore(lastNotificationCreatedAt)) {
      markNotificationsRead();
    }
  }, [loading, lastNotificationCreatedAt, readAt, markNotificationsRead]);

  return (
    <>
      <Typography.Title style={{ textAlign: "center" }}>Inbox</Typography.Title>
      {!!notifications ? (
        _.map(notificationsByDate, (notificationsByDate, date) => (
          <Fragment key={date}>
            <Divider plain style={{ marginTop: 40 }}>
              {formatDate(date)}
            </Divider>
            {notificationsByDate.map((n) => (
              <HeadlessCollapse key={n.id} expanded={!n.archivedAt}>
                <NotificationListItem
                  notification={n}
                  read={!!readAt?.isAfter(n.createdAt)}
                />
              </HeadlessCollapse>
            ))}
          </Fragment>
        ))
      ) : (
        <div style={{ display: "grid", placeItems: "center" }}>
          <Spin />
        </div>
      )}
      {inboxZero && (
        <Empty
          imageStyle={{ height: 200, marginTop: 40, marginBottom: 40 }}
          className="text-secondary"
          description="You're all caught up"
          image={
            <Image
              src={InboxZeroGraphic.src}
              preview={false}
              width="100%"
              height="100%"
            />
          }
        />
      )}
    </>
  );
};
