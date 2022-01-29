import React, { FC } from "react";
import moment from "moment";
import * as Icons from "@ant-design/icons";
import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Avatar, Row, Space, Typography } from "antd";

interface Props {
  task: TaskDetails;
}

export const TaskActivityFeed: FC<Props> = ({ task }) => {
  if (!task.creator) return null;
  return (
    <FormSection label="Activity" className="mb-3">
      <Space direction="vertical">
        <Row align="middle">
          <UserAvatar size="small" user={task.creator} />
          <Typography.Text style={{ marginLeft: 16, flex: 1 }}>
            Created by {task.creator.username} on{" "}
            {moment(task.createdAt).format("lll")}
          </Typography.Text>
        </Row>
        {!!task.doneAt && (
          <Row align="middle">
            <Avatar size="small" icon={<Icons.CheckOutlined />} />
            <Typography.Text style={{ marginLeft: 16, flex: 1 }}>
              Completed on {moment(task.doneAt).format("lll")}
            </Typography.Text>
          </Row>
        )}
      </Space>
    </FormSection>
  );
};
