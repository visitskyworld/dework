import React, { FC, ReactElement, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Avatar, Row, Space, Typography } from "antd";
import moment from "moment";

interface ActivityFeedItem {
  date: string;
  avatar: ReactElement;
  text: string;
}

interface Props {
  task: TaskDetails;
}

export const TaskActivityFeed: FC<Props> = ({ task }) => {
  const items = useMemo<ActivityFeedItem[]>(
    () => [
      {
        date: task.createdAt,
        avatar: !!task.creator ? (
          <UserAvatar size="small" user={task.creator} />
        ) : (
          <Avatar size="small" icon={<Icons.CalendarOutlined />} />
        ),
        text: `${task.creator?.username ?? "Someone"} created this task`,
      },
      ...task.applications.map((application) => ({
        date: application.createdAt,
        avatar: <UserAvatar size="small" user={application.user} />,
        text: `${application.user.username} applied to this task`,
      })),
      ...task.submissions.map((application) => ({
        date: application.createdAt,
        avatar: <UserAvatar size="small" user={application.user} />,
        text: `${application.user.username} created a submission`,
      })),
      ...(!!task.doneAt
        ? [
            {
              date: task.doneAt,
              avatar: <Avatar size="small" icon={<Icons.CheckOutlined />} />,
              text: `Task completed`,
            },
          ]
        : []),
    ],
    [task]
  );
  return (
    <FormSection label="Activity" className="mb-3">
      <Space direction="vertical" style={{ width: "100%" }}>
        {items.map((item, index) => (
          <Row key={index} align="middle">
            {item.avatar}
            <Typography.Text style={{ marginLeft: 16, flex: 1 }}>
              {item.text}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              className="ant-typography-caption"
            >
              {moment(item.date).format("lll")}
            </Typography.Text>
          </Row>
        ))}
      </Space>
    </FormSection>
  );
};
