import React, { FC } from "react";
import moment from "moment";
import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Row, Typography } from "antd";

interface Props {
  task: TaskDetails;
}

export const TaskActivityFeed: FC<Props> = ({ task }) => {
  if (!task.creator) return null;
  return (
    <FormSection label="Activity" className="mb-3">
      <Row align="middle">
        <UserAvatar size="small" user={task.creator} />
        <Typography.Text style={{ marginLeft: 8 }}>
          Created by {task.creator.username} on{" "}
          {moment(task.createdAt).format("lll")}
        </Typography.Text>
      </Row>
    </FormSection>
  );
};
