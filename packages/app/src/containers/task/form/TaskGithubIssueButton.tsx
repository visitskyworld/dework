import React, { FC } from "react";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Button } from "antd";
import * as Icons from "@ant-design/icons";

interface Props {
  task: TaskDetails;
}

export const TaskGithubIssueButton: FC<Props> = ({ task }) => {
  const link = task.githubIssue?.link;
  if (!link) return null;
  return (
    <Button
      target="_blank"
      size="small"
      href={link}
      icon={<Icons.GithubFilled />}
    >
      Github Issue
    </Button>
  );
};
