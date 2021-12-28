import React, { FC } from "react";
import {
  GithubPullRequest,
  GithubPullRequestStatusEnum,
} from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Space, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";

const tagColorByStatus: Record<GithubPullRequestStatusEnum, string> = {
  [GithubPullRequestStatusEnum.OPEN]: "green",
  [GithubPullRequestStatusEnum.MERGED]: "purple",
  [GithubPullRequestStatusEnum.DRAFT]: "gray",
  [GithubPullRequestStatusEnum.CLOSED]: "red",
};

const labelByStatus: Record<GithubPullRequestStatusEnum, string> = {
  [GithubPullRequestStatusEnum.OPEN]: "Open",
  [GithubPullRequestStatusEnum.MERGED]: "Merged",
  [GithubPullRequestStatusEnum.DRAFT]: "Draft",
  [GithubPullRequestStatusEnum.CLOSED]: "Closed",
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
