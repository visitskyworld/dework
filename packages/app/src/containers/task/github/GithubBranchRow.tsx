import React, { FC } from "react";
import encoder from "uuid-base62";
import { GithubBranch, Task } from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useProject } from "../../project/hooks";

interface Props {
  branch: GithubBranch;
  task: Task;
}

export const GithubBranchRow: FC<Props> = ({ branch, task }) => {
  const project = useProject(task.projectId);
  // TODO(fant): hack
  const taskPermalink =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/o/${encoder.encode(
          project?.organizationId ?? ""
        )}/p/${encoder.encode(task.projectId)}?taskId=${task.id}`;
  const link = `${branch.link}?quick_pull=1&title=${
    task.name
  }&description=${encodeURIComponent(`Task details: ${taskPermalink}`)}`;
  return (
    <Button
      type="text"
      href={link}
      target="_blank"
      style={{ padding: 0, margin: "-2px -8px", height: "unset" }}
    >
      <Space size="small" style={{ padding: "2px 8px" }}>
        <Avatar icon={<Icons.BranchesOutlined />} size="small" />
        <Col>
          <Typography.Text strong>{branch.name}</Typography.Text>
        </Col>
        <Button size="small" icon={<Icons.GithubOutlined />}>
          Open PR
        </Button>
      </Space>
    </Button>
  );
};
