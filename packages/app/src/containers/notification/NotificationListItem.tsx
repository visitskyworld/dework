import { CloseCircleOutlined } from "@ant-design/icons";
import { OrganizationAvatar } from "@dewo/app/components/OrganizationAvatar";
import { Notification } from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useRunning } from "@dewo/app/util/hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import { Tooltip, Card, List, Button, Breadcrumb } from "antd";
import classNames from "classnames";
import moment from "moment";
import Link from "next/link";
import React, { FC, useCallback, MouseEvent } from "react";
import { useArchiveNotification } from "./hooks";
import styles from "./NotificationList.module.less";

interface Props {
  notification: Notification;
  read: boolean;
}

export const NotificationListItem: FC<Props> = ({ notification, read }) => {
  const navigateToTask = useNavigateToTaskFn();
  const handleClick = useCallback(() => {
    if (!!notification.task) {
      navigateToTask(notification.task.id);
    }
  }, [navigateToTask, notification.task]);

  const archive = useArchiveNotification(notification.id);
  const [handleArchive, archiving] = useRunning(
    useCallback(
      (e: MouseEvent<unknown>) => {
        stopPropagation(e);
        return archive();
      },
      [archive]
    )
  );

  return (
    <Card
      bordered={false}
      size="small"
      style={{ marginBottom: 8, opacity: read ? 0.5 : undefined }}
      className="hover:component-highlight hover:cursor-pointer"
      onClick={handleClick}
    >
      <List.Item className={styles.listItem}>
        <List.Item.Meta
          avatar={
            !!notification.task && (
              <OrganizationAvatar
                organization={notification.task.project.organization}
              />
            )
          }
          title={notification.message}
          description={
            !!notification.task && (
              <Breadcrumb
                separator=""
                className="ant-typography-caption text-secondary"
              >
                <Breadcrumb.Item
                  href={notification.task.project.organization.permalink}
                  onClick={stopPropagation}
                >
                  <Tooltip
                    title={moment(notification.createdAt).calendar()}
                    placement="bottom"
                  >
                    {moment(notification.createdAt).fromNow()}
                  </Tooltip>
                </Breadcrumb.Item>
                <Breadcrumb.Separator children="·" />

                <Link href={notification.task.project.organization.permalink}>
                  <Breadcrumb.Item
                    href={notification.task.project.organization.permalink}
                    onClick={stopPropagation}
                  >
                    {notification.task.project.organization.name}
                  </Breadcrumb.Item>
                </Link>

                <Link href={notification.task.project.permalink}>
                  <Breadcrumb.Item
                    href={notification.task.project.permalink}
                    onClick={stopPropagation}
                  >
                    {notification.task.project.name}
                  </Breadcrumb.Item>
                </Link>

                <Link href={notification.task.permalink}>
                  <Breadcrumb.Item
                    href={notification.task.permalink}
                    onClick={stopPropagation}
                  >
                    {notification.task.name}
                  </Breadcrumb.Item>
                </Link>
              </Breadcrumb>
            )
          }
        />
        {/* only visible on hover */}
        <Tooltip title="Archive this notification">
          <Button
            type="text"
            icon={<CloseCircleOutlined />}
            loading={archiving}
            className={classNames(styles.archiveButton, "text-secondary")}
            onClick={handleArchive}
          />
        </Tooltip>
      </List.Item>
    </Card>
  );
};
