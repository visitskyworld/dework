import React, { FC } from "react";
import {
  GithubPullRequest,
  GithubPullRequestStatus,
} from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Space, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";

const tagColorByStatus: Record<GithubPullRequestStatus, string> = {
  [GithubPullRequestStatus.OPEN]: "green",
  [GithubPullRequestStatus.MERGED]: "purple",
  [GithubPullRequestStatus.DRAFT]: "gray",
  [GithubPullRequestStatus.CLOSED]: "red",
};

const labelByStatus: Record<GithubPullRequestStatus, string> = {
  [GithubPullRequestStatus.OPEN]: "Open",
  [GithubPullRequestStatus.MERGED]: "Merged",
  [GithubPullRequestStatus.DRAFT]: "Draft",
  [GithubPullRequestStatus.CLOSED]: "Closed",
};

interface Props {
  pullRequest: GithubPullRequest;
}

export const GithubPullRequestRow: FC<Props> = ({ pullRequest }) => {
  return (
    <Button
      type="text"
      href={pullRequest.link}
      target="_blank"
      style={{
        padding: 0,
        margin: "-2px -8px",
        height: "unset",
        maxWidth: "100%",
      }}
    >
      <Space size="small" style={{ padding: "2px 8px" }}>
        <Avatar icon={<Icons.BranchesOutlined />} size="small" />
        <Col>
          <Typography.Text strong style={{ maxWidth: 240 }} ellipsis>
            #{pullRequest.number}{" "}
            <Typography.Text type="secondary">
              {pullRequest.title}
            </Typography.Text>
          </Typography.Text>
        </Col>
        <Tag color={tagColorByStatus[pullRequest.status]}>
          {labelByStatus[pullRequest.status]}
        </Tag>
      </Space>
    </Button>
  );
};
