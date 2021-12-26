import React, { FC } from "react";
import { GithubBranch, TaskDetails } from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";

interface Props {
  branch: GithubBranch;
  task: TaskDetails;
}

export const GithubBranchRow: FC<Props> = ({ branch, task }) => {
  const openNewPrLink = `${branch.link}?quick_pull=1&title=${
    task.name
  }&body=${encodeURIComponent(`Task details: ${task.permalink}`)}`;

  return (
    <Button
      type="text"
      href={openNewPrLink}
      target="_blank"
      style={{ padding: 0, margin: "-2px -8px", height: "unset" }}
    >
      <Space size="small" style={{ padding: "2px 8px" }}>
        <Avatar icon={<Icons.BranchesOutlined />} size="small" />
        <Col>
          <Typography.Text strong style={{ maxWidth: 240 }} ellipsis>
            {branch.name}
          </Typography.Text>
        </Col>
        <Button size="small" icon={<Icons.GithubOutlined />}>
          Open PR
        </Button>
      </Space>
    </Button>
  );
};
