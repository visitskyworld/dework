import React, { FC } from "react";
import {
  GithubPullRequest,
  GithubPullRequestStatusEnum,
} from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Row, Space, Tag, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import Link from "next/link";

const tagColorByStatus: Record<GithubPullRequestStatusEnum, string> = {
  [GithubPullRequestStatusEnum.OPEN]: "green",
  [GithubPullRequestStatusEnum.DONE]: "purple",
  [GithubPullRequestStatusEnum.DRAFT]: "gray",
};

const labelByStatus: Record<GithubPullRequestStatusEnum, string> = {
  [GithubPullRequestStatusEnum.OPEN]: "Open",
  [GithubPullRequestStatusEnum.DONE]: "Done",
  [GithubPullRequestStatusEnum.DRAFT]: "Draft",
};

interface Props {
  pullRequest: GithubPullRequest;
}

export const GithubPullRequestRow: FC<Props> = ({ pullRequest }) => {
  if (Math.random()) {
    return (
      <Button
        type="text"
        href={pullRequest.link}
        target="_blank"
        style={{ padding: 0, margin: "-2px -8px", height: "unset" }}
      >
        <Space style={{ padding: "2px 8px" }}>
          <Avatar icon={<Icons.BranchesOutlined />} size="small" />
          <Col>
            <Typography.Text strong>
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
  }

  return (
    <Row
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "12px",
        alignItems: "center",
        gap: "12px",
        maxWidth: "100%",
      }}
    >
      <Button
        target="_blank"
        href={pullRequest.link}
        style={{ maxWidth: "100%" }}
      >
        <Typography.Text
          ellipsis
        >{`#${pullRequest.number} ${pullRequest.title}`}</Typography.Text>
      </Button>
      <Tag color={tagColorByStatus[pullRequest.status]}>
        {labelByStatus[pullRequest.status]}
      </Tag>
    </Row>
  );
};
